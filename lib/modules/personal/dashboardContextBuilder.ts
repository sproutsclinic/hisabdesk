// ==========================================================
// HisabDesk — Dashboard Context Builder (AI Injection)
// ----------------------------------------------------------
// PURPOSE
//   Builds ultra-compact dashboard financial context string
//   specifically for AI routes
//
//   Why this exists:
//     ✓ token efficient
//     ✓ consistent format
//     ✓ reusable across ALL AI routes
//     ✓ avoids manual string building everywhere
//
//   Used by:
//     ✓ /api/ai/insights
//     ✓ /api/ai/page-assistant
//     ✓ future planners
//
//   RULE:
//     NEVER manually create financial summary text in routes
//     ALWAYS use this builder
//
// ==========================================================

import { buildAIContext } from "@/lib/ai/contextBuilder"

// ==========================================================
// TYPES
// ==========================================================

export interface DashboardContextInput {
  income: number
  expense: number
  networth: number
  savingsRate: number
  burnRate?: number
  runwayMonths?: number
  alertsCount?: number
  topCategory?: string
}

// ==========================================================
// BUILDER
// ==========================================================

export function buildDashboardContext(
  data: DashboardContextInput
): string {
  // base compact summary
  const base = buildAIContext({
    income: data.income,
    expense: data.expense,
    networth: data.networth,
    savingsRate: data.savingsRate,
    burnRate: data.burnRate,
    runwayMonths: data.runwayMonths,
    alerts: data.alertsCount,
  })

  // small extras (only strings)
  const extras: string[] = []

  if (data.topCategory) {
    extras.push(`topCat=${data.topCategory}`)
  }

  // --------------------------------------------------------
  // final ultra-short single line
  // example:
  // income=50k expense=30k saveRate=40 networth=10L burn=60 runway=5 alerts=2 topCat=Food
  // --------------------------------------------------------

  return [base, ...extras].join(" ").trim()
}
