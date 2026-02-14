"use client"

// ==========================================================
// HisabDesk — useAIUsage Hook
// ----------------------------------------------------------
// PURPOSE
//   Reusable hook to fetch AI usage report anywhere
//
//   Used by:
//     ✓ Profile page
//     ✓ Header badge
//     ✓ Admin panels
//     ✓ Future alerts
//
//   Prevents:
//     ❌ repeating fetch logic
//     ❌ duplicated types
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
