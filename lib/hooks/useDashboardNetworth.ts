"use client"

// ==========================================================
// HisabDesk — useDashboardNetworth
// ----------------------------------------------------------
// PURPOSE
//   Client hook for net worth snapshot
//
//   Centralizes:
//     ✓ fetch logic
//     ✓ loading state
//     ✓ refresh control
//
//   Prevents:
//     ❌ duplicate fetch logic in NetWorthCard
//
//   Uses:
//     GET /api/dashboard/networth
//
//   RULE:
//     server calculates
//     hook only fetches
//
//   Usage:
//
//     const { data, loading, refresh } = useDashboardNetworth()
//
// ==========================================================

import { useCallback, useEffect, useState } from "react"

// ==========================================================
// TYPES
// ==========================================================

export interface NetworthSnapshot {
  assets: number
  liabilities: number
  networth: number
}

// ==========================================================
// HOOK
// ==========================================================

export function useDashboardNetworth() {
  const [data, setData] = useState<NetworthSnapshot>({
    assets: 0,
    liabilities: 0,
    networth: 0,
  })

  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------
  // FETCH
  // --------------------------------------------------------

  const fetchNetworth = useCallback(async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/dashboard/networth", {
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
    fetchNetworth()
  }, [fetchNetworth])

  // --------------------------------------------------------
  // RETURN
  // --------------------------------------------------------

  return {
    data,
    loading,
    refresh: fetchNetworth,
  }
}
