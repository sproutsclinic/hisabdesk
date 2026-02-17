ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Expenses Service Layer (SUPABASE v2 SAFE)
// Works in BOTH Client + Server Components
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import type { Database } from "@/types/db"

/* ==========================================================
   CLIENT FACTORY
========================================================== */

function getClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}

/* ==========================================================
   TYPES
========================================================== */

type Expense =
  Database["public"]["Tables"]["expenses"]["Row"]

type ExpenseInsert =
  Database["public"]["Tables"]["expenses"]["Insert"]

type ExpenseUpdate =
  Database["public"]["Tables"]["expenses"]["Update"]

const MAX_PAGE_SIZE = 100

/* ==========================================================
   Fetch Expenses
========================================================== */

export async function getExpenses(
  userId: string,
  page: number = 1,
  pageSize: number = 20
) {
  const supabase = getClient()

  const safePage = Math.max(1, page)
  const safeSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE)

  const from = (safePage - 1) * safeSize
  const to = from + safeSize - 1

  const { data, error, count } = await supabase
    .from("expenses")
    .select("id,amount,date,category,notes,created_at", {
      count: "exact",
    })
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    expenses: (data ?? []) as Expense[],
    total: count ?? 0,
    hasMore: (count ?? 0) > safePage * safeSize,
  }
}

/* ==========================================================
   Create Expense
========================================================== */

export async function createExpense(payload: ExpenseInsert) {
  const supabase = getClient()

  const { data, error } = await supabase
    .from("expenses")
    .insert(payload)
    .select("id,amount,date,category,notes,created_at")
    .single()

  if (error) throw error

  return data as Expense
}

/* ==========================================================
   Update Expense
========================================================== */

export async function updateExpense(
  id: string,
  payload: ExpenseUpdate
) {
  const supabase = getClient()

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
   Delete Expense
========================================================== */

export async function deleteExpense(id: string) {
  const supabase = getClient()

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)

  if (error) throw error

  return true
}

/* ==========================================================
   Summary
========================================================== */

export async function getExpenseSummary(userId: string) {
  const supabase = getClient()

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
