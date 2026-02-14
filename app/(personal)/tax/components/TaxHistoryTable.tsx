/* =========================================================
   HisabDesk — TaxHistoryTable
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Clean, reusable history display
   - Replaces inline history mapping from page
   - Keeps page thin (enterprise rule)
   - ZERO business logic
   - ZERO calculations
   - ZERO DB
   - ZERO AI

   Architecture:
     history (from hook/server) → display only

   Safe to reuse:
     ✓ tax page
     ✓ reports page
     ✓ dashboard widget
     ✓ future CA view

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"
import type { TaxCalculationRow } from "@/lib/api/tax/types"

interface Props {
  rows: TaxCalculationRow[]
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function TaxHistoryTable({ rows }: Props) {
  if (!rows?.length) return null

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-medium">History</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* -------------------------------------------------
             HEADER
             ------------------------------------------------- */}
          <thead>
            <tr className="text-muted-foreground border-b">
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Financial Year</th>
              <th className="text-left py-2">Recommended</th>
              <th className="text-right py-2">Total Tax (₹)</th>
            </tr>
          </thead>

          {/* -------------------------------------------------
             BODY
             ------------------------------------------------- */}
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b last:border-none"
              >
                <td className="py-2">
                  {formatDate(row.created_at)}
                </td>

                <td className="py-2">
                  {row.financial_year}
                </td>

                <td className="py-2 uppercase">
                  {row.recommended_regime}
                </td>

                <td className="py-2 text-right font-medium">
                  {formatCurrency(row.total_tax)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

/* =========================================================
   HELPERS (UI formatting only)
   ========================================================= */

function formatCurrency(n: number) {
  return Math.round(Number(n || 0)).toLocaleString("en-IN")
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("en-IN")
}
