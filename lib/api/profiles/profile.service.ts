// ==========================================================
// Profile Service (Server only)
// Layer: API → Service → DB
//
// PURPOSE
// Manage user profile + onboarding data
//
// Used by:
// /api/profile/onboarding
//
// RULES
// ✅ DB orchestration only
// ✅ no business logic
// ❌ no HTTP
// ❌ no UI
// ❌ no calculations
// ❌ no OpenAI
// ==========================================================

import { createClient } from "@/lib/supabase/server"

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
  const supabase = createClient()

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
  const supabase = createClient()

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
