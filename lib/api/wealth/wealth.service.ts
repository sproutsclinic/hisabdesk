ï»¿// ==========================================================
// Wealth Service (PFOS Adapter)
// PURPOSE
//   Provide derived wealth projections for Insights layer
//   This is NOT heavy math ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â just orchestration bridge
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export function getWealthService() {
  const supabase = getSupabaseAdmin()

  // --------------------------------------------------------
  // CURRENT SNAPSHOT (lightweight aggregation)
  // --------------------------------------------------------
  async function getSnapshot(userId: string) {
    const { data: assets } = await supabase
      .from("portfolio")
      .select("value")
      .eq("user_id", userId)

    const { data: loans } = await supabase
      .from("loans")
      .select("balance")
      .eq("user_id", userId)

    const totalAssets =
      (assets ?? []).reduce((s, r) => s + Number(r.value || 0), 0)

    const totalLiabilities =
      (loans ?? []).reduce((s, r) => s + Number(r.balance || 0), 0)

    return {
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
    }
  }

  // --------------------------------------------------------
  // PROJECTION FROM PORTFOLIO (used by Insights)
  // --------------------------------------------------------
  async function projectFromPortfolio(params: {
    userId: string
    currentValue: number
  }) {
    // simple placeholder projection (Phase-H safe)
    const growthRate = 0.10

    const projected5y =
      params.currentValue * Math.pow(1 + growthRate, 5)

    const projected10y =
      params.currentValue * Math.pow(1 + growthRate, 10)

    return {
      projected5y: Math.round(projected5y),
      projected10y: Math.round(projected10y),
      assumedReturn: growthRate,
    }
  }

  // --------------------------------------------------------
  // RETIREMENT ESTIMATE (light ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â no planning engine here)
  // --------------------------------------------------------
  async function estimateRetirement(userId: string) {
    const snapshot = await getSnapshot(userId)

    const safeWithdrawal = snapshot.netWorth * 0.04

    return {
      currentNetWorth: snapshot.netWorth,
      estimatedMonthlyIncome: Math.round(safeWithdrawal / 12),
    }
  }

  return {
    getSnapshot,
    projectFromPortfolio,
    estimateRetirement,
  }
}
