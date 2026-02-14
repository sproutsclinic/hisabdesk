"use client"

/**
 * =========================================================
 * GST CHARTS (Visual Analytics)
 * Phase D — Day 25
 *
 * PURPOSE
 * Visual GST insights for dashboard
 *
 * Shows:
 * ✓ Sales vs Purchase (bar)
 * ✓ Output vs Input tax (bar)
 * ✓ Net payable trend (line)
 *
 * Tech:
 * ✓ recharts (already allowed in stack)
 * ✓ lightweight
 * ✓ responsive
 *
 * Usage:
 * <GSTCharts orgId={orgId} period={period} />
 *
 * SAFE:
 * read only
 * no schema changes
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

/* ====================================================== */

type Props = {
  orgId: string
  period: string // YYYY-MM
}

type Summary = {
  total_sales: number
  total_purchase: number
  output_tax: number
  input_tax: number
  net_payable: number
}

/* ====================================================== */

export default function GSTCharts({
  orgId,
  period,
}: Props) {
  const [summary, setSummary] = useState<Summary | null>(
    null
  )

  const [trend, setTrend] = useState<any[]>([])

  /* ======================================================
     LOAD
  ====================================================== */

  useEffect(() => {
    if (!orgId) return
    load()
  }, [orgId, period])

  async function load() {
    /* --------------------------------------------
       CURRENT PERIOD
    -------------------------------------------- */

    const { data } = await supabase
      .from("gst_summary")
      .select("*")
      .eq("org_id", orgId)
      .eq("period", period)
      .maybeSingle()

    setSummary(data || null)

    /* --------------------------------------------
       LAST 6 MONTH TREND
    -------------------------------------------- */

    const months = lastMonths(period, 6)

    const { data: rows } = await supabase
      .from("gst_summary")
      .select("*")
      .eq("org_id", orgId)
      .in("period", months)

    const mapped =
      rows?.map((r: any) => ({
        month: r.period.slice(5),
        payable: r.net_payable || 0,
      })) || []

    setTrend(mapped.sort((a, b) => a.month.localeCompare(b.month)))
  }

  /* ======================================================
     DATASETS
  ====================================================== */

  const salesPurchase = summary
    ? [
        {
          name: "Sales",
          value: summary.total_sales,
        },
        {
          name: "Purchase",
          value: summary.total_purchase,
        },
      ]
    : []

  const taxData = summary
    ? [
        {
          name: "Output",
          value: summary.output_tax,
        },
        {
          name: "Input",
          value: summary.input_tax,
        },
      ]
    : []

  /* ======================================================
     UI
  ====================================================== */

  if (!summary) return null

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* SALES vs PURCHASE */}
      <ChartCard title="Sales vs Purchase">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={salesPurchase}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* TAX */}
      <ChartCard title="Output vs Input Tax">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={taxData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* TREND */}
      <ChartCard title="Net Payable Trend">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="payable" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

/* ====================================================== */

function ChartCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-sm font-medium mb-3">{title}</p>
      {children}
    </div>
  )
}

/* ====================================================== */

function lastMonths(current: string, count: number) {
  const result: string[] = []

  const [y, m] = current.split("-").map(Number)

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(y, m - 1 - i, 1)
    result.push(
      `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`
    )
  }

  return result
}
