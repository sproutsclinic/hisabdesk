"use client"

/**
 * =========================================================
 * KPI Dashboard (Enterprise Reporting & Analytics)
 * HisabDesk – Phase G (Executive Insights)
 * =========================================================
 *
 * PURPOSE
 * Gives founder/CA instant business visibility:
 *
 *   ✓ revenue trend
 *   ✓ expense trend
 *   ✓ profit
 *   ✓ tax estimate
 *   ✓ transaction count
 *
 * Similar to:
 *   Stripe Dashboard
 *   QuickBooks Overview
 *   Zoho Books Insights
 *
 * =========================================================
 *
 * FEATURES
 *
 * ✓ KPI cards
 * ✓ line charts
 * ✓ cached queries
 * ✓ realtime refresh friendly
 * ✓ mobile responsive
 *
 * =========================================================
 *
 * CONNECTS TO
 *   lib/performance/query-cache.ts
 *   Supabase tables:
 *     income
 *     expenses
 *
 * =========================================================
 *
 * USAGE
 *
 * <KPIDashboard orgId={orgId} />
 *
 * Put on:
 *   /dashboard
 *   /admin
 *   /ca dashboard
 *
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { cachedQuery } from "@/lib/performance/query-cache"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

/* =========================================================
   TYPES
========================================================= */

type Point = {
  date: string
  income: number
  expense: number
  profit: number
}

/* =========================================================
   MAIN
========================================================= */

export default function KPIDashboard({
  orgId,
}: {
  orgId: string
}) {
  const [data, setData] = useState<Point[]>([])
  const [totals, setTotals] = useState({
    income: 0,
    expense: 0,
    profit: 0,
    count: 0,
  })

  /* ======================================================
     LOAD
  ====================================================== */

  useEffect(() => {
    if (!orgId) return
    load()
  }, [orgId])

  async function load() {
    const result = await cachedQuery({
      key: ["kpi", orgId],
      ttl: 60_000,
      query: () => fetchData(orgId),
    })

    setData(result.points)
    setTotals(result.totals)
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="space-y-8">
      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Income" value={`₹ ${totals.income}`} />
        <Card label="Expense" value={`₹ ${totals.expense}`} />
        <Card label="Profit" value={`₹ ${totals.profit}`} />
        <Card label="Transactions" value={totals.count} />
      </div>

      {/* CHART */}
      <div className="border rounded-2xl p-5 h-72 bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="income"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="expense"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="profit"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* =========================================================
   DATA FETCH
========================================================= */

async function fetchData(orgId: string) {
  const [incomeRes, expenseRes] = await Promise.all([
    supabase
      .from("income")
      .select("amount, created_at")
      .eq("org_id", orgId),

    supabase
      .from("expenses")
      .select("amount, created_at")
      .eq("org_id", orgId),
  ])

  const income = incomeRes.data || []
  const expense = expenseRes.data || []

  const map: Record<string, Point> = {}

  function add(type: "income" | "expense", row: any) {
    const date = row.created_at.slice(0, 10)

    if (!map[date]) {
      map[date] = {
        date,
        income: 0,
        expense: 0,
        profit: 0,
      }
    }

    map[date][type] += row.amount
  }

  income.forEach((i) => add("income", i))
  expense.forEach((e) => add("expense", e))

  const points = Object.values(map)
    .sort((a, b) =>
      a.date.localeCompare(b.date)
    )
    .map((p) => ({
      ...p,
      profit: p.income - p.expense,
    }))

  const totals = {
    income: income.reduce((s, i) => s + i.amount, 0),
    expense: expense.reduce((s, e) => s + e.amount, 0),
    profit:
      income.reduce((s, i) => s + i.amount, 0) -
      expense.reduce((s, e) => s + e.amount, 0),
    count: income.length + expense.length,
  }

  return { points, totals }
}

/* =========================================================
   CARD
========================================================= */

function Card({
  label,
  value,
}: {
  label: string
  value: any
}) {
  return (
    <div className="border rounded-2xl p-4 bg-white">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
