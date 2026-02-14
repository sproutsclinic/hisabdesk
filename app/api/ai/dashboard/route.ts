// ==========================================================
// HisabDesk — AI Dashboard Insights Route
// AI-native financial summary for Dashboard
// Server-side only (NEVER client)
// Uses cheap model (GPT-3.5 class)
// Short, bullet insights only
// Logs usage to ai_logs
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { getCashflowSummary, getBurnRate } from "@/lib/api/analytics"
import { getNetWorthSummary } from "@/lib/api/networth"
import { getGoalsSummary } from "@/lib/api/goals"
import { runAI } from "@/lib/ai/openai"
import { buildDashboardPrompt } from "@/lib/ai/prompts"

export const dynamic = "force-dynamic"

const supabase = createClient()

// ==========================================================
// AUTH HELPER
// ==========================================================

async function getUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) throw new Error("Unauthorized")

  return user
}

// ==========================================================
// POST → Generate dashboard AI insights
// ==========================================================

export async function POST() {
  try {
    const user = await getUser()

    const today = new Date()
    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )
      .toISOString()
      .split("T")[0]

    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    )
      .toISOString()
      .split("T")[0]

    // ======================================================
    // Gather metrics (NO AI yet)
    // ======================================================

    const [cashflow, networth, goals, burnRate] =
      await Promise.all([
        getCashflowSummary(user.id, startOfMonth, endOfMonth),
        getNetWorthSummary(user.id),
        getGoalsSummary(user.id),
        getBurnRate(user.id),
      ])

    // ======================================================
    // Build prompt (prompts.ts ONLY)
    // ======================================================

    const prompt = buildDashboardPrompt({
      income: cashflow.income,
      expense: cashflow.expense,
      savingsRate: cashflow.savingsRate,
      burnRate,
      netWorth: networth.netWorth,
      goalProgress: goals.percent,
    })

    // ======================================================
    // Run AI (cheap model)
    // ======================================================

    const result = await runAI({
      prompt,
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      max_tokens: 400,
    })

    // ======================================================
    // Log usage
    // ======================================================

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "dashboard",
      tokens: result.usage?.total_tokens ?? 0,
    })

    // ======================================================
    // Response
    // ======================================================

    return NextResponse.json({
      insights: result.text,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 401 }
    )
  }
}
