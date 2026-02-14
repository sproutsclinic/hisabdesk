"use client"

// ==========================================================
// HisabDesk — useDashboardContext
// ----------------------------------------------------------
// PURPOSE
//   Builds a unified financial context for AI usage
//
//   Combines:
//     ✓ snapshot
//     ✓ burn rate
//     ✓ alerts
//     ✓ categories
//
//   Output:
//     single compact string ready for AI prompt injection
//
//   Why this exists:
//     ✓ AI always gets consistent context
//     ✓ avoids rebuilding logic per page
//     ✓ token efficient
//     ✓ reusable across ALL dashboard AI calls
//
//   Uses:
//     useDashboardSnapshot
//     useDashboardBurnRate
//     useDashboardAlerts
//     useDashboardCategories
//
//   RULE:
//     NO AI calls here
//     only data aggregation
//
//   Usage:
//
//     const { context, loading } = useDashboardContext()
//
// ==========================================================

import { useMemo } from "react"

import { buildDashboardContext } from "@/lib/modules/personal/dashboardContextBuilder"

import { useDashboardSnapshot } from "./useDashboardSnapshot"
import { useDashboardBurnRate } from "./useDashboardBurnRate"
import { useDashboardAlerts } from "./useDashboardAlerts"
import { useDashboardCategories } from "./useDashboardCategories"

// ==========================================================
// HOOK
// ==========================================================

export function useDashboardContext() {
  const snapshot = useDashboardSnapshot()
  const burn = useDashboardBurnRate()
  const alerts = useDashboardAlerts()
  const categories = useDashboardCategories()

  // --------------------------------------------------------
  // LOADING
  // --------------------------------------------------------

  const loading =
    snapshot.loading ||
    burn.loading ||
    alerts.loading ||
    categories.loading

  // --------------------------------------------------------
  // BUILD CONTEXT STRING
  // --------------------------------------------------------

  const context = useMemo(() => {
    if (loading) return ""

    const topCategory =
      categories.categories?.[0]?.category

    return buildDashboardContext({
      income: snapshot.data.income,
      expense: snapshot.data.expense,
      networth: snapshot.data.networth,
      savingsRate: snapshot.data.savingsRate,
      burnRate: burn.data.burnRate,
      runwayMonths: burn.data.runwayMonths,
      alertsCount: alerts.alerts.length,
      topCategory,
    })
  }, [
    loading,
    snapshot.data,
    burn.data,
    alerts.alerts,
    categories.categories,
  ])

  // --------------------------------------------------------
  // RETURN
  // --------------------------------------------------------

  return {
    context,
    loading,
  }
}
