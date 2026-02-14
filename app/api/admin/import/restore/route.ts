import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/*
  PHASE 18 — Import / Restore Backup

  POST /api/admin/import/restore
  Body: JSON backup file created from export

  Restores:
  - income
  - expense
  - subscriptions
  - analytics_events
  - audit_logs
*/

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      income = [],
      expense = [],
      subscriptions = [],
      analytics = [],
      audits = [],
    } = body

    if (income.length)
      await supabase.from("income").insert(income)

    if (expense.length)
      await supabase.from("expense").insert(expense)

    if (subscriptions.length)
      await supabase.from("subscriptions").insert(subscriptions)

    if (analytics.length)
      await supabase.from("analytics_events").insert(analytics)

    if (audits.length)
      await supabase.from("audit_logs").insert(audits)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Restore failed" }, { status: 500 })
  }
}
