// ==========================================================
// HisabDesk — Savings Advisor (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Convert savings behavior → actionable improvement plan
//   Helps user decide:
//     • how much to save
//     • how much to invest
//     • where leakage exists
//
// PURE LOGIC
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI
//   ❌ No UI
//
// Used by:
//   - dashboard targets
//   - insights page
//   - AI context builder
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface SavingsInput {
  monthlyIncome: number
  monthlyExpense: number
  currentSavingsBalance: number

  targetSavingsRate?: number // default 30%
  emergencyFundMonths?: number // default 6
}

export interface SavingsAdvice {
  monthlySavings: number
  savingsRate: number

  recommendedMonthlySavings: number
  additionalSavingsNeeded: number

  emergencyFundTarget: number
  emergencyFundGap: number

  status: "excellent" | "good" | "needs_improvement" | "critical"
}

// ==========================================================
// HELPERS
// ==========================================================

function round(n: number) {
  return Math.round(n)
}

function percent(a: number, b: number) {
  if (b === 0) return 0
  return (a / b) * 100
}

// ==========================================================
// CORE ANALYZER
// ==========================================================

export function analyzeSavings(
  input: SavingsInput
): SavingsAdvice {
  const targetRate = input.targetSavingsRate ?? 30
  const emergencyMonths = input.emergencyFundMonths ?? 6

  const monthlySavings =
    input.monthlyIncome - input.monthlyExpense

  const savingsRate = percent(
    monthlySavings,
    input.monthlyIncome
  )

  const recommendedMonthlySavings =
    (input.monthlyIncome * targetRate) / 100

  const additionalSavingsNeeded = Math.max(
    0,
    recommendedMonthlySavings - monthlySavings
  )

  const emergencyFundTarget =
    input.monthlyExpense * emergencyMonths

  const emergencyFundGap = Math.max(
    0,
    emergencyFundTarget - input.currentSavingsBalance
  )

  // --------------------------------------------------------
  // Status evaluation
  // --------------------------------------------------------

  let status: SavingsAdvice["status"] = "excellent"

  if (savingsRate >= 40) status = "excellent"
  else if (savingsRate >= 25) status = "good"
  else if (savingsRate >= 10) status = "needs_improvement"
  else status = "critical"

  return {
    monthlySavings: round(monthlySavings),
    savingsRate: round(savingsRate),

    recommendedMonthlySavings: round(recommendedMonthlySavings),
    additionalSavingsNeeded: round(additionalSavingsNeeded),

    emergencyFundTarget: round(emergencyFundTarget),
    emergencyFundGap: round(emergencyFundGap),

    status,
  }
}
