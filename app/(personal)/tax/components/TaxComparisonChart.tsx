ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â TaxComparisonChart
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Visual Old vs New regime comparison
   - Instant decision clarity
   - Zero business logic
   - Pure visualization
========================================================= */

"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

import type { TaxComputationResult } from "@/lib/api/tax/types"
import { Card } from "@/components/ui/card"

/* ========================================================= */

interface Props {
  result: TaxComputationResult
}

/* ========================================================= */

export default function TaxComparisonChart({ result }: Props) {
  // presentation-only transform (NOT business logic)
  const data = [
    {
      regime: "Old",
      tax: Math.round(result.oldRegime.totalTax),
    },
    {
      regime: "New",
      tax: Math.round(result.newRegime.totalTax),
    },
  ]

  return (
    <Card className="p-6 space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-medium">Regime Comparison</h3>
        <p className="text-xs text-muted-foreground">
          Lower bar = lower tax
        </p>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="regime" />
            <YAxis />

            {/* ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ STRICT-MODE SAFE TOOLTIP */}
            <Tooltip
              formatter={(value: unknown) => {
                const safe =
                  typeof value === "number"
                    ? value
                    : Number(value ?? 0)

                return `ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ${safe.toLocaleString("en-IN")}`
              }}
            />

            {/* No color specified intentionally */}
            <Bar dataKey="tax" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="text-xs text-muted-foreground">
        Savings: ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {Math.round(result.savings).toLocaleString("en-IN")}
      </div>
    </Card>
  )
}
