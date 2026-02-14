// ==========================================================
// HisabDesk — Budgets API Layer
// Category & monthly budget control
// Used by: dashboard, alerts, insights
// Depends on: transactions (single source of truth)
// ==========================================================

import { createClient } from "@/lib/supabase"

const supabase = createClient()

// ==========================================================
// TYPES
// ==========================================================

export interface BudgetInput {
  category_id: string
  month: string // format: YYYY-MM
  limit_amount: number
}

export interface BudgetProgress {
  category_id: string
  limit: number
  spent: number
  remaining: number
  percentUsed: number
}

// ==========================================================
// CREATE
// ==========================================================

export async function createBudget(
  userId: string,
  input: BudgetInput
) {
  const { data, error } = await supabase
    .from("budgets")
    .insert({
      user_id: userId,
      category_id: input.category_id,
      month: input.month,
      limit_amount: input.limit_amount,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// UPDATE
// ==========================================================

export async function updateBudget(
  id: string,
  userId: string,
  limit_amount: number
) {
  const { data, error } = await supabase
    .from("budgets")
    .update({ limit_amount })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// DELETE
// ==========================================================

export async function deleteBudget(id: string, userId: string) {
  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw error

  return true
}

// ==========================================================
// LIST BUDGETS FOR MONTH
// ==========================================================

export async function listBudgets(
  userId: string,
  month: string
) {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", userId)
    .eq("month", month)

  if (error) throw error

  return data || []
}

// ==========================================================
// GET SINGLE
// ==========================================================

export async function getBudget(id: string, userId: string) {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// PROGRESS CALCULATION
// Reads ONLY from transactions table (rule compliant)
// ==========================================================

export async function getBudgetProgress(
  userId: string,
  month: string
): Promise<BudgetProgress[]> {
  const budgets = await listBudgets(userId, month)

  if (!budgets.length) return []

  const from = `${month}-01`
  const to = `${month}-31`

  const { data: txs, error } = await supabase
    .from("transactions")
    .select("category_id, amount")
    .eq("user_id", userId)
    .eq("type", "expense")
    .gte("date", from)
    .lte("date", to)

  if (error) throw error

  const spentMap: Record<string, number> = {}

  for (const t of txs || []) {
    const key = t.category_id || "uncategorized"
    spentMap[key] = (spentMap[key] || 0) + t.amount
  }

  return budgets.map((b) => {
    const spent = spentMap[b.category_id] || 0
    const remaining = b.limit_amount - spent
    const percentUsed =
      b.limit_amount > 0 ? (spent / b.limit_amount) * 100 : 0

    return {
      category_id: b.category_id,
      limit: b.limit_amount,
      spent,
      remaining,
      percentUsed,
    }
  })
}

// ==========================================================
// TOTAL MONTHLY SPEND VS LIMIT
// Used by dashboard summary card
// ==========================================================

export async function getMonthlyBudgetSummary(
  userId: string,
  month: string
) {
  const progress = await getBudgetProgress(userId, month)

  let totalLimit = 0
  let totalSpent = 0

  for (const p of progress) {
    totalLimit += p.limit
    totalSpent += p.spent
  }

  return {
    totalLimit,
    totalSpent,
    remaining: totalLimit - totalSpent,
    percentUsed:
      totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0,
  }
}
