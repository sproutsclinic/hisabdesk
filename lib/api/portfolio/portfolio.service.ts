ï»¿// ==========================================================
// Portfolio Service (Stabilization Version)
// PURPOSE
//   Provide portfolio snapshot for Insights layer
//   No calculations ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â only structured data fetch
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export function getPortfolioService() {
  const supabase = getSupabaseAdmin()

  // ========================================================
  // RAW SNAPSHOT (used internally)
  // ========================================================

  async function getPortfolioSnapshot(userId: string) {
    const { data, error } = await supabase
      .from("portfolio")
      .select("id,name,value,category,created_at")
      .eq("user_id", userId)

    if (error) throw error

    const rows = data ?? []

    const totalValue = rows.reduce(
      (sum, r) => sum + Number(r.value || 0),
      0
    )

    return {
      totalValue,
      count: rows.length,
      holdings: rows,
    }
  }

  // ========================================================
  // INSIGHTS ADAPTER (this is what Insights expects)
  // ========================================================

  async function getPortfolioOverview(userId: string) {
    const snapshot = await getPortfolioSnapshot(userId)

    return {
      totalValue: snapshot.totalValue,
      totalHoldings: snapshot.count,
      breakdown: snapshot.holdings,
    }
  }

  // ========================================================
  // PUBLIC CONTRACT
  // ========================================================

  return {
    getPortfolioSnapshot,
    getPortfolioOverview, // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â THIS exposes it to Insights
  }
}
