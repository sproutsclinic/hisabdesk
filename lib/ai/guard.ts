ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AI Guard (Server Utility)
// ----------------------------------------------------------
// PURPOSE
//   Central protection layer for ALL AI routes
//
//   Handles:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ monthly cost limit check
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ safe execution wrapper
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ consistent errors
//
//   Usage (MANDATORY in every AI route):
//
//     await guardAI(user.id)
//     const result = await runAI(...)
//
//   This prevents:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ exceeding $5/month
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ duplicate limit logic in routes
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ scattered checks
//
// RULE:
//   All /api/ai/* routes MUST call guardAI() first
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

// ==========================================================
// CONFIG
// ==========================================================

const MONTHLY_DOLLAR_LIMIT = 5
const COST_PER_1K = 0.002 // blended estimate

const supabase = getSupabaseAdmin()

// ==========================================================
// INTERNAL
// ==========================================================

async function getMonthlyCost(userId: string) {
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString()

  const { data } = await supabase
    .from("ai_logs")
    .select("tokens")
    .eq("user_id", userId)
    .gte("created_at", startOfMonth)

  const totalTokens =
    (data || []).reduce(
      (s, r) => s + (r.tokens || 0),
      0
    )

  return (totalTokens / 1000) * COST_PER_1K
}

// ==========================================================
// PUBLIC GUARD
// ==========================================================

export async function guardAI(userId: string) {
  const used = await getMonthlyCost(userId)

  if (used >= MONTHLY_DOLLAR_LIMIT) {
    throw new Error(
      "Monthly AI limit reached. Upgrade or try next month."
    )
  }

  return {
    used,
    remaining: Math.max(0, MONTHLY_DOLLAR_LIMIT - used),
    limit: MONTHLY_DOLLAR_LIMIT,
  }
}
