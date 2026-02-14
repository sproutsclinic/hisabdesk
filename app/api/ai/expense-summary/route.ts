/* =========================================================
   HisabDesk — AI Expense Summary Route
========================================================= */

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { runAI } from "@/lib/ai/openai"

export const dynamic = "force-dynamic"

/* ========================================================= */

export async function POST() {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { data: rows } = await supabase
      .from("transactions")
      .select("amount,date,category,type")
      .eq("user_id", user.id)
      .eq("type", "expense")

    const tx = rows || []

    const total = tx.reduce((s, t) => s + Number(t.amount), 0)

    const monthsMap: Record<string, number> = {}
    const catMap: Record<string, number> = {}

    for (const t of tx) {
      const m = t.date.slice(0, 7)

      monthsMap[m] = (monthsMap[m] || 0) + Number(t.amount)
      catMap[t.category] =
        (catMap[t.category] || 0) + Number(t.amount)
    }

    const monthly = Object.values(monthsMap)
    const months = monthly.length || 1

    const avg = total / months

    const variance =
      monthly.reduce(
        (s, v) => s + Math.pow(v - avg, 2),
        0
      ) / months

    const volatility = Math.sqrt(variance)

    const topCategory =
      Object.entries(catMap).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "None"

    const prompt = `
Expense Metrics:
total=${Math.round(total)}
avgMonthly=${Math.round(avg)}
months=${months}
volatility=${Math.round(volatility)}
topCategory=${topCategory}

Give 3 short actionable bullet insights.
Return plain text only.
`

    const result = await runAI({
      prompt,
      type: "module",
    })

    return NextResponse.json({
      insights: result.text ?? "",
    })
  } catch {
    return NextResponse.json({
      insights: "",
    })
  }
}