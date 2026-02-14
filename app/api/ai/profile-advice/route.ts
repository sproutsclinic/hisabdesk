// ==========================================================
// HisabDesk — AI Profile Advice Route
// ----------------------------------------------------------
// PURPOSE
//   AI insights for Profile / Financial Preferences page
//
//   Helps user:
//     • savings target
//     • emergency fund
//     • investment split
//     • risk alignment
//
// FLOW
//   DB → financial_profile → profileAdvisor → compact prompt → AI
//
// RULES
//   ✓ server-side only
//   ✓ cheap model (module → GPT-3.5)
//   ✓ short bullets only
//   ✓ token efficient
//   ✓ logs usage
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

import { getFinancialProfile } from "@/lib/api/profile"
import { analyzeProfile } from "@/lib/modules/personal"
import { runAI } from "@/lib/ai/openai"

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
// POST
// ==========================================================

export async function POST() {
  try {
    const user = await getUser()

    // ------------------------------------------------------
    // Fetch profile
    // ------------------------------------------------------

    const profile = await getFinancialProfile(user.id)

    // ------------------------------------------------------
    // Analyze
    // ------------------------------------------------------

    const advice = analyzeProfile({
      monthlyIncome: profile.monthly_income,
      monthlyExpense: profile.monthly_expense,
      dependents: profile.dependents,
      riskLevel: profile.risk_level,
      age: profile.age,
    })

    // ------------------------------------------------------
    // Prompt (compact)
    // ------------------------------------------------------

    const prompt = `
Profile Metrics:
savingsTarget=${advice.recommendedSavingsRate}
monthlySave=${advice.monthlySavingsTarget}
emergencyFund=${advice.emergencyFundTarget}
equity=${advice.recommendedInvestmentSplit.equity}
debt=${advice.recommendedInvestmentSplit.debt}

Give 4 short bullet financial habit or planning tips.
`

    // ------------------------------------------------------
    // AI call (cheap)
    // ------------------------------------------------------

    const result = await runAI({
      prompt,
      type: "module",
    })

    // ------------------------------------------------------
    // Log usage
    // ------------------------------------------------------

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "profile-advice",
      tokens: result.usage?.total_tokens ?? 0,
    })

    return NextResponse.json({
      insights: result.text,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 401 }
    )
  }
}
