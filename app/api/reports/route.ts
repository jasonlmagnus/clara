import { NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";

async function findReports(directory: string): Promise<any[]> {
  const allReports = [];
  const companies = await fs.readdir(directory, { withFileTypes: true });

  for (const company of companies) {
    if (company.isDirectory()) {
      const companyPath = path.join(directory, company.name);
      const reports = await fs.readdir(companyPath, { withFileTypes: true });
      
      for (const report of reports) {
        if (report.isDirectory()) {
          const reportPath = path.join(companyPath, report.name);
          const reportFilePath = path.join(reportPath, "report.json");
          const metadataFilePath = path.join(reportPath, "metadata.json");

          try {
            if (await fs.pathExists(reportFilePath) && await fs.pathExists(metadataFilePath)) {
              const reportData = await fs.readJson(reportFilePath);
              const metadata = await fs.readJson(metadataFilePath);
              
              allReports.push({
                report_id: metadata.report_id,
                title: `${metadata.company} – ${metadata.original_filename.replace(/\.(mp4|mp3|wav|m4a)$/i, '')}`,
                type: "Individual Analysis", // Placeholder
                status: "Complete", // Placeholder
                generated: metadata.created_at,
                dealsAnalyzed: 1, // Placeholder
                insights: reportData.interview_structure?.flatMap((s:any) => s.questions || []).filter((q:any) => q && q.answer).length || 0,
              });
            }
          } catch (error) {
            console.error(`Error processing report in ${reportPath}:`, error);
          }
        }
      }
    }
  }

  return allReports;
}

export async function GET() {
  try {
    const storageDir = path.join(process.cwd(), 'storage');
    await fs.ensureDir(storageDir);

    const reports = await findReports(storageDir);

    // Sort reports by creation date, newest first
    reports.sort((a, b) => new Date(b.generated).getTime() - new Date(a.generated).getTime());

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 