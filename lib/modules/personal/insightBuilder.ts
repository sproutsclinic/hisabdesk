ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Insight Builder (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Convert raw financial metrics ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ structured insight signals
//   This feeds AI prompts + dashboard alerts
//
// PURE LOGIC
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No DB
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No Supabase
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No AI calls
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No UI
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
