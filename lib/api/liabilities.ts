ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Liabilities API Layer
// Handles loans, EMIs, debts
// Used by: loans module, net worth, dashboard
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

const supabase = getSupabaseAdmin()

// ==========================================================
// TYPES
// ==========================================================

export type LiabilityType =
  | "home_loan"
  | "car_loan"
  | "personal_loan"
  | "education_loan"
  | "credit_card"
  | "other"

export interface LiabilityInput {
  name: string
  type: LiabilityType
  principal: number
  interest_rate: number // annual %
  tenure_months: number
  start_date: string
  emi?: number
  outstanding?: number
  notes?: string | null
}

// ==========================================================
// HELPERS
// ==========================================================

function calculateEMI(
  principal: number,
  annualRate: number,
  months: number
) {
  const r = annualRate / 12 / 100

  if (r === 0) return principal / months

  const emi =
    (principal * r * Math.pow(1 + r, months)) /
    (Math.pow(1 + r, months) - 1)

  return Math.round(emi)
}

// ==========================================================
// CREATE
// ==========================================================

export async function createLiability(
  userId: string,
  input: LiabilityInput
) {
  const emi =
    input.emi ??
    calculateEMI(
      input.principal,
      input.interest_rate,
      input.tenure_months
    )

  const outstanding = input.outstanding ?? input.principal

  const { data, error } = await supabase
    .from("liabilities")
    .insert({
      user_id: userId,
      ...input,
      emi,
      outstanding,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// UPDATE
// ==========================================================

export async function updateLiability(
  id: string,
  userId: string,
  input: Partial<LiabilityInput>
) {
  const existing = await getLiability(id, userId)

  const merged = { ...existing, ...input }

  const emi =
    merged.emi ??
    calculateEMI(
      merged.principal,
      merged.interest_rate,
      merged.tenure_months
    )

  const { data, error } = await supabase
    .from("liabilities")
    .update({
      ...input,
      emi,
    })
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

export async function deleteLiability(
  id: string,
  userId: string
) {
  const { error } = await supabase
    .from("liabilities")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw error

  return true
}

// ==========================================================
// GET SINGLE
// ==========================================================

export async function getLiability(
  id: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("liabilities")
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

export async function listLiabilities(userId: string) {
  const { data, error } = await supabase
    .from("liabilities")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data || []
}

// ==========================================================
// TOTAL OUTSTANDING (for net worth)
// ==========================================================

export async function getTotalOutstanding(userId: string) {
  const { data, error } = await supabase
    .from("liabilities")
    .select("outstanding")
    .eq("user_id", userId)

  if (error) throw error

  const total =
    (data || []).reduce(
      (sum, row) => sum + (row.outstanding || 0),
      0
    )

  return total
}

// ==========================================================
// AMORTIZATION SCHEDULE
// Used for EMI breakdown UI
// ==========================================================

export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  months: number
) {
  const r = annualRate / 12 / 100
  const emi = calculateEMI(principal, annualRate, months)

  let balance = principal

  const schedule = []

  for (let i = 1; i <= months; i++) {
    const interest = balance * r
    const principalPaid = emi - interest

    balance -= principalPaid

    schedule.push({
      month: i,
      emi,
      interest: Math.round(interest),
      principal: Math.round(principalPaid),
      balance: Math.max(0, Math.round(balance)),
    })
  }

  return schedule
}
