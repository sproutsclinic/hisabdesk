ï»¿"use client"

// ==========================================================
// HisabDesk ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Reports Page (Stabilized)
// ==========================================================

import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { useReports } from "@/hooks/useReports"
import { reportsClient } from "@/lib/api/reports/reports.client"

import AreaTrendChart from "@/components/charts/AreaTrendChart"
import { formatCurrency } from "@/lib/utils/formatCurrency"

export default function ReportsPage() {
  const { data, loading, error, setQuery } = useReports({ range: "30d" })

  async function handleExport() {
    const blob = await reportsClient.exportCSV()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "hisabdesk-report.csv"
    a.click()

    window.URL.revokeObjectURL(url)
  }

  /* ======================================================
     VIEW MODEL (UI Adapter ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â NO calculations)
  ====================================================== */

  const kpis = data?.kpis ?? {
    income: 0,
    expense: 0,
    savings: 0,
    savingsRate: 0,
    netCashflow: 0,
  }

  const trendData =
    data?.monthlySeries.map((m) => ({
      label: m.month,
      value: m.savings,
    })) ?? []

  if (loading) return <div className="p-6 text-sm">Loading...</div>
  if (error) return <div className="p-6 text-sm text-red-500">{error}</div>
  if (!data) return null

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports</h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setQuery({ range: "7d" })}>7D</Button>
          <Button variant="outline" onClick={() => setQuery({ range: "30d" })}>30D</Button>
          <Button variant="outline" onClick={() => setQuery({ range: "90d" })}>90D</Button>
          <Button onClick={handleExport}>Export CSV</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KpiCard label="Income" value={kpis.income} />
        <KpiCard label="Expense" value={kpis.expense} />
        <KpiCard label="Savings" value={kpis.savings} />
        <KpiCard label="Savings Rate" value={`${kpis.savingsRate}%`} />
        <KpiCard label="Net Cashflow" value={kpis.netCashflow} />
      </div>

      {/* Trend Chart */}
      {trendData.length > 0 && (
        <AreaTrendChart title="Monthly Cashflow Trend" data={trendData} />
      )}

      {/* Monthly Table */}
      <Card className="p-4 rounded-2xl">
        <h3 className="text-lg font-medium mb-4">Monthly Summary</h3>

        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2">Month</th>
              <th className="text-right">Income</th>
              <th className="text-right">Expense</th>
              <th className="text-right">Savings</th>
            </tr>
          </thead>
          <tbody>
            {data.monthlySeries.map((m) => (
              <tr key={m.month}>
                <td className="py-2">{m.month}</td>
                <td className="text-right">{formatCurrency(m.income)}</td>
                <td className="text-right">{formatCurrency(m.expense)}</td>
                <td className="text-right">{formatCurrency(m.savings)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

/* ========================================================= */

function KpiCard({ label, value }: { label: string; value: string | number }) {
  const display = typeof value === "number" ? formatCurrency(value) : value

  return (
    <Card className="p-4 rounded-2xl">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold mt-1">{display}</div>
    </Card>
  )
}
