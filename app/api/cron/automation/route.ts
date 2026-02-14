// ==========================================================
// Cron — Automation Runner
// Route: /api/cron/automation
// ==========================================================

import { NextRequest, NextResponse } from "next/server"

import { runRecurringAutomation } from "@/lib/api/automation/automation.service"
import { runBillsReminders } from "@/lib/api/bills/bills.service"
import { runNotificationsDispatch } from "@/lib/api/notifications/notifications.service"

/* =========================================================
POST /api/cron/automation
========================================================= */

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-cron-secret")

    if (!secret || secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized cron access" },
        { status: 401 }
      )
    }

    // Only run modules that ACTUALLY EXIST right now
    const results = {
      recurring: 0,
      bills: 0,
      notifications: 0,
    }

    results.recurring = await runRecurringAutomation()
    results.bills = await runBillsReminders()
    results.notifications = await runNotificationsDispatch()

    return NextResponse.json({
      ok: true,
      ...results,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error("[CRON_AUTOMATION_ERROR]", err)

    return NextResponse.json(
      { error: "Cron execution failed" },
      { status: 500 }
    )
  }
}

/* ========================================================= */

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "HisabDesk automation cron endpoint alive",
  })
}