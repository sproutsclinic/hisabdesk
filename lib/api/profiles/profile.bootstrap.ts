// ==========================================================
// HisabDesk — Profile Bootstrap Service
// Location: lib/api/profile/profile.bootstrap.ts
//
// PURPOSE
// Ensure EVERY authenticated user has a profile row.
//
// WHY THIS EXISTS
// ----------------------------------------------------------
// First login problem:
//
// user logs in
//   → profiles row does NOT exist yet
//   → dashboard/hooks expect profile
//   → null errors / crashes
//
// Solution:
// bootstrap profile automatically (idempotent)
//
// WHEN USED
// ----------------------------------------------------------
// - requireOnboarding()
// - dashboard server layout
// - profile fetch
//
// ARCHITECTURE
// API/Guard → service (THIS) → DB
//
// RULES
// ✅ server only
// ✅ DB only
// ❌ no business logic
// ❌ no UI
// ❌ no calculations
// ==========================================================

import { createClient } from "@/lib/supabase/server"
import type { ProfileRow } from "./types"

/* =========================================================
Public API
========================================================= */

/**
 * Ensures profile exists
 *
 * Safe:
 * - idempotent
 * - cheap
 * - no duplicate rows (user_id PK)
 *
 * Returns:
 * profile row (existing or newly created)
 */
export async function ensureProfile(
  userId: string
): Promise<ProfileRow> {
  const supabase = createClient()

  // -------------------------------------------------------
  // 1. Try fetch existing
  // -------------------------------------------------------

  const { data: existing, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  if (existing) return existing as ProfileRow

  // -------------------------------------------------------
  // 2. Create default profile (first login)
  // -------------------------------------------------------

  const now = new Date().toISOString()

  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .insert({
      user_id: userId,

      full_name: null,
      age: null,

      risk_appetite: "medium",
      income_stability: "salaried",

      monthly_income: 0,
      monthly_expense: 0,

      dependents: 0,
      financial_goal: null,

      onboarding_complete: false,

      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single()

  if (insertError) {
    throw new Error(insertError.message)
  }

  return created as ProfileRow
}
