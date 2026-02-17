ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Accounts API Layer
// Centralized DB access for financial accounts
// Used by: transactions, dashboard, net worth, automation
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

const supabase = getSupabaseAdmin()

// ==========================================================
// TYPES
// ==========================================================

export type AccountType =
  | "bank"
  | "cash"
  | "credit_card"
  | "wallet"
  | "investment"
  | "other"

export interface AccountInput {
  name: string
  type: AccountType
  balance?: number
  currency?: string
  is_active?: boolean
}

// ==========================================================
// CREATE
// ==========================================================

export async function createAccount(
  userId: string,
  input: AccountInput
) {
  const { data, error } = await supabase
    .from("accounts")
    .insert({
      user_id: userId,
      name: input.name,
      type: input.type,
      balance: input.balance ?? 0,
      currency: input.currency ?? "INR",
      is_active: input.is_active ?? true,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// UPDATE
// ==========================================================

export async function updateAccount(
  id: string,
  userId: string,
  input: Partial<AccountInput>
) {
  const { data, error } = await supabase
    .from("accounts")
    .update(input)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// DELETE (soft recommended ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ hard delete here)
// ==========================================================

export async function deleteAccount(id: string, userId: string) {
  const { error } = await supabase
    .from("accounts")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw error

  return true
}

// ==========================================================
// GET SINGLE
// ==========================================================

export async function getAccount(id: string, userId: string) {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// LIST ALL ACTIVE
// ==========================================================

export async function listAccounts(userId: string) {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  if (error) throw error

  return data || []
}

// ==========================================================
// TOTAL BALANCE (for dashboard quick calc)
// ==========================================================

export async function getTotalAccountBalance(userId: string) {
  const { data, error } = await supabase
    .from("accounts")
    .select("balance")
    .eq("user_id", userId)
    .eq("is_active", true)

  if (error) throw error

  const total =
    (data || []).reduce((sum, acc) => sum + (acc.balance || 0), 0)

  return total
}

// ==========================================================
// ADJUST BALANCE
// Used internally by transactions service
// ==========================================================

export async function adjustAccountBalance(
  accountId: string,
  userId: string,
  delta: number
) {
  const { data: account, error: fetchError } = await supabase
    .from("accounts")
    .select("balance")
    .eq("id", accountId)
    .eq("user_id", userId)
    .single()

  if (fetchError) throw fetchError

  const newBalance = (account.balance || 0) + delta

  const { data, error } = await supabase
    .from("accounts")
    .update({ balance: newBalance })
    .eq("id", accountId)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error

  return data
}
