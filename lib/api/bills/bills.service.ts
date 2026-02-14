// ==========================================================
// Bills Service (CLEAN + SIMPLE)
// CRUD + Cron Hook Placeholder
// ==========================================================

import { createClient } from "@/lib/supabase/server"

/* =========================================================
TYPES
========================================================= */

export type CreateBillRequest = {
  title: string
  amount: number
  category?: string
  frequency: string
  next_due_at: string
  remind_days_before?: number
}

export type UpdateBillRequest = Partial<CreateBillRequest> & {
  id: string
}

/* =========================================================
CRUD — USED BY APP
========================================================= */

export async function getBillsOverview(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", userId)
    .order("next_due_at", { ascending: true })

  if (error) throw new Error(error.message)

  return data || []
}

export async function createBill(
  userId: string,
  body: CreateBillRequest
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bills")
    .insert({
      ...body,
      user_id: userId,
      is_active: true,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data
}

export async function updateBill(
  userId: string,
  body: UpdateBillRequest
) {
  const supabase = createClient()

  const { id, ...updates } = body

  const { data, error } = await supabase
    .from("bills")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data
}

export async function deleteBill(userId: string, id: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from("bills")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw new Error(error.message)

  return true
}

/* =========================================================
CRON HOOK (Required by automation runner)
Currently acts as SAFE NO-OP until reminder engine is built.
========================================================= */

export async function runBillsReminders(): Promise<number> {
  // Intentionally empty.
  // Future version will:
  // - find upcoming bills
  // - generate reminders
  // - push notifications

  return 0
}