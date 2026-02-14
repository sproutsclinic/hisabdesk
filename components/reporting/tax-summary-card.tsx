"use client"

/**
 * =========================================================
 * Tax Summary Card (Instant Tax Insights Widget)
 * HisabDesk – Phase G (Pro Accounting Intelligence)
 * =========================================================
 *
 * PURPOSE
 * Shows:
 *   ✓ taxable profit
 *   ✓ old regime tax
 *   ✓ new regime tax
 *   ✓ 44ADA tax
 *   ✓ best regime suggestion
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
 *   ✓ dashboard
 *   ✓ reports
 *   ✓ CA portal
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
        value={`₹ ${profit}`}
        highlight
      />

      <Row
        name="Old Regime"
        value={`₹ ${oldTax}`}
        tag={label(oldTax)}
      />

      <Row
        name="New Regime"
        value={`₹ ${newTax}`}
        tag={label(newTax)}
      />

      <Row
        name="44ADA Presumptive"
        value={`₹ ${adaTax}`}
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
