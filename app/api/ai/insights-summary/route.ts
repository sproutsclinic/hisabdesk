// ==========================================================
// HisabDesk — AI Insights Summary Route (Intelligence Hub)
// Next.js 16 + New Service Architecture Compatible
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

import { listTransactions } from "@/lib/api/transactions"
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

    // ------------------------------------------------------
    // Fetch data using NEW transaction API
    // ------------------------------------------------------

    const [transactions, assets, liabilities, goals] =
      await Promise.all([
        listTransactions(user.id, {
          startDate: start.toISOString(),
          endDate: today.toISOString(),
        }),
        listAssets(user.id),
        listLiabilities(user.id),
        listGoals(user.id),
      ])

    // Split income vs expense (new system stores unified tx)
    const incomeTx = transactions.filter(t => t.type === "income")
    const expenseTx = transactions.filter(t => t.type === "expense")

    // ------------------------------------------------------
    // Cashflow
    // ------------------------------------------------------

    const income = incomeTx.reduce((s, t) => s + t.amount, 0)
    const expense = expenseTx.reduce((s, t) => s + t.amount, 0)

    const liquid = assets.reduce(
      (s, a: any) => s + (a.current_value ?? 0),
      0
    )

    const cashflow = analyzeCashflow(
      [
        {
          month: start.toISOString().slice(0, 7),
          income,
          expense,
        },
      ],
      liquid
    )

    // ------------------------------------------------------
    // Net Worth
    // ------------------------------------------------------

    const networth = analyzeNetworth({
      accounts: 0,
      assets: liquid,
      liabilities: liabilities.reduce(
        (s: number, l: any) => s + (l.principal_amount ?? 0),
        0
      ),
      monthlyExpense: expense || 1,
    })

    // ------------------------------------------------------
    // Goals
    // ------------------------------------------------------

    const goalSummary = analyzeGoals(goals)

    // ------------------------------------------------------
    // Aggregate Metrics
    // ------------------------------------------------------

    const metrics = aggregateMetrics({
      cashflow,
      networth,
      goals: goalSummary,
    })

    // ------------------------------------------------------
    // Health Snapshot
    // ------------------------------------------------------

    const health = buildFinancialHealthSnapshot({
      metrics,
    })

    // ------------------------------------------------------
    // Build AI Context
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

    const prompt = `
Financial Snapshot:
${ctx.summary}
score=${health.score.score}

Give 5 short actionable insights only.
`

    // ------------------------------------------------------
    // AI Call
    // ------------------------------------------------------

    const result = await runAI({
      prompt,
      type: "module",
    })

    // ------------------------------------------------------
    // Log Usage
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