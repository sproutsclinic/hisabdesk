"use client"

/**
 * =========================================================
 * Monthly Profit Chart (Executive Trend View)
 * HisabDesk – Phase G (Advanced Analytics)
 * =========================================================
 *
 * PURPOSE
 * Visual monthly trend:
 *
 *   ✓ income vs expense vs profit
 *   ✓ month-on-month growth
 *   ✓ founder/CA overview
 *
 * WHY IMPORTANT
 * ---------------------------------------------------------
 * KPIs show totals
 * Table shows details
 * Chart shows TRENDS  ← most important for decisions
 *
 * Similar to:
 *   Stripe revenue chart
 *   QuickBooks trends
 *   Zoho analytics
 *
 * =========================================================
 *
 * CONNECTS TO
 *   income
 *   expenses
 *
 * SAFE
 * - client only
 * - read only
 * - reusable
 *
 * =========================================================
 *
 * USAGE
 *
 * <MonthlyProfitChart orgId={orgId} />
 *
 * Place:
 *   ✓ reports page
 *   ✓ dashboard top
 *   ✓ admin analytics
 *
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

/* =========================================================
   TYPES
========================================================= */

type Point = {
  month: string
  income: number
  expense: number
  profit: number
}

/* =========================================================
   MAIN
========================================================= */

export default function MonthlyProfitChart({
  orgId,
}: {
  orgId: string
}) {
  const [data, setData] = useState<Point[]>([])

  useEffect(() => {
    if (!orgId) return
    load()
  }, [orgId])

  /* ======================================================
     LOAD
  ====================================================== */

  async function load() {
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

    const map: Record<string, Point> = {}

    function add(
      type: "income" | "expense",
      row: any
    ) {
      const d = new Date(row.created_at)

      const key = `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`

      if (!map[key]) {
        map[key] = {
          month: key,
          income: 0,
          expense: 0,
          profit: 0,
        }
      }

      map[key][type] += row.amount
    }

    incomeRes.data?.forEach((r) =>
      add("income", r)
    )

    expenseRes.data?.forEach((r) =>
      add("expense", r)
    )

    const points = Object.values(map)
      .sort((a, b) =>
        a.month.localeCompare(b.month)
      )
      .map((p) => ({
        ...p,
        profit: p.income - p.expense,
      }))

    setData(points)
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="border rounded-2xl p-5 bg-white h-80">
      <h3 className="text-sm font-semibold mb-3">
        Monthly Trend
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="income"
            strokeWidth={2}
            fillOpacity={0.15}
          />

          <Area
            type="monotone"
            dataKey="expense"
            strokeWidth={2}
            fillOpacity={0.15}
          />

          <Area
            type="monotone"
            dataKey="profit"
            strokeWidth={2}
            fillOpacity={0.25}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
