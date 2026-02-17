ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Bills API Layer
// Recurring bills & subscriptions management
// Used by: bills module, automation engine, alerts
// Works with: transactions (auto-create expenses)
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

const supabase = getSupabaseAdmin()

// ==========================================================
// TYPES
// ==========================================================

export type BillFrequency = "monthly" | "quarterly" | "yearly"

export interface BillInput {
  name: string
  amount: number
  category_id?: string | null
  account_id: string
  frequency: BillFrequency
  next_due_date: string
  auto_pay?: boolean
  notes?: string | null
}

export interface BillWithStatus extends BillInput {
  id: string
  is_due: boolean
  days_left: number
}

// ==========================================================
// DATE HELPERS
// ==========================================================

function addMonths(date: Date, months: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function nextDate(dateStr: string, frequency: BillFrequency) {
  const d = new Date(dateStr)

  if (frequency === "monthly") return addMonths(d, 1)
  if (frequency === "quarterly") return addMonths(d, 3)
  if (frequency === "yearly") return addMonths(d, 12)

  return d
}

// ==========================================================
// CREATE
// ==========================================================

export async function createBill(
  userId: string,
  input: BillInput
) {
  const { data, error } = await supabase
    .from("bills")
    .insert({
      user_id: userId,
      name: input.name,
      amount: input.amount,
      category_id: input.category_id ?? null,
      account_id: input.account_id,
      frequency: input.frequency,
      next_due_date: input.next_due_date,
      auto_pay: input.auto_pay ?? false,
      notes: input.notes ?? null,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// UPDATE
// ==========================================================

export async function updateBill(
  id: string,
  userId: string,
  input: Partial<BillInput>
) {
  const { data, error } = await supabase
    .from("bills")
    .update(input)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// DELETE
// ==========================================================

export async function deleteBill(id: string, userId: string) {
  const { error } = await supabase
    .from("bills")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw error

  return true
}

// ==========================================================
// GET SINGLE
// ==========================================================

export async function getBill(id: string, userId: string) {
  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// LIST
// ==========================================================

export async function listBills(
  userId: string
): Promise<BillWithStatus[]> {
  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", userId)
    .order("next_due_date", { ascending: true })

  if (error) throw error

  const today = new Date()

  return (data || []).map((b) => {
    const due = new Date(b.next_due_date)
    const diff =
      Math.ceil(
        (due.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
      )

    return {
      ...b,
      is_due: diff <= 0,
      days_left: diff,
    }
  })
}

// ==========================================================
// MARK PAID (move next_due_date)
// Called by automation/cron after creating expense
// ==========================================================

export async function markBillPaid(
  id: string,
  userId: string
) {
  const bill = await getBill(id, userId)

  const next = nextDate(
    bill.next_due_date,
    bill.frequency
  )

  const { data, error } = await supabase
    .from("bills")
    .update({
      next_due_date: next.toISOString().split("T")[0],
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// GET DUE BILLS (for scheduler)
// ==========================================================

export async function getDueBills(userId: string) {
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", userId)
    .lte("next_due_date", today)

  if (error) throw error

  return data || []
}
