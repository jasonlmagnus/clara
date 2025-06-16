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
        { error: "Report not found" },
        { status: 404 }
      );
    }

    const reportFilePath = path.join(reportPath, "report.json");
    const metadataFilePath = path.join(reportPath, "metadata.json");

    const reportData = await fs.readJson(reportFilePath);
    const metadata = await fs.readJson(metadataFilePath);
    
    // Combine metadata and report data for the response
    const combinedData = {
      ...metadata,
      ...reportData
    };

    return NextResponse.json(combinedData);

  } catch (error) {
    console.error("Error fetching report:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 