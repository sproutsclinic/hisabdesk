ï»¿"use server"

/**
 * =========================================================
 * Plan Limits Engine (Central Billing Rules)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Growth / Monetization Core
 * =========================================================
 *
 * PURPOSE
 * Single source of truth for ALL plan limits.
 *
 * NEVER hardcode limits inside UI or APIs.
 * ALWAYS import from here.
 *
 * WHY
 * ---------------------------------------------------------
 * Without central limits:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ inconsistent behavior
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ bugs
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ hard to change plans
 *
 * With this:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ one place to edit pricing
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ scalable
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ enterprise clean
 *
 * =========================================================
 *
 * USAGE
 *
 * import { getPlanLimits, canUse } from "@/lib/billing/plan-limits"
 *
 * const limits = await getPlanLimits(userId)
 *
 * if (!canUse(count, limits.expenses)) {
 *   return error("Upgrade required")
 * }
 *
 * =========================================================
 *
 * SAFE
 * - pure utility
 * - no DB writes
 * =========================================================
 */

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

/* =========================================================
   TYPES
========================================================= */

export type PlanName = "free" | "pro"

export type PlanLimits = {
  name: PlanName
  expenses: number
  invoices: number
  documents: number
  gstSyncsPerMonth: number
  teamMembers: number
}

/* =========================================================
   LIMIT DEFINITIONS (EDIT HERE ONLY)
========================================================= */

const FREE_PLAN: PlanLimits = {
  name: "free",
  expenses: 100,
  invoices: 50,
  documents: 20,
  gstSyncsPerMonth: 3,
  teamMembers: 1,
}

const PRO_PLAN: PlanLimits = {
  name: "pro",
  expenses: 100_000,
  invoices: 100_000,
  documents: 100_000,
  gstSyncsPerMonth: 1000,
  teamMembers: 50,
}

/* =========================================================
   CLIENT
========================================================= */

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/* =========================================================
   GET PLAN
========================================================= */

export async function getPlanLimits(
  userId: string
): Promise<PlanLimits> {
  const supabase = getClient()

  const { data } = await supabase
    .from("profiles")
    .select("is_pro, pro_expires_at")
    .eq("id", userId)
    .single()

  if (!data) return FREE_PLAN

  /* expired pro treated as free */
  if (
    data.is_pro &&
    (!data.pro_expires_at ||
      new Date(data.pro_expires_at) > new Date())
  ) {
    return PRO_PLAN
  }

  return FREE_PLAN
}

/* =========================================================
   HELPERS
========================================================= */

/**
 * check if usage allowed
 */
export function canUse(
  current: number,
  limit: number
) {
  return current < limit
}

/**
 * remaining quota
 */
export function remaining(
  current: number,
  limit: number
) {
  return Math.max(limit - current, 0)
}

/**
 * usage percentage
 */
export function percent(
  current: number,
  limit: number
) {
  if (!limit) return 0
  return Math.min((current / limit) * 100, 100)
}
