import { NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";

export async function GET() {
  try {
    const storageDir = path.join(process.cwd(), 'storage');
    await fs.ensureDir(storageDir);
    const files = await fs.readdir(storageDir);

    const reports = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(storageDir, file);
        const reportData = await fs.readJson(filePath);
        // Extract only the necessary metadata
        reports.push({
          report_id: reportData.report_id,
          title: reportData.original_filename.replace(/\.(mp4|mp3|wav|m4a)$/i, ''),
          type: "Individual Analysis", // Placeholder
          status: "Complete", // Placeholder
          generated: reportData.created_at,
          dealsAnalyzed: 1, // Placeholder
          insights: reportData.interview_structure?.flatMap((s:any) => s.questions).filter((q:any) => q.answer).length || 0,
        });
      }
    }

    // Sort reports by creation date, newest first
    reports.sort((a, b) => new Date(b.generated).getTime() - new Date(a.generated).getTime());

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 