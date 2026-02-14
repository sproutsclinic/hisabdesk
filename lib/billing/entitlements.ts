"use server"

/**
 * =========================================================
 * Entitlements Engine (Feature Access Control)
 * HisabDesk – Final Billing Layer
 * =========================================================
 *
 * PURPOSE
 * Central source of truth for:
 *   ✓ which features are enabled per plan
 *   ✓ feature flags
 *   ✓ future add-ons
 *
 * DIFFERENT FROM
 * ---------------------------------------------------------
 * plan-limits      → numeric limits (counts)
 * entitlements     → feature access (true/false)
 *
 * Examples:
 *   GST Sync
 *   CA Dashboard
 *   Team Members
 *   Exports
 *   AI tools
 *
 * NEVER scatter:
 *   if (isPro) checks everywhere
 *
 * ALWAYS:
 *   canAccess(userId, "gst_sync")
 *
 * =========================================================
 *
 * USAGE
 *
 * if (!(await canAccess(userId, "gst_sync"))) {
 *   throw new Error("Upgrade required")
 * }
 *
 * =========================================================
 *
 * SAFE
 * - server only
 * - read only
 * =========================================================
 */

import { createClient } from "@supabase/supabase-js"

/* =========================================================
   TYPES
========================================================= */

export type Feature =
  | "gst_sync"
  | "ca_dashboard"
  | "team_members"
  | "exports"
  | "ai_categorization"
  | "advanced_reports"
  | "priority_support"

export type EntitlementMap = Record<Feature, boolean>

/* =========================================================
   PLAN ENTITLEMENTS
   (EDIT HERE ONLY)
========================================================= */

const FREE_ENTITLEMENTS: EntitlementMap = {
  gst_sync: false,
  ca_dashboard: false,
  team_members: false,
  exports: false,
  ai_categorization: false,
  advanced_reports: false,
  priority_support: false,
}

const PRO_ENTITLEMENTS: EntitlementMap = {
  gst_sync: true,
  ca_dashboard: true,
  team_members: true,
  exports: true,
  ai_categorization: true,
  advanced_reports: true,
  priority_support: true,
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
   GET ENTITLEMENTS
========================================================= */

export async function getEntitlements(
  userId: string
): Promise<EntitlementMap> {
  const supabase = getClient()

  const { data } = await supabase
    .from("profiles")
    .select("is_pro, pro_expires_at")
    .eq("id", userId)
    .single()

  if (!data) return FREE_ENTITLEMENTS

  const activePro =
    data.is_pro &&
    (!data.pro_expires_at ||
      new Date(data.pro_expires_at) > new Date())

  return activePro
    ? PRO_ENTITLEMENTS
    : FREE_ENTITLEMENTS
}

/* =========================================================
   CHECK HELPERS
========================================================= */

export async function canAccess(
  userId: string,
  feature: Feature
) {
  const map = await getEntitlements(userId)
  return !!map[feature]
}

export async function requireAccess(
  userId: string,
  feature: Feature
) {
  const ok = await canAccess(userId, feature)

  if (!ok) {
    throw new Error("Upgrade required")
  }
}
