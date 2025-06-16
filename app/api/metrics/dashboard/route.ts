import { NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";

export async function GET() {
  try {
    const storageDir = path.join(process.cwd(), "storage");
    await fs.ensureDir(storageDir);
    const clientEntries = await fs.readdir(storageDir, { withFileTypes: true });

    let totalDeals = 0;
    let analyzedDeals = 0;
    const competitorCounts: Record<string, number> = {};

    for (const client of clientEntries) {
      if (!client.isDirectory()) continue;
      const clientPath = path.join(storageDir, client.name);
      const reports = await fs.readdir(clientPath, { withFileTypes: true });

      for (const rep of reports) {
        if (!rep.isDirectory()) continue;
        totalDeals++;
        const reportDir = path.join(clientPath, rep.name);
        const metadataPath = path.join(reportDir, "metadata.json");
        const reportPath = path.join(reportDir, "report.json");

        try {
          if (await fs.pathExists(metadataPath)) {
            const metadata = await fs.readJson(metadataPath);
            if (metadata.competitor) {
              competitorCounts[metadata.competitor] =
                (competitorCounts[metadata.competitor] || 0) + 1;
            }
          }
          if (await fs.pathExists(reportPath)) {
            analyzedDeals++;
          }
        } catch (err) {
          console.error(`Error processing ${reportDir}:`, err);
        }
      }
    }

    const totalClients = clientEntries.filter((e) => e.isDirectory()).length;
    const topCompetitors = Object.entries(competitorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return NextResponse.json({
      totalClients,
      totalDeals,
      analyzedDeals,
      unanalyzedDeals: totalDeals - analyzedDeals,
      topCompetitors,
    });
  } catch (error) {
    console.error("Error computing dashboard metrics:", error);
    const msg = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
