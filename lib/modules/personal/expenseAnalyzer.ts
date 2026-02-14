// ==========================================================
// HisabDesk — Expense Analyzer (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Detect overspending, anomalies, burn rate, wasteful spends
//
// PURE LOGIC
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI
//   ❌ No UI
//
// Used by:
//   - insights
//   - dashboard alerts
//   - AI context builder
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface ExpenseTx {
  amount: number
  category_id?: string | null
  date: string // YYYY-MM-DD
}

export interface ExpenseAnalysis {
  totalExpense: number
  monthlyAverage: number
  burnRate: number
  topCategories: { category_id: string; amount: number }[]
  anomalies: ExpenseTx[]
}

// ==========================================================
// HELPERS
// ==========================================================

function monthKey(date: string) {
  return date.slice(0, 7)
}

function round(n: number) {
  return Math.round(n)
}

// ==========================================================
// CORE ANALYSIS
// ==========================================================

export function analyzeExpenses(
  transactions: ExpenseTx[]
): ExpenseAnalysis {
  if (!transactions.length) {
    return {
      totalExpense: 0,
      monthlyAverage: 0,
      burnRate: 0,
      topCategories: [],
      anomalies: [],
    }
  }

  let totalExpense = 0

  const monthMap: Record<string, number> = {}
  const categoryMap: Record<string, number> = {}

  for (const t of transactions) {
    totalExpense += t.amount

    const m = monthKey(t.date)
    monthMap[m] = (monthMap[m] || 0) + t.amount

    const key = t.category_id || "uncategorized"
    categoryMap[key] = (categoryMap[key] || 0) + t.amount
  }

  const months = Object.keys(monthMap).length || 1

  const monthlyAverage = totalExpense / months
  const burnRate = monthlyAverage

  const topCategories = Object.entries(categoryMap)
    .map(([category_id, amount]) => ({
      category_id,
      amount: round(amount),
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  // --------------------------------------------------------
  // Anomaly detection
  // Rule: expense > 3x monthly average single txn
  // --------------------------------------------------------

  const threshold = monthlyAverage * 0.3

  const anomalies = transactions.filter(
    (t) => t.amount > threshold
  )

  return {
    totalExpense: round(totalExpense),
    monthlyAverage: round(monthlyAverage),
    burnRate: round(burnRate),
    topCategories,
    anomalies,
  }
}
