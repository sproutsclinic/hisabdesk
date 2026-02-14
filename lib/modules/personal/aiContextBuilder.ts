// ==========================================================
// HisabDesk — AI Context Builder (Personal Logic → AI Bridge)
// ----------------------------------------------------------
// PURPOSE
//   Convert ALL advisor outputs → compact AI-ready context
//
//   This is the ONLY place that prepares structured data
//   before sending to AI prompts.
//
//   Advisors → signals → context → /api/ai → OpenAI
//
// IMPORTANT
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No OpenAI calls
//   ❌ No UI
//
// Only prepares SMALL, token-efficient summaries
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface AIContextInput {
  // money
  income?: number
  expense?: number
  savingsRate?: number

  // risk
  burnRisk?: "low" | "medium" | "high"
  runwayMonths?: number

  // wealth
  networth?: number
  networthTrend?: "up" | "down" | "flat"

  // goals
  goalsBehind?: number

  // tax
  taxSavingsPossible?: number
  recommendedRegime?: "old" | "new"

  // portfolio
  equityPercent?: number
  debtPercent?: number

  // loans
  interestSaved?: number

  // alerts
  alertCount?: number
}

export interface AIContext {
  summary: string
  numbers: Record<string, number | string>
}

// ==========================================================
// HELPERS
// ==========================================================

function safe(n?: number) {
  return typeof n === "number" ? Math.round(n) : 0
}

// ==========================================================
// CORE BUILDER
// ==========================================================
//
// VERY IMPORTANT:
//   Keep summary short (token efficient)
//   No sentences
//   Only compressed facts
//
// Example output:
//   "Income 90k | Expense 62k | Savings 31% | Runway 5m | NW up | 2 goals behind"
//
// This drastically reduces tokens for AI calls
// ==========================================================

export function buildAIContext(
  input: AIContextInput
): AIContext {
  const parts: string[] = []

  if (input.income)
    parts.push(`Income ₹${safe(input.income)}`)

  if (input.expense)
    parts.push(`Expense ₹${safe(input.expense)}`)

  if (input.savingsRate !== undefined)
    parts.push(`Savings ${safe(input.savingsRate)}%`)

  if (input.runwayMonths !== undefined)
    parts.push(`Runway ${safe(input.runwayMonths)}m`)

  if (input.burnRisk)
    parts.push(`Burn ${input.burnRisk}`)

  if (input.networthTrend)
    parts.push(`NW ${input.networthTrend}`)

  if ((input.goalsBehind || 0) > 0)
    parts.push(`${input.goalsBehind} goals behind`)

  if ((input.taxSavingsPossible || 0) > 0)
    parts.push(`Tax save ₹${safe(input.taxSavingsPossible)}`)

  if (input.recommendedRegime)
    parts.push(`Regime ${input.recommendedRegime}`)

  if (input.equityPercent !== undefined)
    parts.push(`Equity ${safe(input.equityPercent)}%`)

  if ((input.interestSaved || 0) > 0)
    parts.push(`Loan save ₹${safe(input.interestSaved)}`)

  if ((input.alertCount || 0) > 0)
    parts.push(`${input.alertCount} alerts`)

  const summary = parts.join(" | ")

  return {
    summary,
    numbers: {
      income: safe(input.income),
      expense: safe(input.expense),
      savingsRate: safe(input.savingsRate),
      networth: safe(input.networth),
      runwayMonths: safe(input.runwayMonths),
    },
  }
}
