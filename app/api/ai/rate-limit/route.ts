// ==========================================================
// HisabDesk — AI Rate Limit Guard Route
// ----------------------------------------------------------
// PURPOSE
//   Enforce monthly AI usage cap per user
//
//   Protects:
//     ✓ runaway OpenAI costs
//     ✓ abuse
//     ✓ accidental loops
//
//   Used by:
//     All AI routes BEFORE calling OpenAI
//
//   Pattern:
//     await checkAIRateLimit(user.id)
//
// RULES
//   ✓ server-side only
//   ✓ no OpenAI calls
//   ✓ cheap DB check
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const supabase = createClient()

// ==========================================================
// CONFIG
// ==========================================================

// $5 monthly cap (your decision)
const MONTHLY_DOLLAR_LIMIT = 5

// same blended estimate used in usage-summary
const COST_PER_1K = 0.002

// ==========================================================
// HELPERS
// ==========================================================

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  return user
}

async function getMonthlyCost(userId: string) {
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString()

  const { data } = await supabase
    .from("ai_logs")
    .select("tokens")
    .eq("user_id", userId)
    .gte("created_at", startOfMonth)

  const totalTokens =
    (data || []).reduce(
      (s, r) => s + (r.tokens || 0),
      0
    )

  return (totalTokens / 1000) * COST_PER_1K
}

// ==========================================================
// GET — check limit
// ==========================================================
//
// Response:
//   { allowed: true/false, used, limit }
//
// ==========================================================

export async function GET() {
  try {
    const user = await getUser()

    const used = await getMonthlyCost(user.id)

    const allowed = used < MONTHLY_DOLLAR_LIMIT

    return NextResponse.json({
      allowed,
      used: Number(used.toFixed(2)),
      limit: MONTHLY_DOLLAR_LIMIT,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 401 }
    )
  }
}
