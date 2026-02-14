// ==========================================================
// HisabDesk — AI Insights Summary Route (Intelligence Hub)
// ----------------------------------------------------------
// PURPOSE
//   Master AI insights endpoint for Insights page
//
//   This combines:
//     • cashflow
//     • savings
//     • net worth
//     • goals
//     • alerts
//
//   and produces ONE smart financial summary.
//
//   This is slightly smarter than dashboard-summary
//   but still cheap (GPT-3.5).
//
// FLOW
//   DB → advisors → healthEngine → prompt → AI
//
// RULES
//   ✓ server-side only
//   ✓ cheap model (module)
//   ✓ short bullets only
//   ✓ token efficient
//   ✓ logs usage
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

import { getTransactionsByRange } from "@/lib/api/transactions"
import { listAssets } from "@/lib/api/assets"
import { listLiabilities } from "@/lib/api/liabilities"
import { listGoals } from "@/lib/api/goals"

import {
  analyzeCashflow,
  analyzeNetworth,
  analyzeGoals,
  aggregateMetrics,
  buildFinancialHealthSnapshot,
  buildAIContext,
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

    const today = new Date()

    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )
      .toISOString()
      .split("T")[0]

    const end = today.toISOString().split("T")[0]

    // ------------------------------------------------------
    // Fetch all data parallel
    // ------------------------------------------------------

    const [incomeTx, expenseTx, assets, liabilities, goals] =
      await Promise.all([
        getTransactionsByRange(user.id, start, end, "income"),
        getTransactionsByRange(user.id, start, end, "expense"),
        listAssets(user.id),
        listLiabilities(user.id),
        listGoals(user.id),
      ])

    // ------------------------------------------------------
    // Cashflow
    // ------------------------------------------------------

    const income = incomeTx.reduce(
      (s: number, t: any) => s + t.amount,
      0
    )

    const expense = expenseTx.reduce(
      (s: number, t: any) => s + t.amount,
      0
    )

    const liquid = assets.reduce(
      (s: number, a: any) => s + a.current_value,
      0
    )

    const cashflow = analyzeCashflow(
      [
        {
          month: start.slice(0, 7),
          income,
          expense,
        },
      ],
      liquid
    )

    // ------------------------------------------------------
    // Net worth
    // ------------------------------------------------------

    const networth = analyzeNetworth({
      accounts: 0,
      assets: liquid,
      liabilities: liabilities.reduce(
        (s: number, l: any) => s + l.principal_amount,
        0
      ),
      monthlyExpense: expense || 1,
    })

    // ------------------------------------------------------
    // Goals
    // ------------------------------------------------------

    const goalSummary = analyzeGoals(goals)

    // ------------------------------------------------------
    // Aggregate metrics
    // ------------------------------------------------------

    const metrics = aggregateMetrics({
      cashflow,
      networth,
      goals: goalSummary,
    })

    // ------------------------------------------------------
    // Health snapshot (score + alerts)
    // ------------------------------------------------------

    const health = buildFinancialHealthSnapshot({
      metrics,
    })

    // ------------------------------------------------------
    // Build AI context (token efficient)
    // ------------------------------------------------------

    const ctx = buildAIContext({
      income: metrics.income,
      expense: metrics.expense,
      savingsRate: metrics.savingsRate,
      burnRisk: metrics.burnRisk as any,
      runwayMonths: metrics.runwayMonths,
      networth: metrics.networth,
      networthTrend: metrics.networthTrend,
      goalsBehind: metrics.goalsBehind,
      alertCount: health.alerts.length,
    })

    // ------------------------------------------------------
    // Prompt
    // ------------------------------------------------------

    const prompt = `
Financial Snapshot:
${ctx.summary}
score=${health.score.score}

Give 5 short actionable insights only.
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
      module: "insights-summary",
      tokens: result.usage?.total_tokens ?? 0,
    })

    return NextResponse.json({
      insights: result.text,
      score: health.score,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 401 }
    )
  }
}
