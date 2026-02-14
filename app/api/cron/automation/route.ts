// ==========================================================
// Cron — Automation Runner
// Route: /api/cron/automation
//
// PURPOSE
// Central scheduled worker for:
// - recurring transactions
// - bill reminders
// - loan tracking
// - notifications
//
// Runs via:
// - Vercel Cron
// - or external scheduler
//
// ARCHITECTURE
// API (this file)
//   → services only
//   → NO business logic here
//
// SECURITY
// - requires CRON_SECRET header
// - server only
// ==========================================================

import { NextRequest, NextResponse } from "next/server"

import { runRecurringAutomation } from "@/lib/api/automation/automation.service"
import { runBillsReminders } from "@/lib/api/bills/bills.service"
import { runLoanTracking } from "@/lib/api/loans/loans.service"
import { runNotificationsDispatch } from "@/lib/api/notifications/notifications.service"

/* =========================================================
POST /api/cron/automation
========================================================= */

export async function POST(req: NextRequest) {
  try {
    // ------------------------------------------------------
    // Secret guard (required for cron)
    // ------------------------------------------------------

    const secret = req.headers.get("x-cron-secret")

    if (!secret || secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized cron access" },
        { status: 401 }
      )
    }

    // ------------------------------------------------------
    // Execute workers (sequential = safer + predictable)
    // ------------------------------------------------------

    const results = {
      recurring: 0,
      bills: 0,
      loans: 0,
      notifications: 0,
    }

    // NOTE:
    // All logic must live inside services

    results.recurring = await runRecurringAutomation()
    results.bills = await runBillsReminders()
    results.loans = await runLoanTracking()
    results.notifications = await runNotificationsDispatch()

    // ------------------------------------------------------
    // Done
    // ------------------------------------------------------

    return NextResponse.json(
      {
        ok: true,
        ...results,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (err) {
    console.error("[CRON_AUTOMATION_ERROR]", err)

    return NextResponse.json(
      { error: "Cron execution failed" },
      { status: 500 }
    )
  }
}

/* =========================================================
Optional GET healthcheck
========================================================= */

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "HisabDesk automation cron endpoint alive",
  })
}
