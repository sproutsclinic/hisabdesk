"use client"

// ==========================================================
// HisabDesk — useDashboardTrend
// ----------------------------------------------------------
// PURPOSE
//   Client hook for monthly income/expense trend
//
//   Centralizes:
//     ✓ fetch logic
//     ✓ loading state
//     ✓ refresh control
//
//   Prevents:
//     ❌ duplicate fetch code in TrendCard
//
//   Uses:
//     GET /api/dashboard/trend
//
//   RULE:
//     no calculations here
//     server aggregates
//
//   Usage:
//
//     const { rows, loading, refresh } = useDashboardTrend()
//
// ==========================================================

import { useCallback, useEffect, useState } from "react"

// ==========================================================
// TYPES
// ==========================================================

export interface TrendRow {
  month: string
  income: number
  expense: number
}

// ==========================================================
// HOOK
// ==========================================================

export function useDashboardTrend() {
  const [rows, setRows] = useState<TrendRow[]>([])
  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------
  // FETCH
  // --------------------------------------------------------

  const fetchTrend = useCallback(async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/dashboard/trend", {
        cache: "no-store",
      })

      const json = await res.json()

      setRows(json || [])
    } finally {
      setLoading(false)
    }
  }, [])

  // --------------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------------

  useEffect(() => {
    fetchTrend()
  }, [fetchTrend])

  // --------------------------------------------------------
  // RETURN
  // --------------------------------------------------------

  return {
    rows,
    loading,
    refresh: fetchTrend,
  }
}
