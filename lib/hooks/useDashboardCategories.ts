"use client"

// ==========================================================
// HisabDesk — useDashboardCategories
// ----------------------------------------------------------
// PURPOSE
//   Client hook for expense category breakdown
//
//   Centralizes:
//     ✓ fetch logic
//     ✓ loading state
//     ✓ refresh control
//
//   Prevents:
//     ❌ duplicate fetch logic inside CategoriesCard
//
//   Uses:
//     GET /api/dashboard/categories
//
//   RULE:
//     server handles aggregation
//     hook only fetches
//
//   Usage:
//
//     const { categories, loading, refresh } = useDashboardCategories()
//
// ==========================================================

import { useCallback, useEffect, useState } from "react"

// ==========================================================
// TYPES
// ==========================================================

export interface CategoryRow {
  category: string
  amount: number
}

// ==========================================================
// HOOK
// ==========================================================

export function useDashboardCategories() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------
  // FETCH
  // --------------------------------------------------------

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/dashboard/categories", {
        cache: "no-store",
      })

      const json = await res.json()

      setCategories(json || [])
    } finally {
      setLoading(false)
    }
  }, [])

  // --------------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------------

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // --------------------------------------------------------
  // RETURN
  // --------------------------------------------------------

  return {
    categories,
    loading,
    refresh: fetchCategories,
  }
}
