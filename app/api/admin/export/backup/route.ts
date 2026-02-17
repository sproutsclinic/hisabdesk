ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

/*
  PHASE 18 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Export Backup (Admin)

  Exports full JSON backup of:
  - users
  - incomes
  - expenses
  - subscriptions
  - analytics_events
  - audit_logs

  GET /api/admin/export/backup
*/

const supabase = getSupabaseAdmin()

export async function GET() {
  try {
    const [
      users,
      incomes,
      expenses,
      subs,
      events,
      audits,
    ] = await Promise.all([
      supabase.from("users").select("*"),
      supabase.from("income").select("*"),
      supabase.from("expense").select("*"),
      supabase.from("subscriptions").select("*"),
      supabase.from("analytics_events").select("*"),
      supabase.from("audit_logs").select("*"),
    ])

    const backup = {
      exported_at: new Date().toISOString(),
      users: users.data || [],
      income: incomes.data || [],
      expense: expenses.data || [],
      subscriptions: subs.data || [],
      analytics: events.data || [],
      audits: audits.data || [],
    }

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="hisabdesk-backup.json"`,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}

