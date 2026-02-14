"use server"

/**
 * =========================================================
 * Auto Category Expense (AI Integration Layer)
 * HisabDesk – Phase B (AI Features – Integration)
 * =========================================================
 *
 * PURPOSE
 * Automatically apply category BEFORE saving expense.
 *
 * IMPORTANT
 * ---------------------------------------------------------
 * This DOES NOT replace your:
 *   lib/ai/expense-categoriser.ts
 *
 * It simply USES it.
 *
 * Architecture:
 *
 *   UI → saveExpense()
 *            ↓
 *      autoCategoryExpense()
 *            ↓
 *      Supabase insert
 *
 * =========================================================
 *
 * WHY THIS FILE EXISTS
 *
 * Keep:
 *   categorizeExpense()  → pure logic
 *
 * Add:
 *   autoCategoryExpense() → DB integration
 *
 * Separation of concerns = enterprise clean design
 *
 * =========================================================
 *
 * USAGE (recommended everywhere)
 *
 * import { saveExpenseAuto } from "@/lib/ai/auto-category-expense"
 *
 * await saveExpenseAuto({
 *   org_id,
 *   description,
 *   vendor,
 *   amount
 * })
 *
 * =========================================================
 *
 * SAFE
 * ✓ server only
 * ✓ service role
 * ✓ no existing file changes
 * ✓ uses your existing categoriser
 * =========================================================
 */

import { createClient } from "@supabase/supabase-js"
import {
  categorizeExpense,
  type ExpenseInput,
} from "@/lib/ai/expense-categoriser"

/* =========================================================
   TYPES
========================================================= */

export type SaveExpenseInput = ExpenseInput & {
  org_id: string
  user_id?: string
  note?: string
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
   MAIN SAVE FUNCTION
========================================================= */

export async function saveExpenseAuto(
  input: SaveExpenseInput
) {
  const supabase = getClient()

  /* ------------------------------------------------------
     1️⃣ AUTO CATEGORY (uses your engine)
  ------------------------------------------------------ */

  const category = categorizeExpense({
    description: input.description,
    vendor: input.vendor,
    amount: input.amount,
  })

  /* ------------------------------------------------------
     2️⃣ INSERT
  ------------------------------------------------------ */

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      org_id: input.org_id,
      user_id: input.user_id ?? null,
      description: input.description ?? null,
      vendor: input.vendor ?? null,
      note: input.note ?? null,
      amount: input.amount ?? 0,
      category,
      created_at:
        input.date ?? new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  return data
}

/* =========================================================
   BULK SAVE (imports / CSV / bank statements)
========================================================= */

export async function saveExpensesBulkAuto(
  orgId: string,
  rows: SaveExpenseInput[]
) {
  const supabase = getClient()

  const payload = rows.map((r) => ({
    ...r,
    org_id: orgId,
    category: categorizeExpense(r),
  }))

  const { data, error } = await supabase
    .from("expenses")
    .insert(payload)

  if (error) throw error

  return data
}
