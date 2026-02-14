"use client"

// ==========================================================
// HisabDesk — Reports Page (Polished with Charts + Currency)
// Location: app/personal/dashboard/reports/page.tsx
// ==========================================================

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { useReports } from "@/hooks/useReports"
import { reportsClient } from "@/lib/api/reports/reports.client"

import AreaTrendChart from "@/components/charts/AreaTrendChart"

// ✅ NEW — centralized formatter (additive only)
import { formatCurrency } from "@/lib/utils/formatCurrency"

/* =========================================================
Page
========================================================= */

export default function ReportsPage() {
  const { data, loading, error, setQuery } = useReports({
    range: "30d",
  })

  async function handleExport() {
    try {
      const blob = await reportsClient.exportCSV()

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "hisabdesk-report.csv"
      a.click()

      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
    }
  }

  const kpis = useMemo(() => data?.kpis, [data])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports</h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setQuery({ range: "7d" })}>
            7D
          </Button>
          <Button variant="outline" onClick={() => setQuery({ range: "30d" })}>
            30D
          </Button>
          <Button variant="outline" onClick={() => setQuery({ range: "90d" })}>
            90D
          </Button>
          <Button onClick={handleExport}>Export CSV</Button>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="text-sm text-muted-foreground">Loading reports...</div>
      )}

      {error && (
        <div className="text-sm text-red-500">Failed: {error}</div>
      )}

      {/* Content */}
      {data && (
        <>
          {/* ================= KPIs ================= */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <KpiCard label="Income" value={kpis?.income} />
            <KpiCard label="Expense" value={kpis?.expense} />
            <KpiCard label="Savings" value={kpis?.savings} />
            <KpiCard label="Savings Rate" value={`${kpis?.savingsRate}%`} />
            <KpiCard label="Net Cashflow" value={kpis?.netCashflow} />
          </div>

          {/* ================= Trend Chart ================= */}
          {data.monthlySeries?.length > 0 && (
            <AreaTrendChart
              title="Monthly Cashflow Trend"
              data={data.monthlySeries}
            />
          )}

          {/* ================= Breakdown ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BreakdownCard
              title="Expense by Category"
              rows={data.expenseByCategory}
            />

            <BreakdownCard
              title="Income by Category"
              rows={data.incomeByCategory}
            />
          </div>

          {/* ================= Monthly Table ================= */}
          <Card className="p-4 rounded-2xl">
            <h3 className="text-lg font-medium mb-4">Monthly Summary</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="text-left py-2">Month</th>
                    <th className="text-right">Income</th>
                    <th className="text-right">Expense</th>
                    <th className="text-right">Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {data.monthlySeries.map((m) => (
                    <tr key={m.month} className="border-t">
                      <td className="py-2">{m.month}</td>
                      <td className="text-right">{formatCurrency(m.income)}</td>
                      <td className="text-right">{formatCurrency(m.expense)}</td>
                      <td className="text-right">{formatCurrency(m.savings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

/* =========================================================
UI Components
========================================================= */

function KpiCard({
  label,
  value,
}: {
  label: string
  value?: string | number
}) {
  const display =
    typeof value === "number" ? formatCurrency(value) : value

  return (
    <Card className="p-4 rounded-2xl">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold mt-1">{display ?? "-"}</div>
    </Card>
  )
}

function BreakdownCard({
  title,
  rows,
}: {
  title: string
  rows: { category: string; amount: number; percent: number }[]
}) {
  return (
    <Card className="p-4 rounded-2xl">
      <h3 className="text-lg font-medium mb-4">{title}</h3>

      <div className="space-y-2 text-sm">
        {rows.map((r) => (
          <div key={r.category} className="flex justify-between">
            <span>{r.category}</span>
            <span>
              {formatCurrency(r.amount)} ({r.percent}%)
            </span>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="text-muted-foreground">No data</div>
        )}
      </div>
    </Card>
  )
}
