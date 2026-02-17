ï»¿"use client"

/**
 * =========================================================
 * Tax Summary Card (Instant Tax Insights Widget)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Phase G (Pro Accounting Intelligence)
 * =========================================================
 *
 * PURPOSE
 * Shows:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ taxable profit
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ old regime tax
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ new regime tax
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ 44ADA tax
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ best regime suggestion
 *
 * WHY IMPORTANT
 * ---------------------------------------------------------
 * This is THE core value of HisabDesk.
 * Users instantly see:
 *   "How much tax do I owe?"
 *
 * Similar to:
 *   ClearTax quick estimator
 *   QuickBooks tax preview
 *
 * =========================================================
 *
 * CONNECTS TO
 *   lib/tax (already exists in your project)
 *
 *   calculateOldRegimeTax
 *   calculateNewRegimeTax
 *   calculate44ADA
 *
 * SAFE
 * - client only
 * - read only
 * - plug & play
 *
 * =========================================================
 *
 * USAGE
 *
 * <TaxSummaryCard profit={profit} />
 *
 * Put on:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ dashboard
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ reports
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ CA portal
 *
 * =========================================================
 */

import {
  calculateOldRegimeTax,
  calculateNewRegimeTax,
  calculate44ADA,
} from "@/lib/tax"

type Props = {
  profit: number
}

/* =========================================================
   MAIN
========================================================= */

export default function TaxSummaryCard({
  profit,
}: Props) {
  const oldTax = calculateOldRegimeTax(profit)
  const newTax = calculateNewRegimeTax(profit)
  const adaTax = calculate44ADA(profit)

  const min = Math.min(oldTax, newTax, adaTax)

  function label(v: number) {
    if (v === min) return "Best"
    return ""
  }

  return (
    <div className="border rounded-2xl p-5 bg-white space-y-4">
      <h3 className="text-sm font-semibold">
        Tax Estimate
      </h3>

      <Row
        name="Taxable Profit"
        value={`ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ${profit}`}
        highlight
      />

      <Row
        name="Old Regime"
        value={`ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ${oldTax}`}
        tag={label(oldTax)}
      />

      <Row
        name="New Regime"
        value={`ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ${newTax}`}
        tag={label(newTax)}
      />

      <Row
        name="44ADA Presumptive"
        value={`ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ${adaTax}`}
        tag={label(adaTax)}
      />
    </div>
  )
}

/* =========================================================
   ROW
========================================================= */

function Row({
  name,
  value,
  highlight,
  tag,
}: {
  name: string
  value: string
  highlight?: boolean
  tag?: string
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span
        className={
          highlight ? "font-medium" : "text-gray-600"
        }
      >
        {name}
      </span>

      <div className="flex items-center gap-2">
        {tag && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
            {tag}
          </span>
        )}

        <span className="font-semibold">{value}</span>
      </div>
    </div>
  )
}
