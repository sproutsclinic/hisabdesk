ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â TaxSummaryCard
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Clean reusable summary display for tax result
   - Centralizes result UI (avoid duplication in page)
   - ZERO business logic
   - ZERO calculations
   - ZERO DB
   - ZERO AI

   Architecture:
     result (server computed) ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ display only

   Safe to reuse:
     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ tax page
     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ reports preview
     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ dashboard widget (future)

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"
import type { TaxComputationResult } from "@/lib/api/tax/types"

interface Props {
  result: TaxComputationResult
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function TaxSummaryCard({ result }: Props) {
  const oldR = result.oldRegime
  const newR = result.newRegime

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* -----------------------------------------------------
         OLD REGIME
         ----------------------------------------------------- */}
      <Card className="p-6 space-y-2">
        <h3 className="font-medium">Old Regime</h3>

        <Row label="Gross Income" value={oldR.grossIncome} />
        <Row label="Deductions" value={oldR.totalDeductions} />
        <Row label="Taxable Income" value={oldR.taxableIncome} />
        <Row label="Total Tax" value={oldR.totalTax} />
        <Row
          label="Effective Rate"
          value={`${(oldR.effectiveRate * 100).toFixed(2)}%`}
        />
      </Card>

      {/* -----------------------------------------------------
         NEW REGIME
         ----------------------------------------------------- */}
      <Card className="p-6 space-y-2">
        <h3 className="font-medium">New Regime</h3>

        <Row label="Gross Income" value={newR.grossIncome} />
        <Row label="Taxable Income" value={newR.taxableIncome} />
        <Row label="Total Tax" value={newR.totalTax} />
        <Row
          label="Effective Rate"
          value={`${(newR.effectiveRate * 100).toFixed(2)}%`}
        />
      </Card>

      {/* -----------------------------------------------------
         RECOMMENDATION
         ----------------------------------------------------- */}
      <Card className="p-6 md:col-span-2 space-y-2 border-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-base">
            Recommended Regime
          </h3>

          <span className="text-lg font-bold">
            {result.recommended.toUpperCase()}
          </span>
        </div>

        <div className="text-sm text-muted-foreground">
          Estimated Savings
        </div>

        <div className="text-xl font-semibold">
          ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {Math.round(result.savings)}
        </div>
      </Card>
    </div>
  )
}

/* =========================================================
   INTERNAL ROW (UI only)
   ========================================================= */

function Row({
  label,
  value,
}: {
  label: string
  value: number | string
}) {
  const display =
    typeof value === "number"
      ? `ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ${Math.round(value)}`
      : value

  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{display}</span>
    </div>
  )
}
