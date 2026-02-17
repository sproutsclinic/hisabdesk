ï»¿/**
 * =========================================================
 * AI Tax Savings Suggester Engine
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Phase B (AI Features)
 * =========================================================
 *
 * PURE UTILITY MODULE
 * ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  DO NOT add "use server" or "use client"
 * Must stay directive-free for Next 16 compatibility
 * =========================================================
 */

/* =========================================================
   TYPES
========================================================= */

export type TaxProfile = {
  regime: "old" | "new"
  income: number
  expenses?: number

  investments80C?: number
  healthInsurance?: number
  rentPaid?: number

  isProfessional44ADA?: boolean
}

export type TaxSuggestion = {
  title: string
  description: string
  potentialSavings: number
  section?: string
}

/* =========================================================
   CONSTANTS (India FY limits)
========================================================= */

const LIMIT_80C = 150000
const LIMIT_80D_SELF = 25000
const STANDARD_DEDUCTION = 50000

/* =========================================================
   HELPERS
========================================================= */

function push(
  arr: TaxSuggestion[],
  title: string,
  description: string,
  savings: number,
  section?: string
) {
  if (savings <= 0) return

  arr.push({
    title,
    description,
    potentialSavings: Math.round(savings),
    section,
  })
}

/* =========================================================
   MAIN ENGINE
========================================================= */

export function suggestTaxSavings(
  profile: TaxProfile
): TaxSuggestion[] {
  const suggestions: TaxSuggestion[] = []

  const {
    regime,
    income,
    expenses = 0,
    investments80C = 0,
    healthInsurance = 0,
    rentPaid = 0,
    isProfessional44ADA = false,
  } = profile

  if (regime === "old") {
    const remaining80C = LIMIT_80C - investments80C

    push(
      suggestions,
      "Invest more under 80C",
      `Invest ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹${remaining80C.toLocaleString()} more in ELSS/PPF/LIC to fully utilize 80C limit.`,
      remaining80C * 0.3,
      "80C"
    )

    const remaining80D = LIMIT_80D_SELF - healthInsurance

    push(
      suggestions,
      "Health insurance deduction",
      `Buy health insurance for additional ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹${remaining80D.toLocaleString()} deduction.`,
      remaining80D * 0.3,
      "80D"
    )

    if (rentPaid > 0) {
      const estimatedHRA = rentPaid * 0.4

      push(
        suggestions,
        "Claim HRA benefit",
        "Ensure rent receipts are submitted to claim HRA deduction.",
        estimatedHRA * 0.3,
        "HRA"
      )
    }
  }

  const expenseRatio = expenses / income

  if (expenseRatio < 0.2) {
    push(
      suggestions,
      "Track more business expenses",
      "You may be under-reporting legitimate business expenses like travel, software, internet.",
      income * 0.1 * 0.3,
      "Business"
    )
  }

  if (isProfessional44ADA) {
    const presumptiveIncome = income * 0.5

    if (expenses > presumptiveIncome) {
      push(
        suggestions,
        "Consider regular accounting instead of 44ADA",
        "Your expenses exceed 50%, regular books may reduce tax further.",
        (expenses - presumptiveIncome) * 0.3,
        "44ADA"
      )
    } else {
      push(
        suggestions,
        "Use 44ADA presumptive scheme",
        "You can declare only 50% income and avoid detailed bookkeeping.",
        presumptiveIncome * 0.3,
        "44ADA"
      )
    }
  }

  if (regime === "old" && investments80C < 20000 && healthInsurance < 5000) {
    push(
      suggestions,
      "Compare New Tax Regime",
      "With fewer deductions, the new regime may result in lower tax.",
      income * 0.05
    )
  }

  return suggestions.sort(
    (a, b) => b.potentialSavings - a.potentialSavings
  )
}

/* =========================================================
   SUMMARY HELPER
========================================================= */

export function estimateTotalSavings(
  suggestions: TaxSuggestion[]
) {
  return suggestions.reduce(
    (sum, s) => sum + s.potentialSavings,
    0
  )
}
