ï»¿// ==========================================================
// Reports Engine (PURE LOGIC ONLY ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â DETERMINISTIC)
// ==========================================================

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
Precision Utilities (match portfolio engine)
========================================================= */

const SCALE = 100

function toPaise(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0
  return Math.round(value * SCALE)
}

function fromPaise(value: number): number {
  return Number((value / SCALE).toFixed(2))
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

  const totalIncome = sumPaise(incomeTx)
  const totalExpense = sumPaise(expenseTx)

  const savings = totalIncome - totalExpense

  const savingsRate =
    totalIncome > 0 ? (savings / totalIncome) * 100 : 0

  return {
    kpis: {
      income: fromPaise(totalIncome),
      expense: fromPaise(totalExpense),
      savings: fromPaise(savings),
      savingsRate: round(savingsRate),
      netCashflow: fromPaise(savings),
    },

    incomeByCategory: buildCategoryBreakdown(incomeTx),
    expenseByCategory: buildCategoryBreakdown(expenseTx),

    monthlySeries: buildMonthlySeries(transactions),
  }
}

/* =========================================================
Safe Aggregation
========================================================= */

function sumPaise(list: EngineTransaction[]) {
  let total = 0
  for (const t of list) {
    total += toPaise(t.amount)
  }
  return total
}

/* ---------------- Category Aggregation ---------------- */

function buildCategoryBreakdown(
  list: EngineTransaction[]
): CategoryBreakdown[] {
  const total = sumPaise(list)

  const map = new Map<string, number>()

  for (const tx of list) {
    const key = tx.category ?? "Other"
    const value = toPaise(tx.amount)
    map.set(key, (map.get(key) ?? 0) + value)
  }

  const result: CategoryBreakdown[] = []

  for (const [category, amount] of map.entries()) {
    result.push({
      category,
      amount: fromPaise(amount),
      percent: total > 0 ? round((amount / total) * 100) : 0,
    })
  }

  return result.sort((a, b) => b.amount - a.amount)
}

/* ---------------- Monthly Series ---------------- */

function buildMonthlySeries(
  transactions: EngineTransaction[]
): MonthlySeriesPoint[] {
  const map = new Map<string, { income: number; expense: number }>()

  for (const tx of transactions) {
    const d = new Date(tx.date)
    const key = `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`

    if (!map.has(key)) {
      map.set(key, { income: 0, expense: 0 })
    }

    const bucket = map.get(key)!

    if (tx.type === "income") bucket.income += toPaise(tx.amount)
    else bucket.expense += toPaise(tx.amount)
  }

  const series: MonthlySeriesPoint[] = []

  for (const [month, v] of map.entries()) {
    const savings = v.income - v.expense

    series.push({
      month,
      income: fromPaise(v.income),
      expense: fromPaise(v.expense),
      savings: fromPaise(savings),
    })
  }

  return series.sort((a, b) => a.month.localeCompare(b.month))
}

/* ---------------- Utils ---------------- */

function round(n: number) {
  return Math.round(n * 100) / 100
}
