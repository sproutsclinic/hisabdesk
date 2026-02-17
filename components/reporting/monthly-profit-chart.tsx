ï»¿"use client"

/**
 * =========================================================
 * Monthly Profit Chart (Personal Mode)
 * ---------------------------------------------------------
 * PURE VIEW COMPONENT
 *
 * Receives computed monthly data from API layer.
 *
 * NO Supabase
 * NO org
 * NO data fetching
 * =========================================================
 */

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

/* =========================================================
   TYPES (UI Contract Only)
========================================================= */

export type MonthlyPoint = {
  month: string
  income: number
  expense: number
  profit: number
}

/* =========================================================
   COMPONENT
========================================================= */

export default function MonthlyProfitChart({
  data,
}: {
  data: MonthlyPoint[]
}) {
  if (!data?.length) return null

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

          <Area type="monotone" dataKey="income" strokeWidth={2} fillOpacity={0.15} />
          <Area type="monotone" dataKey="expense" strokeWidth={2} fillOpacity={0.15} />
          <Area type="monotone" dataKey="profit" strokeWidth={2} fillOpacity={0.25} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
