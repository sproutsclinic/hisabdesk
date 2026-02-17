ï»¿"use client"

import { useState } from "react"
import { useReports } from "@/hooks/useReports"

import KPIDashboard from "@/components/reporting/kpi-dashboard"
import ReportExport from "@/components/reporting/report-export"
import AdvancedFilters, {
  ReportFilters,
} from "@/components/reporting/advanced-filters"

export default function ReportsPage() {
  const { data, loading, error } = useReports()

  const [filters, setFilters] = useState<ReportFilters>({
    type: "all",
  })

  if (loading) {
    return <div className="p-10 text-sm">Loading reports...</div>
  }

  if (error) {
    return <div className="p-10 text-sm text-red-500">{error}</div>
  }

  if (!data) return null

  /* ======================================================
     UI ADAPTER (ReportsResponse ? KPIData)
     Pure mapping ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â NO calculations introduced
  ====================================================== */

  const kpiData = {
    points: data.monthlySeries.map((m) => ({
      date: m.month,
      income: m.income,
      expense: m.expense,
      profit: m.savings, // already computed by server
    })),
    totals: {
      income: data.kpis.income,
      expense: data.kpis.expense,
      profit: data.kpis.savings,
      count: data.monthlySeries.length,
    },
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reports & Insights</h1>
          <p className="text-sm text-muted-foreground">
            Financial analytics, trends and exports
          </p>
        </div>

        <ReportExport />
      </div>

      <AdvancedFilters value={filters} onChange={setFilters} />

      <KPIDashboard data={kpiData} />
    </div>
  )
}
