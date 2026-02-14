// ==========================================================
// HisabDesk — AI Health Check Route
// ----------------------------------------------------------
// PURPOSE
//   Internal diagnostics for AI subsystem
//
//   Shows:
//     ✓ monthly usage
//     ✓ estimated cost
//     ✓ remaining budget
//     ✓ system status
//
//   Used by:
//     - Profile → AI Usage card
//     - Admin monitoring
//
// RULES
//   ✓ server-side only
//   ✓ NO OpenAI calls
//   ✓ cheap DB aggregation only
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { AI_COST } from "@/lib/ai/constants"

export const dynamic = "force-dynamic"

const supabase = createClient()

// ==========================================================
// AUTH
// ==========================================================

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  return user
}

// ==========================================================
// GET
// ==========================================================

export async function GET() {
  try {
    const user = await getUser()

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toISOString()

    // ------------------------------------------------------
    // Fetch usage logs
    // ------------------------------------------------------

    const { data } = await supabase
      .from("ai_logs")
      .select("tokens")
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth)

    const rows = data || []

    const totalTokens = rows.reduce(
      (s, r) => s + (r.tokens || 0),
      0
    )

    const cost =
      (totalTokens / 1000) * AI_COST.COST_PER_1K_TOKENS

    const remaining =
      AI_COST.MONTHLY_LIMIT_DOLLARS - cost

    // ------------------------------------------------------
    // Response
    // ------------------------------------------------------

    return NextResponse.json({
      status: "ok",
      monthTokens: totalTokens,
      estimatedCost: Number(cost.toFixed(2)),
      remainingBudget: Number(
        Math.max(0, remaining).toFixed(2)
      ),
      limit: AI_COST.MONTHLY_LIMIT_DOLLARS,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 401 }
    )
  }
}
