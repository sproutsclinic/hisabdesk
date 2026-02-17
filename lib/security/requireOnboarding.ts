ï»¿import { redirect } from "next/navigation"
import type { ProfileRow } from "@/lib/api/profile/types"

/* =========================================================
   Require Onboarding Guard
   Compatible with multiple schema versions
   ========================================================= */

export function requireOnboarding(profile: ProfileRow | null) {
  if (!profile) {
    redirect("/onboarding")
  }

  // -------------------------------------------------------
  // Some environments don't yet have onboarding_complete
  // We must safely detect instead of assuming schema.
  // -------------------------------------------------------

  const completed =
    typeof (profile as any).onboarding_complete === "boolean"
      ? (profile as any).onboarding_complete === true
      : true // ? fallback for older schema

  if (!completed) {
    redirect("/onboarding")
  }

  return profile
}
