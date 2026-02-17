ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Recurring Rules API Layer
// Automation engine for scheduled transactions
// Used by: automation module + cron worker
// Creates entries ONLY in transactions (single source of truth)
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

const supabase = getSupabaseAdmin()

// ==========================================================
// TYPES
// ==========================================================

export type RecurringType = "income" | "expense"
export type RecurringFrequency = "daily" | "weekly" | "monthly" | "yearly"

export interface RecurringRuleInput {
  name: string
  type: RecurringType
  amount: number
  account_id: string
  category_id?: string | null
  frequency: RecurringFrequency
  next_run_date: string
  description?: string | null
  is_active?: boolean
}

// ==========================================================
// DATE HELPERS
// ==========================================================

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function addMonths(date: Date, months: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function computeNextDate(
  dateStr: string,
  frequency: RecurringFrequency
) {
  const d = new Date(dateStr)

  if (frequency === "daily") return addDays(d, 1)
  if (frequency === "weekly") return addDays(d, 7)
  if (frequency === "monthly") return addMonths(d, 1)
  if (frequency === "yearly") return addMonths(d, 12)

  return d
}

// ==========================================================
// CRUD
// ==========================================================

export async function createRecurringRule(
  userId: string,
  input: RecurringRuleInput
) {
  const { data, error } = await supabase
    .from("recurring_rules")
    .insert({
      user_id: userId,
      ...input,
      is_active: input.is_active ?? true,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function updateRecurringRule(
  id: string,
  userId: string,
  input: Partial<RecurringRuleInput>
) {
  const { data, error } = await supabase
    .from("recurring_rules")
    .update(input)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function deleteRecurringRule(
  id: string,
  userId: string
) {
  const { error } = await supabase
    .from("recurring_rules")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw error

  return true
}

export async function listRecurringRules(userId: string) {
  const { data, error } = await supabase
    .from("recurring_rules")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)

  if (error) throw error

  return data || []
}

// ==========================================================
// DUE RULES (for cron)
// ==========================================================

export async function getDueRecurringRules(userId: string) {
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("recurring_rules")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .lte("next_run_date", today)

  if (error) throw error

  return data || []
}

// ==========================================================
// EXECUTE RULE
// Creates transaction + moves next date
// ==========================================================

export async function executeRecurringRule(
  rule: any
) {
  const today = new Date().toISOString().split("T")[0]

  // create transaction
  const { error: txError } = await supabase
    .from("transactions")
    .insert({
      user_id: rule.user_id,
      account_id: rule.account_id,
      category_id: rule.category_id ?? null,
      type: rule.type,
      amount: rule.amount,
      description: rule.description ?? rule.name,
      date: today,
    })

  if (txError) throw txError

  // compute next run
  const next = computeNextDate(
    rule.next_run_date,
    rule.frequency
  )

  // update rule
  const { error: updateError } = await supabase
    .from("recurring_rules")
    .update({
      next_run_date: next.toISOString().split("T")[0],
    })
    .eq("id", rule.id)

  if (updateError) throw updateError

  return true
}

// ==========================================================
// RUN ALL DUE (cron entrypoint)
// ==========================================================

export async function runDueRecurringForUser(userId: string) {
  const rules = await getDueRecurringRules(userId)

  for (const rule of rules) {
    await executeRecurringRule(rule)
  }

  return rules.length
}
