import { NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";

export async function GET() {
  try {
    const storageDir = path.join(process.cwd(), "storage");
    await fs.ensureDir(storageDir);
    const clientEntries = await fs.readdir(storageDir, { withFileTypes: true });

    const deals: any[] = [];

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
            const status = (await fs.pathExists(reportPath)) ? "Complete" : "Pending";
            deals.push({
              id: metadata.report_id,
              company: metadata.company,
              value: metadata.dealValue,
              accountLead: metadata.accountLead,
              competitor: metadata.competitor,
              industry: metadata.industry,
              interviewDate: metadata.interviewDate,
              status,
            });
          } catch (err) {
            console.error(`Error processing ${metadataPath}:`, err);
          }
        }
      }
    }

    return NextResponse.json(deals);
  } catch (error) {
    console.error("Error computing deal metrics:", error);
    const msg = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
