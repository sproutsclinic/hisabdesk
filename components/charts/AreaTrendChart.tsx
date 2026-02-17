ï»¿"use client"

/**
 * =========================================================
 * AreaTrendChart (Pure Visualization)
 * ---------------------------------------------------------
 * MUST NOT import from API layer.
 * Accepts already-shaped data.
 * =========================================================
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

/* =========================================================
   VIEW MODEL (UI SAFE)
   ========================================================= */

export interface TrendPoint {
  label: string   // e.g. "Jan", "2025-01"
  value: number
}

interface Props {
  title?: string
  data: TrendPoint[]
}

export default function AreaTrendChart({ title, data }: Props) {
  if (!data?.length) return null

  return (
    <div className="rounded-xl border p-4 space-y-4">
      {title && <h3 className="text-sm font-semibold">{title}</h3>}

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" strokeWidth={2} fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
