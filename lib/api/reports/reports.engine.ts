// ==========================================================
// Reports Engine (PURE LOGIC ONLY)
// Layer: Engine (NO DB / NO HTTP / NO Supabase)
//
// Responsibilities:
// - calculations
// - aggregations
// - grouping
// - formatting output DTO
//
// This is the ONLY place where math exists.
//
// Safe:
// ✅ pure functions
// ❌ side effects
// ❌ network
// ❌ database
// ==========================================================

/* =========================================================
Types (shared with hook/service)
========================================================= */

export type TransactionType = "income" | "expense"

export interface EngineTransaction {
  id: string
  type: TransactionType
  amount: number
  category: string | null
  date: string
}

export interface ReportsEngineInput {
  from: string
  to: string
  transactions: EngineTransaction[]
}

/* ---------------- Result DTO ---------------- */

export interface KPIBlock {
  income: number
  expense: number
  savings: number
  savingsRate: number
  netCashflow: number
}

export interface CategoryBreakdown {
  category: string
  amount: number
  percent: number
}

export interface MonthlySeriesPoint {
  month: string
  income: number
  expense: number
  savings: number
}

export interface ReportsResult {
  kpis: KPIBlock
  expenseByCategory: CategoryBreakdown[]
  incomeByCategory: CategoryBreakdown[]
  monthlySeries: MonthlySeriesPoint[]
}

/* =========================================================
Public Entry
========================================================= */

export function buildReportsFromTransactions(
  input: ReportsEngineInput
): ReportsResult {
  const { transactions } = input

  const incomeTx = transactions.filter((t) => t.type === "income")
  const expenseTx = transactions.filter((t) => t.type === "expense")

  const totalIncome = sum(incomeTx)
  const totalExpense = sum(expenseTx)

  const savings = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0

  return {
    kpis: {
      income: round(totalIncome),
      expense: round(totalExpense),
      savings: round(savings),
      savingsRate: round(savingsRate),
      netCashflow: round(savings),
    },

    incomeByCategory: buildCategoryBreakdown(incomeTx),
    expenseByCategory: buildCategoryBreakdown(expenseTx),

    monthlySeries: buildMonthlySeries(transactions),
  }
}

/* =========================================================
Helpers
========================================================= */

function sum(list: EngineTransaction[]) {
  return list.reduce((acc, t) => acc + Number(t.amount || 0), 0)
}

/* ---------------- Category Aggregation ---------------- */

function buildCategoryBreakdown(
  list: EngineTransaction[]
): CategoryBreakdown[] {
  const total = sum(list)

  const map = new Map<string, number>()

  for (const tx of list) {
    const key = tx.category || "Other"
    map.set(key, (map.get(key) || 0) + tx.amount)
  }

  const result: CategoryBreakdown[] = []

  for (const [category, amount] of map.entries()) {
    result.push({
      category,
      amount: round(amount),
      percent: total > 0 ? round((amount / total) * 100) : 0,
    })
  }

  return result.sort((a, b) => b.amount - a.amount)
}

/* ---------------- Monthly Series ---------------- */

function buildMonthlySeries(
  transactions: EngineTransaction[]
): MonthlySeriesPoint[] {
  const map = new Map<string, MonthlySeriesPoint>()

  for (const tx of transactions) {
    const d = new Date(tx.date)

    const monthKey = `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`

    if (!map.has(monthKey)) {
      map.set(monthKey, {
        month: monthKey,
        income: 0,
        expense: 0,
        savings: 0,
      })
    }

    const bucket = map.get(monthKey)!

    if (tx.type === "income") bucket.income += tx.amount
    else bucket.expense += tx.amount
  }

  const series = Array.from(map.values()).sort((a, b) =>
    a.month.localeCompare(b.month)
  )

  for (const m of series) {
    m.savings = round(m.income - m.expense)
    m.income = round(m.income)
    m.expense = round(m.expense)
  }

  return series
}

/* ---------------- Utils ---------------- */

function round(n: number) {
  return Math.round(n * 100) / 100
}
