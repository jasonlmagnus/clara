import { NextRequest, NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";

async function findReportById(reportId: string): Promise<string | null> {
  const storageDir = path.join(process.cwd(), "storage");
  const companies = await fs.readdir(storageDir, { withFileTypes: true });

  for (const company of companies) {
    if (company.isDirectory()) {
      const companyPath = path.join(storageDir, company.name);
      const reportPath = path.join(companyPath, reportId);
      if (await fs.pathExists(reportPath)) {
        return reportPath;
      }
    }
  }

  return null;
}

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

    const reportPath = await findReportById(reportId);

    if (!reportPath) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    const transcriptFilePath = path.join(reportPath, "transcript.txt");
    
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