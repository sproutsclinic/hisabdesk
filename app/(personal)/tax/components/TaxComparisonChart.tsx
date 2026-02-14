/* =========================================================
   HisabDesk — TaxComparisonChart
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Visual Old vs New regime comparison
   - Instant decision clarity
   - Zero business logic
   - Pure visualization

   ARCHITECTURE
     result (server computed) → chart only

   RULES
   ✅ No math logic
   ✅ No DB
   ✅ No AI
   ✅ No hooks calling APIs
   ✅ Pure presentational

   NOTES
   - Uses recharts (already allowed in project stack)
   - Single chart only (per design rule)
   - No colors specified (theme controlled)

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

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  result: TaxComputationResult
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function TaxComparisonChart({ result }: Props) {
  /* -------------------------------------------------------
     Transform → chart data only (no calculations)
     ------------------------------------------------------- */
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
      {/* ----------------------------------------------------
         HEADER
         ---------------------------------------------------- */}
      <div>
        <h3 className="font-medium">Regime Comparison</h3>
        <p className="text-xs text-muted-foreground">
          Lower bar = lower tax
        </p>
      </div>

      {/* ----------------------------------------------------
         CHART
         ---------------------------------------------------- */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="regime" />

            <YAxis />

            <Tooltip
              formatter={(v: number) =>
                `₹ ${v.toLocaleString("en-IN")}`
              }
            />

            {/* No color specified intentionally */}
            <Bar dataKey="tax" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ----------------------------------------------------
         FOOTER
         ---------------------------------------------------- */}
      <div className="text-xs text-muted-foreground">
        Savings: ₹ {Math.round(result.savings).toLocaleString("en-IN")}
      </div>
    </Card>
  )
}
