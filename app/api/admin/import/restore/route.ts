ï»¿import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

/*
  PHASE 18 Ã¢â‚¬â€ Import / Restore Backup
*/

const supabase = getSupabaseAdmin()

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
