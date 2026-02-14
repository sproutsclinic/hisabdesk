// ==========================================================
// HisabDesk — AI Wealth Advisor (SAFE VERSION)
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { runAI } from "@/lib/ai/openai"

export const dynamic = "force-dynamic"

/* =========================================================
   AUTH (SAFE)
========================================================= */

async function getServerUser() {
  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  return { user, supabase }
}

/* =========================================================
   POST
========================================================= */

export async function POST() {
  try {
    const ctx = await getServerUser()

    if (!ctx) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { user, supabase } = ctx

    /* =====================================================
       LOAD RAW NUMBERS (SAFE)
    ===================================================== */

    const [
      { data: income },
      { data: expense },
      { data: portfolio },
      { data: loans },
    ] = await Promise.all([
      supabase.from("income").select("amount"),
      supabase.from("expenses").select("amount"),
      supabase.from("portfolio").select("value"),
      supabase.from("loans").select("balance"),
    ])

    /* =====================================================
       SAFE CALCULATIONS (no NaN)
    ===================================================== */

    const totalIncome =
      income?.reduce((s, r) => s + Number(r.amount || 0), 0) || 0

    const totalExpense =
      expense?.reduce((s, r) => s + Number(r.amount || 0), 0) || 0

    const assets =
      portfolio?.reduce((s, r) => s + Number(r.value || 0), 0) || 0

    const liabilities =
      loans?.reduce((s, r) => s + Number(r.balance || 0), 0) || 0

    const savings = totalIncome - totalExpense
    const netWorth = assets - liabilities

    const savingsRate =
      totalIncome > 0
        ? Math.round((savings / totalIncome) * 100)
        : 0

    /* =====================================================
       COMPACT PROMPT
    ===================================================== */

    const prompt = `
Wealth metrics:
income=${Math.round(totalIncome)}
expense=${Math.round(totalExpense)}
savings=${Math.round(savings)}
savingsRate=${savingsRate}
assets=${Math.round(assets)}
liabilities=${Math.round(liabilities)}
netWorth=${Math.round(netWorth)}

Give 4 short bullet tips to:
- grow wealth faster
- reduce risk
- improve savings
Keep concise.
`

    /* =====================================================
       AI CALL
    ===================================================== */

    const result = await runAI({
      prompt,
      type: "module",
    })

    /* =====================================================
       LOG USAGE (non-blocking)
    ===================================================== */

    try {
      await supabase.from("ai_logs").insert({
        user_id: user.id,
        module: "wealth-advice",
        tokens: result.usage?.total_tokens ?? 0,
      })
    } catch {
      // logging must never break response
    }

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json({
      insights: result.text,
    })
  } catch (err) {
    console.error("wealth advice error:", err)

    return NextResponse.json(
      { error: "Failed to generate advice" },
      { status: 500 }
    )
  }
}