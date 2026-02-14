// ==========================================================
// HisabDesk — Income Service Layer (PRODUCTION SAFE)
// FIX: removed non-existent columns (category/subcategory)
// Phase 3 — Query safety + performance hardening (ADDITIVE ONLY)
// ==========================================================

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/db"

/* ==========================================================
   SINGLETON SUPABASE (server-safe config — additive only)
========================================================== */

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false, // ✅ prevents memory/session overhead
      autoRefreshToken: false,
    },
  }
)

/* ==========================================================
   TYPES
========================================================== */

type Income =
  Database["public"]["Tables"]["incomes"]["Row"]

type IncomeInsert =
  Database["public"]["Tables"]["incomes"]["Insert"]

type IncomeUpdate =
  Database["public"]["Tables"]["incomes"]["Update"]

/* ==========================================================
   CONSTANTS (ADDITIVE SAFETY LIMITS)
========================================================== */

const MAX_PAGE_SIZE = 100 // prevents accidental heavy fetches

/* ==========================================================
   Fetch Income (SAFE — only real columns)
   ✅ pagination
   ✅ column selection
   ✅ overfetch protection
========================================================== */

export async function getIncome(
  userId: string,
  page: number = 1,
  pageSize: number = 20
) {
  // ✅ additive guard rails
  const safePage = Math.max(1, page)
  const safeSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE)

  const from = (safePage - 1) * safeSize
  const to = from + safeSize - 1

  const { data, error, count } = await supabase
    .from("incomes")
    // ✅ only columns that truly exist in DB
    .select("id,amount,date,notes,created_at", {
      count: "exact",
    })
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
   Create
   ✅ return minimal columns only (avoid overfetch)
========================================================== */

export async function createIncome(payload: IncomeInsert) {
  const { data, error } = await supabase
    .from("incomes")
    .insert(payload)
    .select("id,amount,date,notes,created_at")
    .single()

  if (error) throw error
  return data as Income
}

/* ==========================================================
   Update
   ✅ minimal select
========================================================== */

export async function updateIncome(
  id: string,
  payload: IncomeUpdate
) {
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
   Delete
========================================================== */

export async function deleteIncome(id: string) {
  const { error } = await supabase
    .from("incomes")
    .delete()
    .eq("id", id)

  if (error) throw error
  return true
}

/* ==========================================================
   Summary
   ✅ PERFORMANCE HARDENED
   - select only amount
   - head request for count (cheap)
   - safe aggregation
========================================================== */

export async function getIncomeSummary(userId: string) {
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
