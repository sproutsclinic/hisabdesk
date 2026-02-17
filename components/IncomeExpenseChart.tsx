ï»¿"use client"

import { useMemo } from "react"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts"

type Row = {
  date: string
  income: number
  expense: number
}

/* =====================================================
   PERFORMANCE CONSTANTS (ADDITIVE ONLY)
   Prevent heavy chart rendering on large datasets
===================================================== */

const MAX_POINTS = 180 // ~6 months daily data (smooth + fast)

/* =====================================================
   COMPONENT
===================================================== */

export default function IncomeExpenseChart({ data }: { data: Row[] }) {
  /* =====================================================
     SSR SAFE + PERFORMANCE HARDENED
     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ memoized transformation
     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ dataset cap
     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ avoids heavy re-renders
  ===================================================== */

  const enriched = useMemo(() => {
    const safe = Array.isArray(data) ? data : []

    // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ prevent over-rendering thousands of points
    const trimmed =
      safe.length > MAX_POINTS
        ? safe.slice(safe.length - MAX_POINTS)
        : safe

    return trimmed.map((d) => ({
      ...d,
      profit: (d.income || 0) - (d.expense || 0),
    }))
  }, [data])

  /* =====================================================
     FORMATTERS
  ===================================================== */

  const formatCurrency = (value: number) =>
    `ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ${Number(value).toLocaleString("en-IN")}`

  const formatAxis = (v: number) => {
    if (v >= 1000000) return `ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹${(v / 1000000).toFixed(1)}M`
    if (v >= 1000) return `ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹${(v / 1000).toFixed(0)}k`
    return `ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹${v}`
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border shadow-sm w-full">
      <h3 className="font-semibold mb-4 text-sm md:text-base">
        Income vs Expense Trend
      </h3>

      {/* responsive height for mobile */}
      <div className="w-full h-[260px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={enriched}>

            {/* ========= GRADIENT (NEW) ========= */}
            <defs>
              <linearGradient
                id="incomeFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopOpacity={0.25} />
                <stop offset="100%" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            {/* softer grid */}
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              minTickGap={24} // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ avoids overcrowding
            />

            <YAxis
              tickFormatter={formatAxis}
              tick={{ fontSize: 12 }}
              width={70} // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ stable layout
            />

            <Tooltip
              formatter={(value) => {
  const num = typeof value === "number" ? value : Number(value ?? 0)
  return formatCurrency(num)
}}
              contentStyle={{
                borderRadius: 12,
                fontSize: 12,
              }}
            />

            <Legend />

            {/* ========= INCOME (area + line) ========= */}
            <Area
              type="monotone"
              dataKey="income"
              strokeWidth={2}
              fill="url(#incomeFill)"
              dot={false}
              isAnimationActive
            />

            {/* ========= EXPENSE ========= */}
            <Line
              type="monotone"
              dataKey="expense"
              strokeWidth={3}
              dot={false}
              isAnimationActive
            />

            {/* ========= PROFIT (intelligence line) ========= */}
            <Line
              type="monotone"
              dataKey="profit"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive
            />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

