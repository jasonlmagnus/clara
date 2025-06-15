import { NextRequest, NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";
import os from "os";
import OpenAI from "openai";
import ffmpeg from "fluent-ffmpeg";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Note: Vercel has a 4.5MB limit on the request body for serverless functions on the Hobby plan.
// For larger files, this needs to be deployed on a platform that supports larger request bodies,
// or use a different upload method like pre-signed URLs to S3.
// We will proceed assuming the environment can handle larger files.
const MAX_FILE_SIZE = 24 * 1024 * 1024; // 24MB to be safe

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured." },
      { status: 500 }
    );
  }

  const tempDir = path.join(os.tmpdir(), `clara-upload-${Date.now()}`);
  await fs.ensureDir(tempDir);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const fileArrayBuffer = await file.arrayBuffer();
    const originalFilePath = path.join(tempDir, file.name);
    await fs.writeFile(originalFilePath, new Uint8Array(fileArrayBuffer));

    let transcriptText = "";

    if (file.size < MAX_FILE_SIZE) {
      // Process small files directly
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(originalFilePath),
        model: "whisper-1",
      });
      transcriptText = transcription.text;
    } else {
      // Split and process large files
      const chunkPaths = await splitAudio(originalFilePath, tempDir);
      const transcriptions = [];
      for (const chunkPath of chunkPaths) {
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(chunkPath),
          model: "whisper-1",
        });
        transcriptions.push(transcription.text);
      }
      transcriptText = transcriptions.join(" ");
    }

    // Read the prompt and JSON template
    const promptsDir = path.join(process.cwd(), "prompts");
    const dataDir = path.join(process.cwd(), "data");
    const systemPrompt = await fs.readFile(path.join(promptsDir, "transcript-to-json.md"), "utf-8");
    const jsonTemplate = await fs.readFile(path.join(dataDir, "clara-feedback-template.json"), "utf-8");

    // Use Chat Completions to map transcript to JSON
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Here is the transcript:\n\n${transcriptText}\n\nPlease fill out this JSON template based on the transcript:\n\n${jsonTemplate}`,
        },
      ],
    });

    const jsonContent = chatResponse.choices[0].message.content;
    if (!jsonContent) {
      throw new Error("Failed to generate JSON from transcript.");
    }

    return NextResponse.json(JSON.parse(jsonContent));
  } catch (error) {
    console.error("Error in transcription/analysis:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    // Clean up the temporary directory
    await fs.remove(tempDir);
  }
}

function splitAudio(filePath: string, outputDir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const chunkDuration = 10 * 60; // 10 minutes
    const chunkPaths: string[] = [];
    let chunkIndex = 0;

    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const totalDuration = metadata.format.duration;
      if (!totalDuration) return reject(new Error("Could not determine audio duration."));

      const command = ffmpeg(filePath)
        .outputOptions([
          "-f", "segment",
          "-segment_time", `${chunkDuration}`,
          "-c", "copy",
        ])
        .on("end", () => resolve(chunkPaths))
        .on("error", (err) => reject(err))
        .on("filenames", (filenames: string[]) => {
          chunkPaths.push(...filenames.map(name => path.join(outputDir, name)));
        });
      
      const outputPathPattern = path.join(outputDir, 'chunk-%03d.mp4');
      command.output(outputPathPattern).run();
    });
  });
} 