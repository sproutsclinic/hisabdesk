/**
 * =========================================================
 * Cron Route – Organization Reminders Trigger
 * HisabDesk – Automation Entry Point
 * =========================================================
 *
 * PURPOSE
 * Runs scheduled reminders:
 *
 *   ✓ GST filing
 *   ✓ Subscription expiry
 *   ✓ Bookkeeping inactivity
 *
 * CONNECTS TO
 *   lib/cron/org-reminders.ts
 *
 * SECURITY
 * Protected via CRON_SECRET header
 *
 * ENV REQUIRED
 * CRON_SECRET=some_random_long_string
 *
 * DEPLOY
 * Vercel → Cron → Daily 09:00 IST
 *
 * =========================================================
 */

import { NextResponse } from "next/server"
import { runOrgReminders } from "@/lib/cron/org-reminders"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/* =========================================================
   GET (Cron Trigger)
========================================================= */

export async function GET(req: Request) {
  try {
    const secret = req.headers.get("x-cron-secret")

    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const count = await runOrgReminders()

    return NextResponse.json({
      ok: true,
      reminders_sent: count,
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Cron failed" },
      { status: 500 }
    )
  }
}
