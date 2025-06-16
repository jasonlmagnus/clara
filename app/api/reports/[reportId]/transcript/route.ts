import { NextRequest, NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await params;
    
    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID is required" },
        { status: 400 }
      );
    }

    const storageDir = path.join(process.cwd(), "storage");
    const transcriptFilePath = path.join(storageDir, `${reportId}_transcript.txt`);

    // Check if transcript file exists
    const transcriptExists = await fs.pathExists(transcriptFilePath);
    if (!transcriptExists) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    // Read and return the transcript
    const transcriptContent = await fs.readFile(transcriptFilePath, "utf-8");
    
    return NextResponse.json({
      report_id: reportId,
      transcript: transcriptContent,
    });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 }
    );
  }
} 