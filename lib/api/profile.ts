ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Financial Profile API Layer
// User financial preferences + personalization
// Used by: tax engine, AI context, planner, insights
// Table: financial_profile
// One row per user
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

const supabase = getSupabaseAdmin()

// ==========================================================
// TYPES
// ==========================================================

export type RiskLevel = "low" | "medium" | "high"
export type TaxRegime = "old" | "new"

export interface FinancialProfileInput {
  monthly_income?: number
  monthly_expense?: number
  dependents?: number
  risk_level?: RiskLevel
  tax_regime?: TaxRegime
  retirement_age?: number
  target_savings_rate?: number
  city?: string | null
}

// ==========================================================
// GET (single profile)
// ==========================================================

export async function getFinancialProfile(userId: string) {
  const { data, error } = await supabase
    .from("financial_profile")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (error) throw error

  return data
}

// ==========================================================
// CREATE OR UPDATE (UPSERT)
// Ensures exactly 1 profile per user
// ==========================================================

export async function upsertFinancialProfile(
  userId: string,
  input: FinancialProfileInput
) {
  const { data, error } = await supabase
    .from("financial_profile")
    .upsert(
      {
        user_id: userId,
        ...input,
      },
      {
        onConflict: "user_id",
      }
    )
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// UPDATE PARTIAL
// ==========================================================

export async function updateFinancialProfile(
  userId: string,
  input: Partial<FinancialProfileInput>
) {
  const { data, error } = await supabase
    .from("financial_profile")
    .update(input)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// DELETE (rare)
// ==========================================================

export async function deleteFinancialProfile(userId: string) {
  const { error } = await supabase
    .from("financial_profile")
    .delete()
    .eq("user_id", userId)

  if (error) throw error

  return true
}

// ==========================================================
// DEFAULT CREATION (called after signup)
// ==========================================================

export async function createDefaultFinancialProfile(
  userId: string
) {
  const existing = await getFinancialProfile(userId)

  if (existing) return existing

  return upsertFinancialProfile(userId, {
    dependents: 0,
    risk_level: "medium",
    tax_regime: "new",
    retirement_age: 60,
    target_savings_rate: 20,
    city: null,
  })
}
