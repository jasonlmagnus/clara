import { NextRequest, NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const { reportId } = params;
    
    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID is required" },
        { status: 400 }
      );
    }

    const storageDir = path.join(process.cwd(), "storage");
    const reportFilePath = path.join(storageDir, `${reportId}.json`);

    // Check if the report file exists
    const exists = await fs.pathExists(reportFilePath);
    if (!exists) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    // Read and return the report data
    const reportData = await fs.readJson(reportFilePath);
    return NextResponse.json(reportData);

  } catch (error) {
    console.error("Error fetching report:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 