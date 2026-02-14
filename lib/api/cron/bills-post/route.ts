import { NextResponse } from "next/server"
import { getBillsOverview } from "@/lib/api/bills/service"
import { autoPostBills } from "@/lib/api/bills/autoPostEngine"

export async function GET() {
  const userId = "system"

  const overview = await getBillsOverview(userId)

  await autoPostBills(userId, overview.bills)

  return NextResponse.json({ ok: true })
}
