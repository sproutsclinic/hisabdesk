ï»¿// ==========================================================
// HisabDesk â€” Income Service Layer (HARDENED VERSION)
// Uses ONLY gateway access (NO createClient)
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import type { Database } from "@/types/db"

/* ==========================================================
   TYPES
========================================================== */

type Income = Database["public"]["Tables"]["incomes"]["Row"]
type IncomeInsert = Database["public"]["Tables"]["incomes"]["Insert"]
type IncomeUpdate = Database["public"]["Tables"]["incomes"]["Update"]

const MAX_PAGE_SIZE = 100

/* ==========================================================
   Fetch Income
========================================================== */

export async function getIncome(
  userId: string,
  page: number = 1,
  pageSize: number = 20
) {
  const supabase = getSupabaseAdmin()

  const safePage = Math.max(1, page)
  const safeSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE)

  const from = (safePage - 1) * safeSize
  const to = from + safeSize - 1

  const { data, error, count } = await supabase
    .from("incomes")
    .select("id,amount,date,notes,created_at", { count: "exact" })
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    income: (data ?? []) as Income[],
    total: count ?? 0,
    hasMore: (count ?? 0) > safePage * safeSize,
  }
}

/* ==========================================================
   Create Income
========================================================== */

export async function createIncome(payload: IncomeInsert) {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from("incomes")
    .insert(payload)
    .select("id,amount,date,notes,created_at")
    .single()

  if (error) throw error
  return data as Income
}

/* ==========================================================
   Update Income
========================================================== */

export async function updateIncome(id: string, payload: IncomeUpdate) {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from("incomes")
    .update(payload)
    .eq("id", id)
    .select("id,amount,date,notes,created_at")
    .single()

  if (error) throw error
  return data as Income
}

/* ==========================================================
   Delete Income
========================================================== */

export async function deleteIncome(id: string) {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from("incomes")
    .delete()
    .eq("id", id)

  if (error) throw error
  return true
}

/* ==========================================================
   Income Summary
========================================================== */

export async function getIncomeSummary(userId: string) {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from("incomes")
    .select("amount")
    .eq("user_id", userId)

  if (error) throw error

  const total = (data ?? []).reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
  )

  return { totalIncome: total }
}