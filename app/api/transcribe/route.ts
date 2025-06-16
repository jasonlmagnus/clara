import { NextRequest, NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";
import os from "os";
import crypto from "crypto";
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
    const metadataRaw = formData.get("metadata") as string | null;
    const metadata = metadataRaw ? JSON.parse(metadataRaw) : null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const fileArrayBuffer = await file.arrayBuffer();
    const originalFilePath = path.join(tempDir, file.name);
    await fs.writeFile(originalFilePath, new Uint8Array(fileArrayBuffer));

    // Convert to WAV format for better Whisper compatibility
    const convertedFilePath = path.join(tempDir, `converted_${file.name.replace(/\.[^/.]+$/, "")}.wav`);
    await new Promise<void>((resolve, reject) => {
      ffmpeg(originalFilePath)
        .toFormat('wav')
        .audioCodec('pcm_s16le')
        .audioChannels(1)
        .audioFrequency(16000)
        .on('end', () => {
          console.log('Audio conversion completed');
          resolve();
        })
        .on('error', (err) => {
          console.error('Audio conversion failed:', err);
          reject(err);
        })
        .save(convertedFilePath);
    });

    // Use converted file for transcription
    const audioFilePath = convertedFilePath;

    let transcriptText = "";

    console.log(`Processing audio file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

    // Check converted file exists and get stats
    const fileStats = await fs.stat(audioFilePath);
    console.log(`Converted file: ${audioFilePath}, size on disk: ${fileStats.size} bytes`);

    if (file.size < MAX_FILE_SIZE) {
      // Process small files directly
      console.log("Processing converted file directly with Whisper...");
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "whisper-1",
      });
      transcriptText = transcription.text;
      console.log(`Whisper transcription result: "${transcriptText}" (length: ${transcriptText.length})`);
    } else {
      // Split and process large files
      console.log("File is large, splitting into chunks...");
      const chunkPaths = await splitAudio(audioFilePath, tempDir);
      console.log(`Created ${chunkPaths.length} chunks:`, chunkPaths);
      
      const transcriptions = [];
      for (let i = 0; i < chunkPaths.length; i++) {
        const chunkPath = chunkPaths[i];
        console.log(`Processing chunk ${i + 1}/${chunkPaths.length}: ${chunkPath}`);
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(chunkPath),
          model: "whisper-1",
        });
        console.log(`Chunk ${i + 1} transcription: "${transcription.text}" (length: ${transcription.text.length})`);
        transcriptions.push(transcription.text);
      }
      transcriptText = transcriptions.join(" ");
      console.log(`Combined transcript from ${transcriptions.length} chunks: "${transcriptText}" (total length: ${transcriptText.length})`);
    }

    console.log(`Final transcript length: ${transcriptText.length} characters`);
    console.log(`Transcript content preview: "${transcriptText.substring(0, 200)}..."`);

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

    // Parse the JSON and add metadata
    const parsedJson = JSON.parse(jsonContent);
    const reportId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    // Add metadata to the JSON
    const reportData = {
      ...parsedJson,
      report_id: reportId,
      original_filename: file.name,
      created_at: timestamp,
      metadata,
    };

    // Save both JSON report and transcript to storage
    const storageDir = path.join(process.cwd(), "storage");
    await fs.ensureDir(storageDir);
    
    // Save JSON report
    const jsonFilePath = path.join(storageDir, `${reportId}.json`);
    await fs.writeFile(jsonFilePath, JSON.stringify(reportData, null, 2));
    
    // Save raw transcript as .txt file
    const transcriptFilePath = path.join(storageDir, `${reportId}_transcript.txt`);
    const transcriptHeader = `CLARA Interview Transcript
Generated: ${new Date(timestamp).toLocaleString()}
Original File: ${file.name}
Report ID: ${reportId}

${'='.repeat(50)}

`;
    await fs.writeFile(transcriptFilePath, transcriptHeader + transcriptText);

    return NextResponse.json(reportData);
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
    const chunkDuration = 10 * 60; // 10 minutes in seconds
    const chunkPaths: string[] = [];

    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(new Error(`Failed to get audio duration: ${err.message}`));
      }
      
      const duration = metadata.format.duration;
      if (typeof duration === 'undefined') {
        return reject(new Error("Could not determine audio duration."));
      }

      // If the file is shorter than the chunk duration, no need to split.
      // Return the original file path in an array.
      if (duration <= chunkDuration) {
        console.log("Audio is shorter than chunk duration, no splitting needed.");
        resolve([filePath]);
        return;
      }
      
      const outputPattern = path.join(outputDir, "chunk-%03d.wav");
      
      ffmpeg(filePath)
        .outputOptions([
          '-f segment',
          `-segment_time ${chunkDuration}`,
          '-c copy',
        ])
        .output(outputPattern)
        .on('end', () => {
          // After splitting, find all the generated chunk files
          fs.readdir(outputDir)
            .then(files => {
              const generatedChunks = files
                .filter(file => file.startsWith('chunk-') && file.endsWith('.wav'))
                .map(file => path.join(outputDir, file))
                .sort(); // Sort to maintain order
              console.log(`Successfully split into ${generatedChunks.length} chunks.`);
              resolve(generatedChunks);
            })
            .catch(readErr => {
              reject(new Error(`Failed to read chunk files from output directory: ${readErr.message}`));
            });
        })
        .on('error', (splitErr) => {
          reject(new Error(`Error during audio splitting: ${splitErr.message}`));
        })
        .run();
    });
  });
} 