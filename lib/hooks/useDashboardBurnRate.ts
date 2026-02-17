ï»¿"use client"

// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â useDashboardBurnRate
// ----------------------------------------------------------
// PURPOSE
//   Client hook for monthly burn metrics
//
//   Centralizes:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ fetch logic
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ loading state
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ refresh control
//
//   Prevents:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ duplicate fetch logic in BurnRateCard
//
//   Uses:
//     GET /api/dashboard/burn-rate
//
//   RULE:
//     server calculates
//     hook only fetches
//
//   Usage:
//
//     const { data, loading, refresh } = useDashboardBurnRate()
//
// ==========================================================

import { useCallback, useEffect, useState } from "react"

// ==========================================================
// TYPES
// ==========================================================

export interface BurnRateSnapshot {
  monthlyIncome: number
  monthlyExpense: number
  burnRate: number
  runwayMonths: number
}

// ==========================================================
// HOOK
// ==========================================================

export function useDashboardBurnRate() {
  const [data, setData] = useState<BurnRateSnapshot>({
    monthlyIncome: 0,
    monthlyExpense: 0,
    burnRate: 0,
    runwayMonths: 0,
  })

  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------
  // FETCH
  // --------------------------------------------------------

  const fetchBurnRate = useCallback(async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/dashboard/burn-rate", {
        cache: "no-store",
      })

      const json = await res.json()

      setData(json)
    } finally {
      setLoading(false)
    }
  }, [])

  // --------------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------------

  useEffect(() => {
    fetchBurnRate()
  }, [fetchBurnRate])

  // --------------------------------------------------------
  // RETURN
  // --------------------------------------------------------

  return {
    data,
    loading,
    refresh: fetchBurnRate,
  }
}
