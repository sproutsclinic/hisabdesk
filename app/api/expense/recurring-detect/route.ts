ï»¿/* =========================================================
   Expense Recurring Detection API
   ---------------------------------------------------------
   Detect subscriptions / EMI / rent automatically
   Pure analytics (no AI cost)
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
       last 6 months expenses
    =============================================== */

    const { data: rows } = await supabase
      .from("expenses")
      .select("id, date, amount, notes, category")
      .eq("user_id", user.id)
      .order("date", { ascending: false })

    if (!rows?.length) return NextResponse.json({ data: [] })

    /* ===============================================
       group by notes (merchant name)
    =============================================== */

    const groups: Record<string, any[]> = {}

    rows.forEach((r) => {
      const key = (r.notes || "Unknown").toLowerCase()

      if (!groups[key]) groups[key] = []
      groups[key].push(r)
    })

    const recurring: any[] = []

    /* ===============================================
       detect recurring
    =============================================== */

    for (const [merchant, tx] of Object.entries(groups)) {
      if (tx.length < 3) continue

      const sorted = tx.sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      const amounts = sorted.map((t) => Number(t.amount))

      const sameAmount =
        Math.max(...amounts) - Math.min(...amounts) < 5

      if (!sameAmount) continue

      const gaps: number[] = []

      for (let i = 1; i < sorted.length; i++) {
        const d1 = new Date(sorted[i - 1].date).getTime()
        const d2 = new Date(sorted[i].date).getTime()
        gaps.push((d2 - d1) / (1000 * 60 * 60 * 24))
      }

      const avgGap =
        gaps.reduce((a, b) => a + b, 0) / gaps.length

      if (avgGap > 25 && avgGap < 35) {
        recurring.push({
          merchant,
          amount: amounts[0],
          frequency: "Monthly",
          count: sorted.length,
        })
      }
    }

    return NextResponse.json({ data: recurring })
  } catch {
    return NextResponse.json({ data: [] })
  }
}
