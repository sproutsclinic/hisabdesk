ï»¿"use client"

import { useMemo, useState } from "react"
import { useReports } from "@/hooks/useReports"

import KPIDashboard from "@/components/reporting/kpi-dashboard"
import TaxSummaryCard from "@/components/reporting/tax-summary-card"
import AdvancedFilters, { ReportFilters } from "@/components/reporting/advanced-filters"
import ReportExport from "@/components/reporting/report-export"
import TransactionsTable from "@/components/reporting/transactions-table"

/**
 * PERSONAL MODE ADAPTER
 * --------------------------------------------------
 * ReportsHub reuses enterprise UI components.
 * Some of them require orgId even in personal mode.
 *
 * We pass a stable pseudo-orgId so typing + contracts remain intact.
 * This DOES NOT create multi-tenant behaviour.
 */
const PERSONAL_ORG_ID = "personal"

export default function ReportsHub() {
  const { data, loading, error } = useReports({ range: "30d" })

  const [filters, setFilters] = useState<ReportFilters>({
    type: "all",
  })

  const profit = useMemo(() => {
    if (!data) return 0
    return data.kpis.netCashflow ?? 0
  }, [data])

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading reportsÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦</div>
  }

  if (error || !data) {
    return <div className="text-sm text-red-500">Failed to load reports</div>
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports & Insights</h1>
        <ReportExport />
      </div>

      {/* KPI + TAX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <KPIDashboard
            data={{
              totals: {
                income: data.kpis.income,
                expense: data.kpis.expense,
                profit: data.kpis.netCashflow,
                count: 0, // not applicable in personal mode
              },
              points: [], // no comparison series in personal mode
            }}
          />
        </div>

        <TaxSummaryCard profit={profit} />
      </div>

      {/* FILTERS */}
      <AdvancedFilters value={filters} onChange={setFilters} />

      {/* TRANSACTIONS TABLE (enterprise component reused safely) */}
      <TransactionsTable orgId={PERSONAL_ORG_ID} filters={filters} />
    </div>
  )
}
