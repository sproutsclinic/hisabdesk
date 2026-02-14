// ==========================================================
// HisabDesk — AI Bill Optimizer Route
// ----------------------------------------------------------
// PURPOSE
//   AI insights for Bills / Subscriptions page
//
// FLOW
//   DB → bills → subscriptionAdvisor → compact prompt → AI
//
// RULES
//   ✓ server-side only
//   ✓ GPT-3.5 (module type)
//   ✓ short bullets only
//   ✓ token efficient
//   ✓ logs usage
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { listBills } from "@/lib/api/bills"
import { analyzeSubscriptions } from "@/lib/modules/personal"
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
    // Fetch bills
    // ------------------------------------------------------

    const bills = await listBills(user.id)

    const subscriptions = bills.map((b: any) => ({
      id: b.id,
      name: b.name,
      amount: b.amount,
      frequency: b.frequency,
      isActive: true,
    }))

    // ------------------------------------------------------
    // Analyze
    // ------------------------------------------------------

    // NOTE:
    // We don't know exact income here → pass 1 to avoid divide by zero
    const summary = analyzeSubscriptions(subscriptions, 1)

    const expensiveCount = summary.advices.filter(
      (a) => a.status !== "normal"
    ).length

    const totalMonthly = summary.totalMonthlyCost
    const potentialSave = summary.advices.reduce(
      (s, a) => s + a.suggestedSaving,
      0
    )

    // ------------------------------------------------------
    // Prompt (compact)
    // ------------------------------------------------------

    const prompt = `
Bills Metrics:
monthlyCost=${totalMonthly}
yearlyCost=${summary.yearlyEquivalent}
problematic=${expensiveCount}
possibleSave=${Math.round(potentialSave)}

Give 4 short bullet tips to reduce subscription waste.
`

    // ------------------------------------------------------
    // AI call
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
      module: "bill-optimizer",
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
