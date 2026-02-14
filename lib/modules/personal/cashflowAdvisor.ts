// ==========================================================
// HisabDesk — Cashflow Advisor (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Analyze income vs expenses → liquidity health + stability
//   Produces signals for dashboard + AI + alerts
//
// PURE LOGIC
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI
//   ❌ No UI
//
// Converts raw monthly cashflow → actionable financial signals
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface MonthlyCashflow {
  month: string // YYYY-MM
  income: number
  expense: number
}

export interface CashflowAdvice {
  avgIncome: number
  avgExpense: number
  avgSavings: number

  savingsRate: number

  incomeStability: "stable" | "moderate" | "volatile"
  expenseRisk: "low" | "medium" | "high"

  runwayMonths: number
  health: "good" | "warning" | "critical"
}

// ==========================================================
// HELPERS
// ==========================================================

function round(n: number) {
  return Math.round(n)
}

function average(nums: number[]) {
  if (!nums.length) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

function stdDev(nums: number[]) {
  if (nums.length <= 1) return 0

  const avg = average(nums)
  const variance =
    average(nums.map((n) => Math.pow(n - avg, 2)))

  return Math.sqrt(variance)
}

// ==========================================================
// CORE ANALYZER
// ==========================================================

export function analyzeCashflow(
  months: MonthlyCashflow[],
  currentLiquidSavings: number
): CashflowAdvice {
  if (!months.length) {
    return {
      avgIncome: 0,
      avgExpense: 0,
      avgSavings: 0,
      savingsRate: 0,
      incomeStability: "stable",
      expenseRisk: "low",
      runwayMonths: 0,
      health: "critical",
    }
  }

  const incomes = months.map((m) => m.income)
  const expenses = months.map((m) => m.expense)

  const avgIncome = average(incomes)
  const avgExpense = average(expenses)
  const avgSavings = avgIncome - avgExpense

  const savingsRate =
    avgIncome > 0 ? (avgSavings / avgIncome) * 100 : 0

  // --------------------------------------------------------
  // Income stability (std deviation check)
  // --------------------------------------------------------

  const incomeDeviation = stdDev(incomes)
  const deviationPercent =
    avgIncome > 0 ? (incomeDeviation / avgIncome) * 100 : 0

  let incomeStability: CashflowAdvice["incomeStability"] =
    "stable"

  if (deviationPercent > 40) incomeStability = "volatile"
  else if (deviationPercent > 20) incomeStability = "moderate"

  // --------------------------------------------------------
  // Expense risk
  // --------------------------------------------------------

  const expenseRatio =
    avgIncome > 0 ? avgExpense / avgIncome : 1

  let expenseRisk: CashflowAdvice["expenseRisk"] = "low"

  if (expenseRatio > 0.9) expenseRisk = "high"
  else if (expenseRatio > 0.75) expenseRisk = "medium"

  // --------------------------------------------------------
  // Runway (how long money lasts without income)
  // --------------------------------------------------------

  const runwayMonths =
    avgExpense > 0
      ? currentLiquidSavings / avgExpense
      : 0

  // --------------------------------------------------------
  // Overall health
  // --------------------------------------------------------

  let health: CashflowAdvice["health"] = "good"

  if (runwayMonths < 2 || savingsRate < 0) health = "critical"
  else if (runwayMonths < 4 || savingsRate < 10)
    health = "warning"

  return {
    avgIncome: round(avgIncome),
    avgExpense: round(avgExpense),
    avgSavings: round(avgSavings),
    savingsRate: round(savingsRate),

    incomeStability,
    expenseRisk,

    runwayMonths: round(runwayMonths),
    health,
  }
}
