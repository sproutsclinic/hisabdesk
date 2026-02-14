// ==========================================================
// HisabDesk — AI Automation Advice Route
// ----------------------------------------------------------
// PURPOSE
//   AI insights for Automation page
//
//   Helps user:
//     • detect recurring expenses
//     • suggest auto rules
//     • reduce manual tracking
//
// FLOW
//   DB → transactions → automationAdvisor → compact prompt → AI
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

import { getTransactionsByRange } from "@/lib/api/transactions"
import { detectAutomationSuggestions } from "@/lib/modules/personal"
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

    const today = new Date()

    // last 3 months for pattern detection
    const start = new Date(
      today.getFullYear(),
      today.getMonth() - 3,
      1
    )
      .toISOString()
      .split("T")[0]

    const end = today.toISOString().split("T")[0]

    // ------------------------------------------------------
    // Fetch transactions
    // ------------------------------------------------------

    const tx = await getTransactionsByRange(
      user.id,
      start,
      end
    )

    const mapped = tx.map((t: any) => ({
      description: t.description,
      amount: t.amount,
      category_id: t.category_id,
      date: t.date,
      type: t.type,
    }))

    // ------------------------------------------------------
    // Detect recurring patterns
    // ------------------------------------------------------

    const suggestions =
      detectAutomationSuggestions(mapped)

    const monthlyCount = suggestions.filter(
      (s) => s.frequency === "monthly"
    ).length

    const weeklyCount = suggestions.filter(
      (s) => s.frequency === "weekly"
    ).length

    const possibleAutoTotal = suggestions.reduce(
      (sum, s) =>
        sum +
        (s.frequency === "monthly"
          ? s.amount
          : s.amount * 4),
      0
    )

    // ------------------------------------------------------
    // Prompt (compact)
    // ------------------------------------------------------

    const prompt = `
Automation Metrics:
monthlyRecurring=${monthlyCount}
weeklyRecurring=${weeklyCount}
possibleAutoAmount=${Math.round(possibleAutoTotal)}

Give 4 short bullet tips to automate finances and reduce manual work.
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
      module: "automation-advice",
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
