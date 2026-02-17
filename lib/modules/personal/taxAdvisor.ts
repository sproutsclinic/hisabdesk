ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Tax Advisor (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Smart tax recommendations + regime suggestion
//   Wraps taxCalculator math ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ actionable advice signals
//
// PURE LOGIC
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No DB
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No Supabase
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No AI
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No UI
//
// Used by:
//   - tax page insights
//   - dashboard tax preview
//   - AI tax optimizer context
// ==========================================================

import {
  calculateOldRegimeTax,
  calculateNewRegimeTax,
  compareTaxRegimes,
  TaxInput,
} from "./taxCalculator"

// ==========================================================
// TYPES
// ==========================================================

export interface TaxAdvice {
  oldTax: number
  newTax: number

  recommendedRegime: "old" | "new"
  savings: number

  effectiveRateOld: number
  effectiveRateNew: number

  deductionUtilization: number
  improvementPotential: number
}

// ==========================================================
// HELPERS
// ==========================================================

function round(n: number) {
  return Math.round(n)
}

// ==========================================================
// CORE ADVISOR
// ==========================================================

export function analyzeTax(input: TaxInput): TaxAdvice {
  const oldResult = calculateOldRegimeTax(input)
  const newResult = calculateNewRegimeTax(input)

  const comparison = compareTaxRegimes(input)

  const totalDeductions =
    (input.deductions80C || 0) +
    (input.deductions80D || 0) +
    (input.hraExemption || 0) +
    (input.homeLoanInterest || 0) +
    (input.otherDeductions || 0)

  // assume 80C max typical limit 1.5L for utilization calc
  const maxTypicalDeduction = 150000

  const deductionUtilization =
    maxTypicalDeduction > 0
      ? (totalDeductions / maxTypicalDeduction) * 100
      : 0

  const improvementPotential = Math.max(
    0,
    maxTypicalDeduction - totalDeductions
  )

  return {
    oldTax: round(oldResult.totalTax),
    newTax: round(newResult.totalTax),

    recommendedRegime: comparison.better,
    savings: round(comparison.savings),

    effectiveRateOld: round(oldResult.effectiveRate),
    effectiveRateNew: round(newResult.effectiveRate),

    deductionUtilization: round(deductionUtilization),
    improvementPotential: round(improvementPotential),
  }
}
