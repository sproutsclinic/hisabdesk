// ==========================================================
// HisabDesk — Insight Builder (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Convert raw financial metrics → structured insight signals
//   This feeds AI prompts + dashboard alerts
//
// PURE LOGIC
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI calls
//   ❌ No UI
//
// This file PREPARES DATA for AI, not text generation
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface InsightInput {
  income: number
  expense: number
  savingsRate: number
  burnRate: number

  netWorth: number
  lastMonthNetWorth?: number

  overspendCategories?: number
  upcomingBillsAmount?: number
}

export interface InsightSignals {
  monthlySavings: number
  savingsRate: number

  cashflowStatus: "positive" | "neutral" | "negative"
  burnRisk: "low" | "medium" | "high"

  netWorthChange: number
  netWorthTrend: "up" | "down" | "flat"

  overspendFlag: boolean
  billPressure: boolean
}

// ==========================================================
// HELPERS
// ==========================================================

function percent(a: number, b: number) {
  if (b === 0) return 0
  return (a / b) * 100
}

function clampTrend(n: number): "up" | "down" | "flat" {
  if (n > 0) return "up"
  if (n < 0) return "down"
  return "flat"
}

// ==========================================================
// CORE SIGNAL BUILDER
// ==========================================================

export function buildInsightSignals(
  input: InsightInput
): InsightSignals {
  const monthlySavings = input.income - input.expense

  // --------------------------------------------------------
  // Cashflow health
  // --------------------------------------------------------

  let cashflowStatus: InsightSignals["cashflowStatus"] =
    "neutral"

  if (monthlySavings > 0) cashflowStatus = "positive"
  if (monthlySavings < 0) cashflowStatus = "negative"

  // --------------------------------------------------------
  // Burn risk
  // --------------------------------------------------------

  const burnPercent = percent(input.burnRate, input.income)

  let burnRisk: InsightSignals["burnRisk"] = "low"

  if (burnPercent > 90) burnRisk = "high"
  else if (burnPercent > 70) burnRisk = "medium"

  // --------------------------------------------------------
  // Net worth trend
  // --------------------------------------------------------

  const netWorthChange =
    input.lastMonthNetWorth !== undefined
      ? input.netWorth - input.lastMonthNetWorth
      : 0

  const netWorthTrend = clampTrend(netWorthChange)

  // --------------------------------------------------------
  // Flags
  // --------------------------------------------------------

  const overspendFlag =
    (input.overspendCategories || 0) > 0

  const billPressure =
    (input.upcomingBillsAmount || 0) > monthlySavings

  return {
    monthlySavings,
    savingsRate: input.savingsRate,

    cashflowStatus,
    burnRisk,

    netWorthChange,
    netWorthTrend,

    overspendFlag,
    billPressure,
  }
}
