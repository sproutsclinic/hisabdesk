ï»¿"use server"

/**
 * =========================================================
 * Auto Category Expense (AI Integration Layer)
 * FINAL ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Schema Aligned Version
 * =========================================================
 *
 * PURPOSE
 * Auto-detect category BEFORE saving expense.
 *
 * IMPORTANT
 * This file MUST match the real Supabase schema.
 * Do NOT add columns here.
 */

import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import {
  categorizeExpense,
  type ExpenseInput,
} from "@/lib/ai/expense-categoriser"

/* =========================================================
   TYPES ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â aligned to real DB
========================================================= */

export type SaveExpenseInput = ExpenseInput & {
  user_id?: string
  notes?: string
  date?: string
}

/* =========================================================
   CLIENT (SERVICE ROLE)
========================================================= */

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
    }
  )
}

/* =========================================================
   SINGLE SAVE
========================================================= */

export async function saveExpenseAuto(input: SaveExpenseInput) {
  const supabase = getClient()

  // 1ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£ Categorize using your AI logic
  const category = categorizeExpense({
    description: input.description,
    amount: input.amount,
  })

  // 2ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£ Insert ONLY real columns
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      user_id: input.user_id ?? null,
      amount: input.amount ?? 0,
      category,
      notes: input.notes ?? input.description ?? null,
      date: input.date ?? new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  return data
}

/* =========================================================
   BULK SAVE (CSV / imports)
========================================================= */

export async function saveExpensesBulkAuto(
  userId: string,
  rows: SaveExpenseInput[]
) {
  const supabase = getClient()

  const payload = rows.map((r) => ({
    user_id: userId,
    amount: r.amount ?? 0,
    category: categorizeExpense(r),
    notes: r.notes ?? r.description ?? null,
    date: r.date ?? new Date().toISOString(),
  }))

  const { data, error } = await supabase
    .from("expenses")
    .insert(payload)

  if (error) throw error

  return data
}
