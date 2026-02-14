// ==========================================================
// HisabDesk — AI Tax Advice Route
// ----------------------------------------------------------
// PURPOSE
//   AI insights for Tax Planning page
//
// FLOW
//   DB → tax_profile → taxAdvisor → compact prompt → AI
//
// RULES
//   ✓ server-side only
//   ✓ GPT-4 (tax = complex reasoning)
//   ✓ short bullets only
//   ✓ token efficient prompt
//   ✓ logs usage
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

import { getTaxProfile } from "@/lib/api/tax"
import { analyzeTax } from "@/lib/modules/personal"
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
    // Fetch tax profile
    // ------------------------------------------------------

    const profile = await getTaxProfile(user.id)

    // ------------------------------------------------------
    // Analyze tax
    // ------------------------------------------------------

    const advice = analyzeTax({
      income: profile.income,
      deductions80C: profile.deduction_80c,
      deductions80D: profile.deduction_80d,
      hraExemption: profile.hra_exemption,
      homeLoanInterest: profile.home_loan_interest,
      otherDeductions: profile.other_deductions,
    })

    // ------------------------------------------------------
    // Prompt (compact)
    // ------------------------------------------------------

    const prompt = `
Tax Metrics:
oldTax=${advice.oldTax}
newTax=${advice.newTax}
recommended=${advice.recommendedRegime}
saving=${advice.savings}
deductionUse=${advice.deductionUtilization}
gap=${advice.improvementPotential}

Give 4 short bullet tax saving actions for India.
`

    // ------------------------------------------------------
    // AI call (heavy → GPT-4)
    // ------------------------------------------------------

    const result = await runAI({
      prompt,
      type: "heavy",
    })

    // ------------------------------------------------------
    // Log usage
    // ------------------------------------------------------

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "tax-advice",
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
