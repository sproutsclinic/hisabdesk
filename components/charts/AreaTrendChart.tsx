"use client"

// ==========================================================
// HisabDesk — AreaTrendChart (Reusable)
// Location: components/charts/AreaTrendChart.tsx
//
// PURPOSE
// Professional financial trend visualization
//
// Used by:
// - Dashboard (cashflow trend)
// - Reports (monthly series)
// - Planner (future projection later)
//
// DESIGN
// - clean fintech style
// - soft areas
// - responsive
// - zero business logic
//
// ARCHITECTURE RULES
// ✅ UI only
// ✅ pure presentational
// ❌ no calculations
// ❌ no fetch
// ❌ no DB
//
// INPUT EXPECTED
// [
//   { month: "2025-01", income: 50000, expense: 30000, savings: 20000 }
// ]
//
// Built with:
// recharts (allowed by project rules)
// ==========================================================

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

import { Card, CardContent } from "@/components/ui/card"

/* =========================================================
Types
========================================================= */

export interface TrendPoint {
  month: string
  income: number
  expense: number
  savings: number
}

interface Props {
  title?: string
  data: TrendPoint[]
  height?: number
}

/* =========================================================
Component
========================================================= */

export default function AreaTrendChart({
  title = "Cashflow Trend",
  data,
  height = 320,
}: Props) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        {/* Chart */}
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="month"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip />

              <Legend />

              {/* Income */}
              <Area
                type="monotone"
                dataKey="income"
                strokeWidth={2}
                fillOpacity={0.2}
              />

              {/* Expense */}
              <Area
                type="monotone"
                dataKey="expense"
                strokeWidth={2}
                fillOpacity={0.2}
              />

              {/* Savings */}
              <Area
                type="monotone"
                dataKey="savings"
                strokeWidth={2}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
