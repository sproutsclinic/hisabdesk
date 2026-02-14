"use client"

// ==========================================================
// HisabDesk — useDashboardBurnRate
// ----------------------------------------------------------
// PURPOSE
//   Client hook for monthly burn metrics
//
//   Centralizes:
//     ✓ fetch logic
//     ✓ loading state
//     ✓ refresh control
//
//   Prevents:
//     ❌ duplicate fetch logic in BurnRateCard
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
