// ==========================================================
// HisabDesk — AI Usage Summary Route
// ----------------------------------------------------------
// PURPOSE
//   Track AI cost + token usage per user
//
//   Why:
//     • enforce $5/month budget
//     • show usage stats in Profile
//     • prevent runaway costs
//
//   Reads from:
//     ai_logs table
//
//   Returns:
//     • total tokens
//     • estimated cost
//     • per-module breakdown
//
// RULES
//   ✓ server-side only
//   ✓ no OpenAI calls
//   ✓ lightweight aggregation
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const supabase = createClient()

// ==========================================================
// CONFIG — cost assumptions (cheap + safe)
// ----------------------------------------------------------
// GPT-3.5 avg: ~$0.0005 per 1K tokens
// GPT-4 heavy avg: ~$0.01 per 1K tokens
// We'll approximate blended cost conservatively
// ==========================================================

const COST_PER_1K = 0.002 // blended estimate

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
    // Fetch logs
    // ------------------------------------------------------

    const { data: logs } = await supabase
      .from("ai_logs")
      .select("module, tokens")
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth)

    const rows = logs || []

    let totalTokens = 0

    const moduleMap: Record<string, number> = {}

    for (const r of rows) {
      totalTokens += r.tokens || 0

      moduleMap[r.module] =
        (moduleMap[r.module] || 0) + (r.tokens || 0)
    }

    // ------------------------------------------------------
    // Cost estimate
    // ------------------------------------------------------

    const estimatedCost =
      (totalTokens / 1000) * COST_PER_1K

    // ------------------------------------------------------
    // Response
    // ------------------------------------------------------

    return NextResponse.json({
      totalTokens,
      estimatedCost: Number(estimatedCost.toFixed(2)),
      breakdown: moduleMap,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 401 }
    )
  }
}
