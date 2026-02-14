import { runAutomation } from "@/lib/server/automation/runner";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await runAutomation();

  return NextResponse.json({ ok: true });
}