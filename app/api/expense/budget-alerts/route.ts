ï»¿/* =========================================================
   Expense Budget Alerts API
   ---------------------------------------------------------
   Detects:
   âœ“ near limit (>80%)
   âœ“ over budget (>100%)
   Pure server analytics (no AI cost)
========================================================= */

import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    /* ===============================================
       current month range
    =============================================== */

    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    /* ===============================================
       fetch budgets
    =============================================== */

    const { data: budgets } = await supabase
      .from("budgets")
      .select("category, limit_amount")
      .eq("user_id", user.id)

    if (!budgets?.length)
      return NextResponse.json({ data: [] })

    /* ===============================================
       fetch this month expenses
    =============================================== */

    const { data: expenses } = await supabase
      .from("expenses")
      .select("category, amount, date")
      .eq("user_id", user.id)
      .gte("date", start.toISOString().slice(0, 10))
      .lte("date", end.toISOString().slice(0, 10))

    /* ===============================================
       aggregate spend by category
    =============================================== */

    const spentMap: Record<string, number> = {}

    expenses?.forEach((e) => {
      const key = e.category || "Other"
      spentMap[key] = (spentMap[key] || 0) + Number(e.amount)
    })

    /* ===============================================
       compare
    =============================================== */

    const alerts: any[] = []

    budgets.forEach((b) => {
      const spent = spentMap[b.category] || 0
      const limit = Number(b.limit_amount)

      const percent = limit > 0 ? (spent / limit) * 100 : 0

      if (percent >= 100) {
        alerts.push({
          type: "over",
          category: b.category,
          spent,
          limit,
          percent: Math.round(percent),
        })
      } else if (percent >= 80) {
        alerts.push({
          type: "warning",
          category: b.category,
          spent,
          limit,
          percent: Math.round(percent),
        })
      }
    })

    return NextResponse.json({ data: alerts })
  } catch {
    return NextResponse.json({ data: [] })
  }
}
