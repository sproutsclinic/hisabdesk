ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AI Context Cache (Personal Memory Layer)
// ----------------------------------------------------------
// PURPOSE
//   Lightweight storage for latest financial context per user
//
//   Why:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ reduces tokens (reuse context)
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ faster AI calls
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ keeps prompts small
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ enables personalization
//
//   Used by:
//     - page assistant
//     - dashboard summary
//     - insights
//
//   Pattern:
//     await saveContext(userId, context)
//     const ctx = await getLatestContext(userId)
//
//   RULE:
//     Only store SMALL summaries (never raw data)
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

// ==========================================================
// TYPES
// ==========================================================

export interface CachedContext {
  summary: string
  numbers?: Record<string, number | string>
}

// ==========================================================
// CLIENT
// ==========================================================

const supabase = getSupabaseAdmin()

// ==========================================================
// SAVE CONTEXT
// ==========================================================

export async function saveContext(
  userId: string,
  context: CachedContext
) {
  try {
    await supabase.from("ai_context").insert({
      user_id: userId,
      summary: context.summary,
      numbers: context.numbers || {},
      created_at: new Date().toISOString(),
    })
  } catch {
    // never block main flow
  }
}

// ==========================================================
// GET LATEST CONTEXT
// ==========================================================

export async function getLatestContext(
  userId: string
): Promise<CachedContext | null> {
  try {
    const { data } = await supabase
      .from("ai_context")
      .select("summary, numbers")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!data) return null

    return {
      summary: data.summary,
      numbers: data.numbers || {},
    }
  } catch {
    return null
  }
}
