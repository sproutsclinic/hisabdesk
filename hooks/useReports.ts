"use client"

import { useCallback, useEffect, useState } from "react"

// ==========================================================
// useReports Hook
// Thin client → server authority
// ONLY fetches from /api/reports
// NO business logic
// NO calculations
// NO Supabase
// ==========================================================

/* =========================================================
Types
========================================================= */

export type ReportRange = "7d" | "30d" | "90d" | "6m" | "1y" | "all"

export interface ReportsQuery {
  range?: ReportRange
  from?: string // ISO
  to?: string   // ISO
}

export interface KPIBlock {
  income: number
  expense: number
  savings: number
  savingsRate: number
  netCashflow: number
}

export interface CategoryBreakdown {
  category: string
  amount: number
  percent: number
}

export interface MonthlySeriesPoint {
  month: string // 2025-01
  income: number
  expense: number
  savings: number
}

export interface ReportsResponse {
  kpis: KPIBlock
  expenseByCategory: CategoryBreakdown[]
  incomeByCategory: CategoryBreakdown[]
  monthlySeries: MonthlySeriesPoint[]
}

/* =========================================================
Hook
========================================================= */

export function useReports(initialQuery: ReportsQuery = { range: "30d" }) {
  const [data, setData] = useState<ReportsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState<ReportsQuery>(initialQuery)

  /* =======================================================
  Fetch
  ======================================================= */

  const fetchReports = useCallback(async (q: ReportsQuery) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (q.range) params.append("range", q.range)
      if (q.from) params.append("from", q.from)
      if (q.to) params.append("to", q.to)

      const res = await fetch(`/api/reports?${params.toString()}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Failed to fetch reports")
      }

      const json: ReportsResponse = await res.json()
      setData(json)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown reports error"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  /* =======================================================
  Effects
  ======================================================= */

  useEffect(() => {
    fetchReports(query)
  }, [query, fetchReports])

  /* =======================================================
  Public API (fetch only)
  ======================================================= */

  const refresh = useCallback(() => {
    fetchReports(query)
  }, [query, fetchReports])

  const updateQuery = useCallback((next: ReportsQuery) => {
    setQuery((prev) => ({ ...prev, ...next }))
  }, [])

  return {
    data,
    loading,
    error,

    // actions
    refresh,
    setQuery: updateQuery,
  }
}
