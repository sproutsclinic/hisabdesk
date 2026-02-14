"use client"

// ==========================================================
// HisabDesk — useDashboardSnapshot
// ----------------------------------------------------------
// PURPOSE
//   Lightweight client hook to fetch dashboard snapshot
//
//   Returns:
//     ✓ income
//     ✓ expense
//     ✓ networth
//     ✓ savingsRate
//
//   Why this exists:
//     ✓ shared logic across widgets
//     ✓ prevents duplicate fetch code
//     ✓ consistent caching
//     ✓ future realtime refresh
//
//   Uses:
//     GET /api/dashboard/snapshot
//
//   RULE:
//     NO business logic here
//     only fetching
//
//   Usage:
//
//     const { data, loading, refresh } = useDashboardSnapshot()
//
// ==========================================================

import { useEffect, useState, useCallback } from "react"

// ==========================================================
// TYPES
// ==========================================================

export interface DashboardSnapshot {
  income: number
  expense: number
  networth: number
  savingsRate: number
}

// ==========================================================
// HOOK
// ==========================================================

export function useDashboardSnapshot() {
  const [data, setData] = useState<DashboardSnapshot>({
    income: 0,
    expense: 0,
    networth: 0,
    savingsRate: 0,
  })

  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------
  // FETCH
  // --------------------------------------------------------

  const fetchSnapshot = useCallback(async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/dashboard/snapshot", {
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
    fetchSnapshot()
  }, [fetchSnapshot])

  // --------------------------------------------------------
  // RETURN
  // --------------------------------------------------------

  return {
    data,
    loading,
    refresh: fetchSnapshot,
  }
}
