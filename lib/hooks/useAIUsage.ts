ï»¿"use client"

// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â useAIUsage Hook
// ----------------------------------------------------------
// PURPOSE
//   Reusable hook to fetch AI usage report anywhere
//
//   Used by:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Profile page
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Header badge
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Admin panels
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Future alerts
//
//   Prevents:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ repeating fetch logic
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ duplicated types
//
//   Usage:
//
//     const { data, loading, refresh } = useAIUsage()
//
// ==========================================================

import { useEffect, useState, useCallback } from "react"

// ==========================================================
// TYPES
// ==========================================================

export interface AIModuleUsage {
  module: string
  tokens: number
  cost: number
  percent: number
}

export interface AIUsageReport {
  summary: {
    totalTokens: number
    totalCost: number
    remainingBudget: number
    projectedMonthlyCost: number
    status: "healthy" | "warning" | "limit"
  }
  modules: AIModuleUsage[]
}

// ==========================================================
// HOOK
// ==========================================================

export function useAIUsage() {
  const [data, setData] = useState<AIUsageReport | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // --------------------------------------------------------
  // FETCHER
  // --------------------------------------------------------

  const fetchUsage = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/ai/usage-report")

      if (!res.ok) {
        throw new Error("Failed to fetch AI usage")
      }

      const json = await res.json()

      setData(json)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // --------------------------------------------------------
  // AUTO LOAD
  // --------------------------------------------------------

  useEffect(() => {
    fetchUsage()
  }, [fetchUsage])

  // --------------------------------------------------------
  // RETURN
  // --------------------------------------------------------

  return {
    data,
    loading,
    error,
    refresh: fetchUsage,
  }
}
