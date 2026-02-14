// ==========================================================
// HisabDesk — AI Planner Advice Route
// ----------------------------------------------------------
// PURPOSE
//   AI insights for Wealth Planner / Retirement / FIRE page
//
// FLOW
//   DB → goals/assets → planners → compact prompt → AI
//
// RULES
//   ✓ server-side only
//   ✓ HEAVY reasoning → GPT-4 (type: "heavy")
//   ✓ still short output
//   ✓ token efficient prompt
//   ✓ logs usage
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

import { listAssets } from "@/lib/api/assets"
import { listGoals } from "@/lib/api/goals"

import {
  calculateFIRE,
  calculateRetirementPlan,
  analyzeGoals,
} from "@/lib/modules/personal"

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
    // Fetch data
    // ------------------------------------------------------

    const [assets, goals] = await Promise.all([
      listAssets(user.id),
      listGoals(user.id),
    ])

    const currentSavings = assets.reduce(
      (s: number, a: any) => s + a.current_value,
      0
    )

    // ------------------------------------------------------
    // Goal analysis
    // ------------------------------------------------------

    const goalSummary = analyzeGoals(goals)

    const totalRequiredMonthly =
      goalSummary.totalRequiredMonthly

    // ------------------------------------------------------
    // Retirement + FIRE estimates (simple defaults)
    // ------------------------------------------------------

    const fire = calculateFIRE({
      currentAge: 30,
      retirementAge: 60,
      currentSavings,
      monthlyInvestment: 0,
      expectedReturnRate: 10,
      annualExpenses: 600000,
    })

    const retirement = calculateRetirementPlan({
      currentAge: 30,
      retirementAge: 60,
      lifeExpectancy: 85,
      currentSavings,
      monthlyInvestment: 0,
      currentMonthlyExpense: 50000,
      inflationRate: 6,
      expectedReturnRate: 10,
    })

    // ------------------------------------------------------
    // Prompt (compact, reasoning heavy)
    // ------------------------------------------------------

    const prompt = `
Planner Metrics:
currentSavings=${Math.round(currentSavings)}
fireTarget=${fire.fireNumber}
fireGap=${fire.shortfall}
retirementCorpus=${retirement.retirementCorpusRequired}
retirementGap=${retirement.shortfall}
monthlyNeeded=${Math.round(totalRequiredMonthly)}

Give 4 short bullet wealth/retirement planning actions.
`

    // ------------------------------------------------------
    // AI call (heavy → GPT-4 policy)
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
      module: "planner-advice",
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
