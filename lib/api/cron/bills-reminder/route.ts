import { NextResponse } from "next/server"
import { getBillsOverview } from "@/lib/api/bills/service"
import { getUpcomingReminders } from "@/lib/api/bills/reminderEngine"

export async function GET() {
  const overview = await getBillsOverview("system")

  const reminders = getUpcomingReminders(overview.bills)

  console.log("Reminder count:", reminders.length)

  return NextResponse.json({ ok: true })
}
