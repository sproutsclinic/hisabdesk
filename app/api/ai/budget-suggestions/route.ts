// ==========================================================
// HisabDesk — AI Budget Suggestions
// PURPOSE
//   Analyze 3 months spending
//   Suggest smart category limits
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { runAI } from "@/lib/ai/openai"

export const dynamic = "force-dynamic"

// ==========================================================

function monthKey(date: string) {
  return date.slice(0, 7)
}

// ==========================================================

export async function POST() {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ------------------------------------------------------
    // Fetch last 3 months expenses
    // ------------------------------------------------------

    const since = new Date()
    since.setMonth(since.getMonth() - 3)

    const { data: rows } = await supabase
      .from("expenses")
      .select("amount, category, date")
      .eq("user_id", user.id)
      .gte("date", since.toISOString().slice(0, 10))

    if (!rows?.length) {
      return NextResponse.json({
        suggestions: "Not enough expense data yet.",
      })
    }

    // ------------------------------------------------------
    // Aggregate category spend
    // ------------------------------------------------------

    const categoryMap: Record<string, number> = {}

    for (const r of rows) {
      categoryMap[r.category] =
        (categoryMap[r.category] || 0) + Number(r.amount)
    }

    const categories = Object.entries(categoryMap)
      .map(([k, v]) => `${k}:${Math.round(v)}`)
      .join(",")

    const total = Object.values(categoryMap).reduce(
      (a, b) => a + b,
      0
    )

    // ------------------------------------------------------
    // Compact AI prompt (cheap + fast)
    // ------------------------------------------------------

    const prompt = `
Total=${Math.round(total)}
Categories=${categories}

Suggest:
- ideal monthly limits per category
- 1 savings target
- 3 short tips
Short bullets only.
`

    const result = await runAI({
      prompt,
      type: "module",
    })

    // log usage
    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "budget-suggestions",
      tokens: result.usage?.total_tokens ?? 0,
    })

    return NextResponse.json({
      suggestions: result.text,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    )
  }
}
