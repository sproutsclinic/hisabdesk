ï»¿/**
 * =========================================================
 * Backup & Restore Service (Enterprise Safety Layer)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Disaster Recovery Engine
 * =========================================================
 *
 * PURE SERVER UTILITY (NOT A SERVER ACTION)
 * ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  DO NOT add "use server" or "use client"
 * Must stay directive-free for Next 16 compatibility
 * =========================================================
 */

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

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
   TYPES
========================================================= */

export type WorkspaceBackup = {
  version: number
  exported_at: string
  org_id: string
  data: Record<string, any[]>
}

/* =========================================================
   TABLES INCLUDED
========================================================= */

const TABLES = [
  "organizations",
  "organization_members",
  "income",
  "expenses",
  "org_documents",
  "activity_logs",
]

/* =========================================================
   EXPORT
========================================================= */

export async function exportWorkspace(
  orgId: string
): Promise<WorkspaceBackup> {
  const supabase = getClient()

  const dump: Record<string, any[]> = {}

  for (const table of TABLES) {
    const { data } = await supabase
      .from(table)
      .select("*")
      .eq("org_id", orgId)

    dump[table] = data || []
  }

  return {
    version: 1,
    exported_at: new Date().toISOString(),
    org_id: orgId,
    data: dump,
  }
}

/* =========================================================
   RESTORE
   (DANGEROUS ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ use admin only)
========================================================= */

export async function restoreWorkspace(
  orgId: string,
  backup: WorkspaceBackup
) {
  const supabase = getClient()

  if (backup.org_id !== orgId) {
    throw new Error("Org mismatch")
  }

  for (const table of TABLES) {
    const rows = backup.data[table] || []

    if (!rows.length) continue

    await supabase.from(table).delete().eq("org_id", orgId)
    await supabase.from(table).insert(rows)
  }

  return true
}

/* =========================================================
   DOWNLOAD HELPER
   (for API usage)
========================================================= */

export function backupToJSON(
  backup: WorkspaceBackup
) {
  return JSON.stringify(backup, null, 2)
}
