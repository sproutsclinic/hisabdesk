// ==========================================================
// HisabDesk — AI Dashboard Summary Route
// ----------------------------------------------------------
// PURPOSE
//   ONE unified AI summary for Dashboard
//
//   This is the MOST IMPORTANT AI route.
//   It summarizes full financial health.
//
// FLOW
//   DB → advisors → metricsAggregator → promptFormatter → AI
//
// RULES
//   ✓ server-side only
//   ✓ cheap model (module → GPT-3.5)
//   ✓ VERY short output (4 bullets)
//   ✓ ultra token efficient
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
  formatDashboardPrompt,
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
    // Fetch data in parallel
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

    const incomeTotal = incomeTx.reduce(
      (s: number, t: any) => s + t.amount,
      0
    )

    const expenseTotal = expenseTx.reduce(
      (s: number, t: any) => s + t.amount,
      0
    )

    const cashflow = analyzeCashflow(
      [
        {
          month: start.slice(0, 7),
          income: incomeTotal,
          expense: expenseTotal,
        },
      ],
      assets.reduce(
        (s: number, a: any) => s + a.current_value,
        0
      )
    )

    // ------------------------------------------------------
    // Net worth
    // ------------------------------------------------------

    const networth = analyzeNetworth({
      accounts: 0,
      assets: assets.reduce(
        (s: number, a: any) => s + a.current_value,
        0
      ),
      liabilities: liabilities.reduce(
        (s: number, l: any) => s + l.principal_amount,
        0
      ),
      monthlyExpense: expenseTotal || 1,
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
    // Build compact prompt
    // ------------------------------------------------------

    const { prompt } = formatDashboardPrompt({
      income: metrics.income,
      expense: metrics.expense,
      savingsRate: metrics.savingsRate,
      networth: metrics.networth,
      networthTrend: metrics.networthTrend,
      burnRisk: metrics.burnRisk,
      runwayMonths: metrics.runwayMonths,
      goalsBehind: metrics.goalsBehind,
      alerts: metrics.alertCount,
    })

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
      module: "dashboard-summary",
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
