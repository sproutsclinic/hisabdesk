"use client"

// ==========================================================
// HisabDesk — useDashboardAlerts
// ----------------------------------------------------------
// PURPOSE
//   Client hook for rule-based financial alerts
//
//   Centralizes:
//     ✓ fetch logic
//     ✓ loading state
//     ✓ refresh control
//
//   Prevents:
//     ❌ duplicate fetch code inside multiple cards
//
//   Uses:
//     GET /api/dashboard/alerts
//
//   RULE:
//     no business logic here
//     server computes everything
//
//   Usage:
//
//     const { alerts, loading, refresh } = useDashboardAlerts()
//
// ==========================================================

import { useCallback, useEffect, useState } from "react"

// ==========================================================
// TYPES
// ==========================================================

export type AlertType = "info" | "warning" | "danger"

export interface DashboardAlert {
  type: AlertType
  message: string
}

// ==========================================================
// HOOK
// ==========================================================

export function useDashboardAlerts() {
  const [alerts, setAlerts] = useState<DashboardAlert[]>([])
  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------
  // FETCH
  // --------------------------------------------------------

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/dashboard/alerts", {
        cache: "no-store",
      })

      const json = await res.json()

      setAlerts(json || [])
    } finally {
      setLoading(false)
    }
  }, [])

  // --------------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------------

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  // --------------------------------------------------------
  // RETURN
  // --------------------------------------------------------

  return {
    alerts,
    loading,
    refresh: fetchAlerts,
  }
}
