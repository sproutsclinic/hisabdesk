/* =========================================================
   HisabDesk — Income Service (DB layer ONLY)
   ---------------------------------------------------------
   RESPONSIBILITY
   - All DB access
   - Aggregations
   - NO business rules outside this file

   ROUTE → service → DB

   RULES
   ✓ server only
   ✓ supabase only here
   ✓ aggregation allowed
   ✗ no UI
   ✗ no AI
========================================================= */

"use server"

import { createClient } from "@/lib/supabase/server"

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
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

  const { error } = await supabase
    .from("incomes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw new Error(error.message)
}
