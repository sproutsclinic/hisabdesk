// ==========================================================
// HisabDesk — Net Worth Advisor (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Interpret net worth numbers → financial strength signals
//   Converts assets/liabilities → health insights
//
// PURE LOGIC
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI
//   ❌ No UI
//
// Used by:
//   - dashboard net worth card
//   - insights page
//   - AI context builder
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface NetworthInput {
  accounts: number
  assets: number
  liabilities: number

  lastMonthNetworth?: number
  monthlyExpense?: number
}

export interface NetworthAdvice {
  networth: number

  assetToLiabilityRatio: number
  liquidityMonths: number

  change: number
  trend: "up" | "down" | "flat"

  leverageRisk: "low" | "medium" | "high"
  health: "strong" | "average" | "weak"
}

// ==========================================================
// HELPERS
// ==========================================================

function round(n: number) {
  return Math.round(n)
}

function trend(n: number): "up" | "down" | "flat" {
  if (n > 0) return "up"
  if (n < 0) return "down"
  return "flat"
}

// ==========================================================
// CORE ANALYZER
// ==========================================================

export function analyzeNetworth(
  input: NetworthInput
): NetworthAdvice {
  const networth =
    input.accounts + input.assets - input.liabilities

  const assetBase = input.accounts + input.assets

  const assetToLiabilityRatio =
    input.liabilities > 0
      ? assetBase / input.liabilities
      : assetBase

  const liquidityMonths =
    input.monthlyExpense && input.monthlyExpense > 0
      ? input.accounts / input.monthlyExpense
      : 0

  const change =
    input.lastMonthNetworth !== undefined
      ? networth - input.lastMonthNetworth
      : 0

  const t = trend(change)

  // --------------------------------------------------------
  // Leverage risk
  // --------------------------------------------------------

  let leverageRisk: NetworthAdvice["leverageRisk"] = "low"

  if (assetToLiabilityRatio < 1.5) leverageRisk = "high"
  else if (assetToLiabilityRatio < 3) leverageRisk = "medium"

  // --------------------------------------------------------
  // Overall health
  // --------------------------------------------------------

  let health: NetworthAdvice["health"] = "strong"

  if (networth <= 0 || leverageRisk === "high")
    health = "weak"
  else if (liquidityMonths < 3)
    health = "average"

  return {
    networth: round(networth),

    assetToLiabilityRatio: round(assetToLiabilityRatio),
    liquidityMonths: round(liquidityMonths),

    change: round(change),
    trend: t,

    leverageRisk,
    health,
  }
}
