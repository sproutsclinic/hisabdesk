ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â PortfolioAllocationChart
   UI ONLY COMPONENT (Next.js 16 strict-safe)
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

/* ========================================================= */

interface Props {
  rows: PortfolioAssetComputed[]
}

/* =========================================================
   Static color palette (deterministic)
========================================================= */

const COLORS: string[] = [
  "#111827",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#D1D5DB",
  "#4B5563",
  "#1F2937",
  "#A3A3A3",
]

/* ========================================================= */

export default function PortfolioAllocationChart({ rows }: Props) {
  if (!rows || rows.length === 0) return null

  /* -------------------------------------------------------
     Presentation grouping (UI aggregation only)
  ------------------------------------------------------- */

  const grouped: Record<string, number> = {}

  for (const r of rows) {
    const key = r.type ?? "other"
    grouped[key] = (grouped[key] ?? 0) + (r.allocationPercent ?? 0)
  }

  const data = Object.entries(grouped).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2)),
  }))

  /* ====================================================== */

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
              {data.map((_, index) => {
                const color = COLORS[index % COLORS.length] || "#8884d8"
                return <Cell key={index} fill={color} />
              })}
            </Pie>

            <Tooltip
              formatter={(value: unknown) => {
                const num =
                  typeof value === "number"
                    ? value
                    : Number(value ?? 0)

                return `${num}%`
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {data.map((d, i) => {
          const color = COLORS[i % COLORS.length] || "#8884d8"

          return (
            <div key={d.name} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize">{d.name}</span>
              <span className="ml-auto">{d.value}%</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
