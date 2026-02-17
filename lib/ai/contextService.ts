ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AI Context Service (Single Source of Truth)
// ----------------------------------------------------------
// PURPOSE
//   Central service for reading/writing AI context
//
//   Why:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ prevents routes/hooks directly touching DB
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ clean architecture boundary
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ reusable across:
//         - AI routes
//         - schedulers
//         - server jobs
//         - future analytics
//
//   RULE:
//     ALL server-side context DB access must go through this file
//     Never query ai_context directly elsewhere
//
//   Works with:
//     table: ai_context
//
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

// ==========================================================
// TYPES
// ==========================================================

export interface AIContextRow {
  user_id: string
  summary: string
  numbers?: Record<string, number | string>
  created_at: string
}

// ==========================================================
// CLIENT (server-side only)
// ==========================================================

const supabase = getSupabaseAdmin()

// ==========================================================
// SAVE CONTEXT
// ==========================================================

export async function saveAIContext(
  userId: string,
  summary: string,
  numbers?: Record<string, number | string>
) {
  if (!summary) return

  await supabase.from("ai_context").insert({
    user_id: userId,
    summary,
    numbers: numbers || {},
    created_at: new Date().toISOString(),
  })
}

// ==========================================================
// GET LATEST CONTEXT
// ==========================================================

export async function getLatestAIContext(
  userId: string
): Promise<AIContextRow | null> {
  const { data } = await supabase
    .from("ai_context")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  return data || null
}

// ==========================================================
// DELETE OLD CONTEXT (optional maintenance)
// ----------------------------------------------------------
// Keep only last N records to control DB size
// Useful for cron cleanup
// ==========================================================

export async function pruneOldContext(
  userId: string,
  keepLatest = 20
) {
  const { data } = await supabase
    .from("ai_context")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (!data || data.length <= keepLatest) return

  const cutoff = data[keepLatest]?.created_at

  if (!cutoff) return

  await supabase
    .from("ai_context")
    .delete()
    .eq("user_id", userId)
    .lt("created_at", cutoff)
}
