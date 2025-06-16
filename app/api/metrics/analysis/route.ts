import { NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";

export async function GET() {
  try {
    const storageDir = path.join(process.cwd(), "storage");
    await fs.ensureDir(storageDir);
    const clientEntries = await fs.readdir(storageDir, { withFileTypes: true });

    const industryCounts: Record<string, number> = {};
    const competitorCounts: Record<string, number> = {};
    let totalInsights = 0;

    for (const client of clientEntries) {
      if (!client.isDirectory()) continue;
      const clientPath = path.join(storageDir, client.name);
      const reports = await fs.readdir(clientPath, { withFileTypes: true });

      for (const rep of reports) {
        if (!rep.isDirectory()) continue;
        const reportDir = path.join(clientPath, rep.name);
        const metadataPath = path.join(reportDir, "metadata.json");
        const reportPath = path.join(reportDir, "report.json");

        if (await fs.pathExists(metadataPath)) {
          try {
            const metadata = await fs.readJson(metadataPath);
            if (metadata.industry) {
              industryCounts[metadata.industry] =
                (industryCounts[metadata.industry] || 0) + 1;
            }
            if (metadata.competitor) {
              competitorCounts[metadata.competitor] =
                (competitorCounts[metadata.competitor] || 0) + 1;
            }
          } catch (err) {
            console.error(`Error reading ${metadataPath}:`, err);
          }
        }

        if (await fs.pathExists(reportPath)) {
          try {
            const report = await fs.readJson(reportPath);
            const insightCount =
              report.interview_structure
                ?.flatMap((s: any) => s.questions || [])
                .filter((q: any) => q && q.answer).length || 0;
            totalInsights += insightCount;
          } catch (err) {
            console.error(`Error reading ${reportPath}:`, err);
          }
        }
      }
    }

    return NextResponse.json({
      industryCounts,
      competitorCounts,
      totalInsights,
    });
  } catch (error) {
    console.error("Error computing analysis metrics:", error);
    const msg = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
