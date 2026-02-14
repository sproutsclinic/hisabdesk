// ==========================================================
// HisabDesk — Category Spending Advisor (Personal Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Analyze category-wise expenses → detect waste + optimization
//
//   Answers:
//     • Where money leaks?
//     • Which categories dominate spending?
//     • What can be reduced safely?
//
// PURE LOGIC
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI
//   ❌ No UI
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
