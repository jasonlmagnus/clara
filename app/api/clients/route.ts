import { NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";

export async function GET() {
  try {
    const storageDir = path.join(process.cwd(), "storage");
    await fs.ensureDir(storageDir);
    const entries = await fs.readdir(storageDir, { withFileTypes: true });
    const clients = entries.filter(e => e.isDirectory()).map(e => e.name);
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    const msg = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
