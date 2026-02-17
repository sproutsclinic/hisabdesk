ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Analytics API Layer
// Financial KPIs + metrics derived ONLY from transactions
// Single Source of Truth rule compliant
// Used by: dashboard, insights, AI context
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

const supabase = getSupabaseAdmin()

// ==========================================================
// TYPES
// ==========================================================

export interface CashflowSummary {
  income: number
  expense: number
  net: number
  savingsRate: number
}

export interface MonthlySeries {
  month: string
  income: number
  expense: number
  net: number
}

export interface CategorySpend {
  category_id: string
  amount: number
}

// ==========================================================
// HELPERS
// ==========================================================

function monthKey(date: string) {
  return date.slice(0, 7) // YYYY-MM
}

// ==========================================================
// CASHFLOW SUMMARY
// ==========================================================

export async function getCashflowSummary(
  userId: string,
  from?: string,
  to?: string
): Promise<CashflowSummary> {
  let query = supabase
    .from("transactions")
    .select("amount,type")
    .eq("user_id", userId)

  if (from) query = query.gte("date", from)
  if (to) query = query.lte("date", to)

  const { data, error } = await query

  if (error) throw error

  let income = 0
  let expense = 0

  for (const t of data || []) {
    if (t.type === "income") income += t.amount
    if (t.type === "expense") expense += t.amount
  }

  const net = income - expense
  const savingsRate =
    income > 0 ? (net / income) * 100 : 0

  return { income, expense, net, savingsRate }
}

// ==========================================================
// MONTHLY SERIES (for charts)
// ==========================================================

export async function getMonthlySeries(
  userId: string,
  from?: string,
  to?: string
): Promise<MonthlySeries[]> {
  let query = supabase
    .from("transactions")
    .select("amount,type,date")
    .eq("user_id", userId)

  if (from) query = query.gte("date", from)
  if (to) query = query.lte("date", to)

  const { data, error } = await query

  if (error) throw error

  const map: Record<string, MonthlySeries> = {}

  for (const t of data || []) {
    const key = monthKey(t.date)

    if (!map[key]) {
      map[key] = {
        month: key,
        income: 0,
        expense: 0,
        net: 0,
      }
    }

    if (t.type === "income") map[key].income += t.amount
    if (t.type === "expense") map[key].expense += t.amount
  }

  for (const m of Object.values(map)) {
    m.net = m.income - m.expense
  }

  return Object.values(map).sort((a, b) =>
    a.month.localeCompare(b.month)
  )
}

// ==========================================================
// CATEGORY SPEND BREAKDOWN
// ==========================================================

export async function getCategorySpend(
  userId: string,
  from?: string,
  to?: string
): Promise<CategorySpend[]> {
  let query = supabase
    .from("transactions")
    .select("category_id, amount")
    .eq("user_id", userId)
    .eq("type", "expense")

  if (from) query = query.gte("date", from)
  if (to) query = query.lte("date", to)

  const { data, error } = await query

  if (error) throw error

  const map: Record<string, number> = {}

  for (const t of data || []) {
    const key = t.category_id || "uncategorized"
    map[key] = (map[key] || 0) + t.amount
  }

  return Object.entries(map).map(([category_id, amount]) => ({
    category_id,
    amount,
  }))
}

// ==========================================================
// BURN RATE (monthly expense average)
// ==========================================================

export async function getBurnRate(userId: string) {
  const series = await getMonthlySeries(userId)

  if (!series.length) return 0

  const totalExpense = series.reduce(
    (sum, m) => sum + m.expense,
    0
  )

  return totalExpense / series.length
}

// ==========================================================
// TOP EXPENSE CATEGORIES
// ==========================================================

export async function getTopExpenseCategories(
  userId: string,
  limit = 5
) {
  const categories = await getCategorySpend(userId)

  return categories
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit)
}

// ==========================================================
// FINANCIAL HEALTH SCORE (simple KPI for dashboard)
// ==========================================================

export async function getFinancialHealthScore(
  userId: string
) {
  const { income, expense, savingsRate } =
    await getCashflowSummary(userId)

  if (income === 0) return 0

  let score = 0

  // savings rate weight
  if (savingsRate >= 40) score += 40
  else if (savingsRate >= 20) score += 30
  else if (savingsRate >= 10) score += 20
  else score += 10

  // expense control weight
  const ratio = expense / income
  if (ratio <= 0.5) score += 30
  else if (ratio <= 0.7) score += 20
  else score += 10

  // income positive weight
  if (income > expense) score += 30

  return Math.min(100, score)
}
