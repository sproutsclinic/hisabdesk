/* =========================================================
   HisabDesk — AI Income Summary Route (HARDENED)
   ---------------------------------------------------------
   ✓ server only
   ✓ per-request client
   ✓ guard based auth
   ✓ thin controller
   ✓ compact prompt
   ✓ cheap model
========================================================= */

import { NextRequest, NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/lib/security/guards"


import { runAI } from "@/lib/ai/openai"

export const dynamic = "force-dynamic"

/* =========================================================
Helpers
========================================================= */

function monthKey(date: string) {
  return date.slice(0, 7)
}

/* =========================================================
POST
========================================================= */

export async function POST(req: NextRequest) {
  try {
    /* -----------------------------------------------------
       Auth (centralized guard)
    ----------------------------------------------------- */

    const user = await requireUser()

    /* -----------------------------------------------------
       Supabase (per request)
    ----------------------------------------------------- */

    const supabase = createClient()

    /* -----------------------------------------------------
       Date range (last 6 months)
    ----------------------------------------------------- */

    const today = new Date()

    const start = new Date(
      today.getFullYear(),
      today.getMonth() - 5,
      1,
    )
      .toISOString()
      .split("T")[0]

    const end = today.toISOString().split("T")[0]

    /* -----------------------------------------------------
       Fetch transactions
    ----------------------------------------------------- */

    const tx = await getTransactionsByRange(
      user.id,
      start,
      end,
      "income",
    )

    /* -----------------------------------------------------
       Analytics (engine-level math only)
    ----------------------------------------------------- */

    const total = tx.reduce((s: number, t: any) => s + t.amount, 0)

    const monthMap: Record<string, number> = {}

    for (const t of tx) {
      const m = monthKey(t.date)
      monthMap[m] = (monthMap[m] || 0) + t.amount
    }

    const monthly = Object.values(monthMap)
    const months = monthly.length || 1

    const avg = total / months

    const variance =
      monthly.reduce((s, v) => s + Math.pow(v - avg, 2), 0) /
      months

    const volatility = Math.sqrt(variance)

    /* -----------------------------------------------------
       Prompt (token efficient)
    ----------------------------------------------------- */

    const prompt = `
Income Metrics:
total=${Math.round(total)}
avgMonthly=${Math.round(avg)}
months=${months}
volatility=${Math.round(volatility)}

Give 4 short bullet tips for improving income stability or growth.
`

    /* -----------------------------------------------------
       AI call (cheap)
    ----------------------------------------------------- */

    const result = await runAI({
      prompt,
      type: "module",
    })

    /* -----------------------------------------------------
       Log usage
    ----------------------------------------------------- */

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "income-summary",
      tokens: result.usage?.total_tokens ?? 0,
    })

    /* -----------------------------------------------------
       IMPORTANT: match UI contract
    ----------------------------------------------------- */

    return NextResponse.json({
      advice: result.text, // ← UI expects advice
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "AI failed" },
      { status: 401 },
    )
  }
}
