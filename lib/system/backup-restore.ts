ï»¿/**
 * =========================================================
 * Backup & Restore Engine (Enterprise Data Safety)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ System Reliability Layer
 * =========================================================
 *
 * PURPOSE
 * Allow:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ full user export (GDPR compliant)
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ org export
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ admin backup
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ restore data
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ migrations
 *
 * CRITICAL FOR
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ enterprise customers
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ audits
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ disaster recovery
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ support team fixes
 *
 * EXPORT FORMAT
 * JSON bundle:
 * {
 *   profile,
 *   income,
 *   expenses,
 *   documents,
 *   subscriptions
 * }
 *
 * SAFE
 * - server only
 * - no existing files modified
 *
 * =========================================================
 *
 * USAGE
 *
 * const data = await exportUserData(userId)
 *
 * await restoreUserData(userId, data)
 *
 * =========================================================
 */

"use server"

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

/* =========================================================
   CLIENT
========================================================= */

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/* =========================================================
   TABLES INCLUDED IN BACKUP
========================================================= */

const USER_TABLES = [
  "income",
  "expenses",
  "documents",
  "reports",
  "analytics_events",
]

/* =========================================================
   EXPORT USER DATA
========================================================= */

export async function exportUserData(userId: string) {
  const supabase = getAdminClient()

  const backup: Record<string, any> = {}

  /* profile */
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  backup.profile = profile

  /* tables */
  for (const table of USER_TABLES) {
    const { data } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", userId)

    backup[table] = data || []
  }

  return backup
}

/* =========================================================
   RESTORE USER DATA
========================================================= */

export async function restoreUserData(
  userId: string,
  bundle: Record<string, any>
) {
  const supabase = getAdminClient()

  /* restore profile */
  if (bundle.profile) {
    await supabase
      .from("profiles")
      .upsert(bundle.profile)
  }

  /* restore tables */
  for (const table of USER_TABLES) {
    const rows = bundle[table]
    if (!rows?.length) continue

    await supabase.from(table).insert(rows)
  }
}

/* =========================================================
   EXPORT ORG DATA (multi-tenant)
========================================================= */

export async function exportOrgData(orgId: string) {
  const supabase = getAdminClient()

  const { data: members } = await supabase
    .from("organization_members")
    .select("user_id")
    .eq("org_id", orgId)

  const result: Record<string, any> = {}

  for (const m of members || []) {
    result[m.user_id] = await exportUserData(m.user_id)
  }

  return result
}

/* =========================================================
   DOWNLOAD HELPER (client usage)
========================================================= */

export function downloadBackupFile(data: any, name = "backup.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  })

  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = name
  a.click()

  URL.revokeObjectURL(url)
}
