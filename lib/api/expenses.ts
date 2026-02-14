// ==========================================================
// HisabDesk — Expenses Service Layer (UNIVERSAL SAFE)
// Works in BOTH:
//   ✓ Client Components
//   ✓ Server Components
// NO next/headers
// NO cookies
// FREE MODE ready
// Phase 3 — Production hardening + performance (ADDITIVE ONLY)
// ==========================================================

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/db"

/* ==========================================================
   SINGLE UNIVERSAL CLIENT
   ✅ server-safe config
   ✅ no session persistence
========================================================== */

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false, // ✅ additive safety
    },
  }
)

/* ==========================================================
   TYPES
========================================================== */

type Expense =
  Database["public"]["Tables"]["expenses"]["Row"]

type ExpenseInsert =
  Database["public"]["Tables"]["expenses"]["Insert"]

type ExpenseUpdate =
  Database["public"]["Tables"]["expenses"]["Update"]

/* ==========================================================
   CONSTANTS (ADDITIVE SAFETY LIMITS)
========================================================== */

const MAX_PAGE_SIZE = 100 // prevents heavy accidental fetches

/* ==========================================================
   Fetch Expenses (paginated + minimal fields)
   ✅ pagination
   ✅ minimal select
   ✅ overfetch protection
========================================================== */

export async function getExpenses(
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
    .from("expenses")
    // only required list fields (performance)
    .select("id,amount,date,category,notes,created_at", {
      count: "exact",
    })
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false }) // stable order
    .range(from, to)

  if (error) throw error

  const safe = (data ?? []) as Expense[]

  return {
    expenses: safe,
    total: count ?? 0,
    hasMore: (count ?? 0) > safePage * safeSize,
  }
}

/* ==========================================================
   Create
   ✅ return minimal fields only
========================================================== */

export async function createExpense(payload: ExpenseInsert) {
  const { data, error } = await supabase
    .from("expenses")
    .insert(payload)
    .select("id,amount,date,category,notes,created_at")
    .single()

  if (error) throw error

  return data as Expense
}

/* ==========================================================
   Update
   ✅ minimal select only
========================================================== */

export async function updateExpense(
  id: string,
  payload: ExpenseUpdate
) {
  const { data, error } = await supabase
    .from("expenses")
    .update(payload)
    .eq("id", id)
    .select("id,amount,date,category,notes,created_at")
    .single()

  if (error) throw error

  return data as Expense
}

/* ==========================================================
   Delete
========================================================== */

export async function deleteExpense(id: string) {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)

  if (error) throw error

  return true
}

/* ==========================================================
   Summary (lightweight, safe)
   ✅ minimal select only
   ✅ safe aggregation
========================================================== */

export async function getExpenseSummary(userId: string) {
  const { data, error } = await supabase
    .from("expenses")
    .select("amount")
    .eq("user_id", userId)

  if (error) throw error

  const total = (data ?? []).reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
  )

  return {
    totalExpense: total,
  }
}
