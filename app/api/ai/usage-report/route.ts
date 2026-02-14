// ==========================================================
// HisabDesk — AI Usage Report Route
// ----------------------------------------------------------
// PURPOSE
//   Final production endpoint for AI usage dashboard
//
//   Returns:
//     ✓ total tokens
//     ✓ total cost
//     ✓ remaining budget
//     ✓ projected monthly cost
//     ✓ module breakdown
//     ✓ health status
//
//   Used by:
//     Profile → "AI Usage / Cost" section
//
//   Flow:
//     ai_logs → report builder → clean JSON
//
// RULES
//   ✓ server-side only
//   ✓ NO OpenAI calls
//   ✓ cheap aggregation only
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

import { buildAIUsageReport } from "@/lib/ai/report"

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
    // Fetch monthly logs
    // ------------------------------------------------------

    const { data } = await supabase
      .from("ai_logs")
      .select("module, tokens, created_at")
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth)

    const rows = (data || []).map((r: any) => ({
      module: r.module,
      tokens: r.tokens || 0,
      created_at: r.created_at,
    }))

    // ------------------------------------------------------
    // Build report
    // ------------------------------------------------------

    const report = buildAIUsageReport(rows)

    return NextResponse.json(report)
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 401 }
    )
  }
}
