"use client"

/**
 * =========================================================
 * Reports Hub (All-in-One Enterprise Reporting Screen)
 * HisabDesk – Phase G FINAL+
 * =========================================================
 *
 * PURPOSE
 * Single component that combines EVERYTHING:
 *
 *   ✓ KPI Dashboard
 *   ✓ Tax Summary
 *   ✓ Filters
 *   ✓ Export buttons
 *   ✓ Transactions ledger
 *
 * This becomes:
 *   "complete accountant workspace"
 *
 * WHY
 * ---------------------------------------------------------
 * Instead of manually placing:
 *   ❌ 5 separate components
 *
 * Use:
 *   ✓ <ReportsHub orgId={orgId} />
 *
 * Clean architecture.
 *
 * =========================================================
 *
 * CONNECTS TO
 *   KPIDashboard
 *   TaxSummaryCard
 *   AdvancedFilters
 *   ReportExport
 *   TransactionsTable
 *
 * SAFE
 * - wrapper only
 * - no logic duplication
 * - plug & play
 *
 * =========================================================
 *
 * USAGE (recommended)
 *
 * app/reports/page.tsx
 *
 * <ReportsHub orgId={orgId} />
 *
 * =========================================================
 */

import { useMemo, useState } from "react"

import KPIDashboard from "@/components/reporting/kpi-dashboard"
import TaxSummaryCard from "@/components/reporting/tax-summary-card"
import AdvancedFilters, {
  ReportFilters,
} from "@/components/reporting/advanced-filters"
import ReportExport from "@/components/reporting/report-export"
import TransactionsTable from "@/components/reporting/transactions-table"

/* =========================================================
   MAIN
========================================================= */

export default function ReportsHub({
  orgId,
}: {
  orgId: string
}) {
  const [filters, setFilters] =
    useState<ReportFilters>({
      type: "all",
    })

  const [profit, setProfit] = useState(0)

  /* ------------------------------------------------------
     Derive profit from filters later if needed
     For now summary based on ledger calculations
  ------------------------------------------------------ */

  const summaryProfit = useMemo(() => {
    return profit
  }, [profit])

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="space-y-8">
      {/* HEADER + EXPORT */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Reports & Insights
        </h1>

        <ReportExport orgId={orgId} />
      </div>

      {/* KPI + TAX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <KPIDashboard orgId={orgId} />
        </div>

        <TaxSummaryCard profit={summaryProfit} />
      </div>

      {/* FILTERS */}
      <AdvancedFilters
        value={filters}
        onChange={setFilters}
      />

      {/* TABLE */}
      <TransactionsTable
        orgId={orgId}
        filters={filters}
      />
    </div>
  )
}
