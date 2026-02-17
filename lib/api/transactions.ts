ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Transactions API Layer
// Centralized DB access for ALL income/expense operations
// Single Source of Truth = transactions table
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export type TransactionType = "income" | "expense"

export interface TransactionInput {
  account_id: string
  amount: number
  type: TransactionType
  category_id?: string | null
  description?: string | null
  date: string
  notes?: string | null
}

const supabase = getSupabaseAdmin()

// ==========================================================
// CREATE
// ==========================================================

export async function createTransaction(
  userId: string,
  data: TransactionInput
) {
  const { data: result, error } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      ...data,
    })
    .select()
    .single()

  if (error) throw error

  return result
}

// ==========================================================
// UPDATE
// ==========================================================

export async function updateTransaction(
  id: string,
  userId: string,
  data: Partial<TransactionInput>
) {
  const { data: result, error } = await supabase
    .from("transactions")
    .update(data)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error

  return result
}

// ==========================================================
// DELETE
// ==========================================================

export async function deleteTransaction(id: string, userId: string) {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw error

  return true
}

// ==========================================================
// GET SINGLE
// ==========================================================

export async function getTransaction(id: string, userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// LIST (paginated)
// ==========================================================

export async function listTransactions(
  userId: string,
  options?: {
    from?: string
    to?: string
    type?: TransactionType
    limit?: number
    offset?: number
  }
) {
  let query = supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (options?.type) {
    query = query.eq("type", options.type)
  }

  if (options?.from) {
    query = query.gte("date", options.from)
  }

  if (options?.to) {
    query = query.lte("date", options.to)
  }

  if (options?.limit !== undefined && options?.offset !== undefined) {
    query = query.range(
      options.offset,
      options.offset + options.limit - 1
    )
  }

  const { data, count, error } = await query

  if (error) throw error

  return {
    data,
    count: count ?? 0,
  }
}

// ==========================================================
// SUMMARY (income/expense totals)
// Used by dashboard KPIs
// ==========================================================

export async function getTransactionSummary(
  userId: string,
  from?: string,
  to?: string
) {
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

  for (const row of data || []) {
    if (row.type === "income") income += row.amount
    if (row.type === "expense") expense += row.amount
  }

  return {
    income,
    expense,
    net: income - expense,
  }
}

// ==========================================================
// CATEGORY BREAKDOWN (analytics charts)
// ==========================================================

export async function getCategoryBreakdown(
  userId: string,
  type: TransactionType,
  from?: string,
  to?: string
) {
  let query = supabase
    .from("transactions")
    .select("category_id, amount")
    .eq("user_id", userId)
    .eq("type", type)

  if (from) query = query.gte("date", from)
  if (to) query = query.lte("date", to)

  const { data, error } = await query

  if (error) throw error

  const map: Record<string, number> = {}

  for (const row of data || []) {
    const key = row.category_id || "uncategorized"
    map[key] = (map[key] || 0) + row.amount
  }

  return map
}
