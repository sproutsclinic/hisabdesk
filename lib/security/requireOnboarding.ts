// ==========================================================
// HisabDesk — requireOnboarding Guard (Server only)
//
// PURPOSE
// Force first-time users to complete onboarding
//
// Behavior:
// - ensure profile exists (bootstrap)
// - if onboarding_complete = false → redirect
// - else → continue
//
// Used by:
// - protected pages (server components/layouts)
// - dashboards
//
// RULES
// ✅ server only
// ✅ DB only via service
// ❌ no UI
// ❌ no business logic
// ❌ no calculations
// ==========================================================

import { redirect } from "next/navigation"

import { requireUser } from "./guards"
import { ensureProfile } from "@/lib/api/profile/profile.bootstrap"

/* =========================================================
Public Guard
========================================================= */

/**
 * Usage (Server Component / Layout):
 *
 * await requireOnboarding()
 *
 * Flow:
 *   1. auth
 *   2. ensure profile exists
 *   3. check onboarding
 */
export async function requireOnboarding(): Promise<void> {
  const user = await requireUser()

  // -------------------------------------------------------
  // NEW: ensure profile exists (bootstrap safe)
  // -------------------------------------------------------

  const profile = await ensureProfile(user.id)

  // -------------------------------------------------------
  // check onboarding flag
  // -------------------------------------------------------

  const completed = profile.onboarding_complete === true

  // -------------------------------------------------------
  // redirect if not completed
  // -------------------------------------------------------

  if (!completed) {
    redirect("/personal/onboarding")
  }
}

/* =========================================================
Optional helper
========================================================= */

export async function isOnboardingComplete(): Promise<boolean> {
  const user = await requireUser()

  const profile = await ensureProfile(user.id)

  return profile.onboarding_complete === true
}
