/**
 * =========================================================
 * White-Label Branding Service
 * HisabDesk – Phase C (Scale)
 * =========================================================
 *
 * PURE SERVER UTILITY (NOT A SERVER ACTION FILE)
 * ⚠ DO NOT add "use server" or "use client"
 * =========================================================
 */

import { createClient } from "@supabase/supabase-js"

/* =========================================================
   ADMIN CLIENT (server only)
========================================================= */

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
    }
  )
}

/* =========================================================
   TYPES
========================================================= */

export type OrgBranding = {
  org_id: string
  company_name?: string | null
  logo_url?: string | null
  primary_color?: string | null
  accent_color?: string | null
  support_email?: string | null
  custom_domain?: string | null
}

/* =========================================================
   GET BRANDING
========================================================= */

export async function getBranding(
  orgId: string
): Promise<OrgBranding | null> {
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from("org_branding")
    .select("*")
    .eq("org_id", orgId)
    .maybeSingle()

  if (error) {
    console.error("Branding fetch failed:", error)
    return null
  }

  return data
}

/* =========================================================
   SAVE / UPSERT
========================================================= */

export async function saveBranding(input: OrgBranding) {
  const supabase = getAdminClient()

  const { error } = await supabase
    .from("org_branding")
    .upsert(input)

  if (error) throw error
}

/* =========================================================
   DELETE BRANDING
========================================================= */

export async function removeBranding(orgId: string) {
  const supabase = getAdminClient()

  const { error } = await supabase
    .from("org_branding")
    .delete()
    .eq("org_id", orgId)

  if (error) throw error
}

/* =========================================================
   THEME CSS VARIABLES (client safe)
========================================================= */

export function buildThemeVars(
  branding?: OrgBranding | null
): Record<string, string> {
  return {
    "--brand-primary": branding?.primary_color ?? "#000000",
    "--brand-accent": branding?.accent_color ?? "#2563eb",
  }
}

/* =========================================================
   DISPLAY NAME
========================================================= */

export function getDisplayName(
  branding?: OrgBranding | null
): string {
  return branding?.company_name ?? "HisabDesk"
}
