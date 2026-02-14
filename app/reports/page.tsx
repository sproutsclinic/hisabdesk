"use client"

/**
 * =========================================================
 * HisabDesk — Reports & Insights
 * ---------------------------------------------------------
 * UI ONLY PAGE
 *
 * Responsibilities:
 *   ✓ layout
 *   ✓ filters
 *   ✓ call hook
 *   ✓ render components
 *
 * STRICT
 * ❌ no Supabase
 * ❌ no auth
 * ❌ no DB
 * ❌ no business logic
 *
 * ARCH
 *   UI → useReports → /api/reports → service → DB
 * =========================================================
 */

import { useState } from "react"

import { useReports } from "@/hooks/useReports"

import KPIDashboard from "@/components/reporting/kpi-dashboard"
import ReportExport from "@/components/reporting/report-export"
import AdvancedFilters, {
  ReportFilters,
} from "@/components/reporting/advanced-filters"

/* =========================================================
   PAGE
   ========================================================= */

export default function ReportsPage() {
  const { data, loading, error } = useReports()

  const [filters, setFilters] =
    useState<ReportFilters>({
      type: "all",
    })

  /* ======================================================
     STATES
  ====================================================== */

  if (loading) {
    return (
      <div className="p-10 text-sm text-muted-foreground">
        Loading reports...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-10 text-sm text-red-500">
        {error}
      </div>
    )
  }

  if (!data) return null

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Reports & Insights
          </h1>

          <p className="text-sm text-muted-foreground">
            Financial analytics, trends and exports
          </p>
        </div>

        <ReportExport />
      </div>

      {/* FILTERS */}
      <AdvancedFilters
        value={filters}
        onChange={setFilters}
      />

      {/* KPI DASHBOARD */}
      <KPIDashboard data={data} filters={filters} />
    </div>
  )
}
