ï»¿// ==========================================================
// Profile Service (Server only)
// Layer: API ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Service ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ DB
//
// PURPOSE
// Manage user profile + onboarding data
//
// Used by:
// /api/profile/onboarding
//
// RULES
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ DB orchestration only
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ no business logic
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no HTTP
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no UI
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no calculations
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no OpenAI
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

/* =========================================================
Types
========================================================= */

export interface OnboardingProfileInput {
  risk: "low" | "medium" | "high"
  dependents: number
  monthlyIncome: number
  monthlyExpense: number
  primaryGoal: string
}

/* =========================================================
Public API
========================================================= */

/**
 * Save onboarding profile
 *
 * Strategy:
 * - upsert into profiles table
 * - mark onboarding_complete = true
 *
 * Table expectation:
 * profiles:
 *   user_id (pk/fk)
 *   risk_appetite
 *   dependents
 *   monthly_income
 *   monthly_expense
 *   primary_goal
 *   onboarding_complete
 */
export async function saveOnboardingProfile(
  userId: string,
  input: OnboardingProfileInput
): Promise<void> {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: userId,

      risk_appetite: input.risk,
      dependents: input.dependents,
      monthly_income: input.monthlyIncome,
      monthly_expense: input.monthlyExpense,
      primary_goal: input.primaryGoal,

      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id",
    }
  )

  if (error) {
    throw new Error(error.message)
  }
}

/* =========================================================
Optional Helpers (future reuse)
========================================================= */

export async function getProfile(userId: string) {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
