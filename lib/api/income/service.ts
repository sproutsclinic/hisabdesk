ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Income Service (DB layer ONLY)
   ---------------------------------------------------------
   RESPONSIBILITY
   - All DB access
   - Aggregations
   - NO business rules outside this file

   ROUTE ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ service ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ DB

   RULES
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ server only
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ supabase only here
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ aggregation allowed
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â no UI
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â no AI
========================================================= */

"use server"

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

import type {
  CreateIncomeRequest,
  UpdateIncomeRequest,
  IncomeRow,
} from "./types"

/* =========================================================
   LIST
========================================================= */

export async function listIncome(
  userId: string,
): Promise<IncomeRow[]> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from("incomes")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) throw new Error(error.message)

  return data ?? []
}

/* =========================================================
   TOTAL (aggregation moved from route)
========================================================= */

export async function getIncomeTotal(
  userId: string,
): Promise<number> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from("incomes")
    .select("amount")
    .eq("user_id", userId)

  if (error) throw new Error(error.message)

  return (
    data?.reduce(
      (sum: number, r: any) => sum + Number(r.amount || 0),
      0,
    ) ?? 0
  )
}

/* =========================================================
   CREATE
========================================================= */

export async function createIncome(
  userId: string,
  payload: CreateIncomeRequest,
): Promise<IncomeRow> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from("incomes")
    .insert({
      user_id: userId,
      amount: payload.amount,
      category: payload.category,
      date: payload.date,
      notes: payload.notes ?? null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data
}

/* =========================================================
   UPDATE
========================================================= */

export async function updateIncome(
  userId: string,
  payload: UpdateIncomeRequest,
): Promise<IncomeRow> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from("incomes")
    .update({
      amount: payload.amount,
      category: payload.category,
      date: payload.date,
      notes: payload.notes ?? null,
    })
    .eq("id", payload.id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data
}

/* =========================================================
   DELETE
========================================================= */

export async function deleteIncome(
  userId: string,
  id: string,
): Promise<void> {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from("incomes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw new Error(error.message)
}
