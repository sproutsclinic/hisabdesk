/* =========================================================
   HisabDesk — PortfolioAllocationChart
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Visual allocation by asset type
   - Quick diversification view
   - Zero business logic
   - Uses already computed allocation %
   - Pure visualization

   ARCHITECTURE
     engine/service → allocation numbers
                          ↓
                      this chart renders

   RULES
   ✅ UI only
   ✅ no fetch
   ✅ no DB
   ✅ no AI
   ❌ no calculations

   NOTE
   - Uses recharts (allowed per project stack)
   - Single clean donut chart

   ========================================================= */

"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { Card } from "@/components/ui/card"

import type { PortfolioAssetComputed } from "@/lib/api/portfolio/types"

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  rows: PortfolioAssetComputed[]
}

/* =========================================================
   COLORS (static only)
   ========================================================= */

const COLORS = [
  "#111827",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#D1D5DB",
  "#4B5563",
  "#1F2937",
  "#A3A3A3",
]

/* =========================================================
   COMPONENT
   ========================================================= */

export default function PortfolioAllocationChart({
  rows,
}: Props) {
  if (!rows?.length) return null

  /* -------------------------------------------------------
     GROUP BY TYPE (presentation grouping only)
     NOTE: NOT business logic — just aggregation for chart
     ------------------------------------------------------- */

  const grouped: Record<string, number> = {}

  rows.forEach((r) => {
    grouped[r.type] =
      (grouped[r.type] || 0) + r.allocationPercent
  })

  const data = Object.entries(grouped).map(
    ([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }),
  )

  /* =======================================================
     UI
     ======================================================= */

  return (
    <Card className="p-6 rounded-2xl shadow-sm">
      <h3 className="text-sm font-medium mb-4">
        Allocation by Asset Type
      </h3>

      <div className="h-64 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value: any) => `${value}%`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ---------------------------------------------------
         LEGEND
         --------------------------------------------------- */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {data.map((d, i) => (
          <div
            key={d.name}
            className="flex items-center gap-2"
          >
            <span
              className="w-3 h-3 rounded"
              style={{
                backgroundColor:
                  COLORS[i % COLORS.length],
              }}
            />
            <span className="capitalize">{d.name}</span>
            <span className="ml-auto">
              {d.value}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
