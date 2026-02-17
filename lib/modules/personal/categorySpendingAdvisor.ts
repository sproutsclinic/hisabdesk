ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Category Spending Advisor (Personal Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Analyze category-wise expenses ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ detect waste + optimization
//
//   Answers:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Where money leaks?
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Which categories dominate spending?
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ What can be reduced safely?
//
// PURE LOGIC
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No DB
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No Supabase
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No AI
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No UI
//
// Used by:
//   - expense page insights
//   - dashboard tips
//   - AI expense-summary route
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface CategorySpend {
  category_id: string
  amount: number
}

export interface CategoryAdvice {
  category_id: string
  amount: number
  percent: number
  status: "normal" | "high" | "critical"
  suggestedReduction: number
}

export interface CategorySpendingSummary {
  totalExpense: number
  advices: CategoryAdvice[]
  top3SharePercent: number
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

export function analyzeCategorySpending(
  categories: CategorySpend[]
): CategorySpendingSummary {
  if (!categories.length) {
    return {
      totalExpense: 0,
      advices: [],
      top3SharePercent: 0,
    }
  }

  const totalExpense = categories.reduce(
    (sum, c) => sum + c.amount,
    0
  )

  const sorted = [...categories].sort(
    (a, b) => b.amount - a.amount
  )

  const advices: CategoryAdvice[] = sorted.map((c) => {
    const share = percent(c.amount, totalExpense)

    let status: CategoryAdvice["status"] = "normal"

    // ------------------------------------------------------
    // Heuristics
    // ------------------------------------------------------
    // >30% = critical
    // >20% = high
    // ------------------------------------------------------

    if (share >= 30) status = "critical"
    else if (share >= 20) status = "high"

    const suggestedReduction =
      status === "critical"
        ? c.amount * 0.15
        : status === "high"
        ? c.amount * 0.1
        : 0

    return {
      category_id: c.category_id,
      amount: round(c.amount),
      percent: round(share),
      status,
      suggestedReduction: round(suggestedReduction),
    }
  })

  const top3 = sorted.slice(0, 3).reduce(
    (sum, c) => sum + c.amount,
    0
  )

  return {
    totalExpense: round(totalExpense),
    advices,
    top3SharePercent: round(percent(top3, totalExpense)),
  }
}
