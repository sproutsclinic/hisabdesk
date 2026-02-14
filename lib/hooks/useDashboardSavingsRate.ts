"use client"

// ==========================================================
// HisabDesk — useDashboardSavingsRate
// ----------------------------------------------------------
// PURPOSE
//   Client hook for savings metrics
//
//   Centralizes:
//     ✓ fetch logic
//     ✓ loading state
//     ✓ refresh control
//
//   Prevents:
//     ❌ duplicate fetch logic inside SavingsRateCard
//
//   Uses:
//     GET /api/dashboard/savings-rate
//
//   RULE:
//     server calculates
//     hook only fetches
//
//   Usage:
//
//     const { data, loading, refresh } = useDashboardSavingsRate()
//
// ==========================================================

import { useCallback, useEffect, useState } from "react"

// ==========================================================
// TYPES
// ==========================================================

export interface SavingsRateSnapshot {
  income: number
  expense: number
  savings: number
  savingsRate: number
}

// ==========================================================
// HOOK
// ==========================================================

export function useDashboardSavingsRate() {
  const [data, setData] = useState<SavingsRateSnapshot>({
    income: 0,
    expense: 0,
    savings: 0,
    savingsRate: 0,
  })

  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------
  // FETCH
  // --------------------------------------------------------

  const fetchSavingsRate = useCallback(async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/dashboard/savings-rate", {
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
    fetchSavingsRate()
  }, [fetchSavingsRate])

  // --------------------------------------------------------
  // RETURN
  // --------------------------------------------------------

  return {
    data,
    loading,
    refresh: fetchSavingsRate,
  }
}
