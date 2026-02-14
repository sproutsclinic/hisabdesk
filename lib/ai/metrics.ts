// ==========================================================
// HisabDesk — AI Metrics Utilities
// ----------------------------------------------------------
// PURPOSE
//   Central helpers to compute AI performance metrics
//
//   Used for:
//     ✓ profile usage screen
//     ✓ admin dashboards
//     ✓ optimization decisions
//
//   Provides:
//     • tokens → dollars
//     • daily average
//     • module breakdown
//     • projections
//
//   RULE:
//     Pure calculations only (NO OpenAI)
// ==========================================================

import { AI_COST } from "./constants"

// ==========================================================
// TYPES
// ==========================================================

export interface AILogRow {
  module: string
  tokens: number
  created_at: string
}

export interface AIMetrics {
  totalTokens: number
  totalCost: number
  avgDailyTokens: number
  projectedMonthlyCost: number
  byModule: Record<string, number>
}

// ==========================================================
// HELPERS
// ==========================================================

function round(n: number) {
  return Number(n.toFixed(2))
}

function daysSinceMonthStart() {
  const now = new Date()
  return now.getDate() // day of month
}

function tokensToCost(tokens: number) {
  return (tokens / 1000) * AI_COST.COST_PER_1K_TOKENS
}

// ==========================================================
// CORE CALCULATOR
// ==========================================================

export function computeAIMetrics(rows: AILogRow[]): AIMetrics {
  if (!rows.length) {
    return {
      totalTokens: 0,
      totalCost: 0,
      avgDailyTokens: 0,
      projectedMonthlyCost: 0,
      byModule: {},
    }
  }

  let totalTokens = 0
  const byModule: Record<string, number> = {}

  for (const r of rows) {
    const t = r.tokens || 0

    totalTokens += t
    byModule[r.module] = (byModule[r.module] || 0) + t
  }

  const totalCost = tokensToCost(totalTokens)

  const days = Math.max(1, daysSinceMonthStart())

  const avgDailyTokens = totalTokens / days

  const projectedMonthlyTokens = avgDailyTokens * 30
  const projectedMonthlyCost =
    tokensToCost(projectedMonthlyTokens)

  return {
    totalTokens,
    totalCost: round(totalCost),
    avgDailyTokens: Math.round(avgDailyTokens),
    projectedMonthlyCost: round(projectedMonthlyCost),
    byModule,
  }
}
