// ==========================================================
// HisabDesk — Budget Advisor (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Smart budget insights + overspending detection
//
// PURE LOGIC
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI
//   ❌ No UI
//
// Used by:
//   - insights page
//   - dashboard alerts
//   - AI context builder
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface CategoryBudget {
  category_id: string
  limit: number
  spent: number
}

export interface BudgetAdvice {
  category_id: string
  status: "safe" | "warning" | "overspend"
  percentUsed: number
  overAmount: number
}

export interface BudgetSummary {
  totalLimit: number
  totalSpent: number
  savings: number
  savingsRate: number
  advices: BudgetAdvice[]
}

// ==========================================================
// HELPERS
// ==========================================================

function percent(spent: number, limit: number) {
  if (limit <= 0) return 0
  return (spent / limit) * 100
}

function round(n: number) {
  return Math.round(n)
}

// ==========================================================
// CORE ADVISOR
// ==========================================================

export function analyzeBudgets(
  categories: CategoryBudget[]
): BudgetSummary {
  const advices: BudgetAdvice[] = []

  let totalLimit = 0
  let totalSpent = 0

  for (const c of categories) {
    totalLimit += c.limit
    totalSpent += c.spent

    const percentUsed = percent(c.spent, c.limit)

    let status: BudgetAdvice["status"] = "safe"

    if (percentUsed >= 100) status = "overspend"
    else if (percentUsed >= 80) status = "warning"

    advices.push({
      category_id: c.category_id,
      status,
      percentUsed: round(percentUsed),
      overAmount: Math.max(0, c.spent - c.limit),
    })
  }

  const savings = Math.max(0, totalLimit - totalSpent)

  const savingsRate =
    totalLimit > 0 ? (savings / totalLimit) * 100 : 0

  return {
    totalLimit: round(totalLimit),
    totalSpent: round(totalSpent),
    savings: round(savings),
    savingsRate: round(savingsRate),
    advices,
  }
}

// ==========================================================
// TOP PROBLEM CATEGORIES
// ==========================================================

export function getTopOverspends(
  advices: BudgetAdvice[],
  limit = 3
) {
  return advices
    .filter((a) => a.status === "overspend")
    .sort((a, b) => b.overAmount - a.overAmount)
    .slice(0, limit)
}
