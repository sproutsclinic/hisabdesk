/* =========================================================
   HisabDesk — TaxShareEmailButton
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Quick share of tax summary via email client
   - Uses mailto (no backend required)
   - Zero business logic
   - Zero DB
   - Zero AI
   - Launch-friendly lightweight sharing

   WHY
   - Users often send tax summary to:
       ✓ CA
       ✓ spouse
       ✓ accountant
   - mailto avoids building email infra

   FUTURE (optional)
   - later can upgrade → server email API

   RULES
   ✅ presentational only
   ✅ no API calls
   ✅ no calculations (just formatting text)

   ========================================================= */

"use client"

import { useState } from "react"
import type { TaxComputationResult } from "@/lib/api/tax/types"

interface Props {
  result: TaxComputationResult
  financialYear?: string
  className?: string
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function TaxShareEmailButton({
  result,
  financialYear = "2024-25",
  className = "",
}: Props) {
  const [error, setError] = useState<string | null>(null)

  /* =======================================================
     SHARE
     ======================================================= */

  const share = () => {
    try {
      setError(null)

      const subject = encodeURIComponent(
        `HisabDesk Tax Summary (${financialYear})`,
      )

      /* simple formatted summary (display only) */
      const bodyText = `
Tax Summary — ${financialYear}

Old Regime Tax: ₹ ${Math.round(
        result.oldRegime.totalTax,
      ).toLocaleString("en-IN")}

New Regime Tax: ₹ ${Math.round(
        result.newRegime.totalTax,
      ).toLocaleString("en-IN")}

Recommended: ${result.recommended.toUpperCase()}

Savings: ₹ ${Math.round(result.savings).toLocaleString("en-IN")}

Generated via HisabDesk
      `.trim()

      const body = encodeURIComponent(bodyText)

      window.location.href = `mailto:?subject=${subject}&body=${body}`
    } catch {
      setError("Unable to open email client")
    }
  }

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="space-y-2">
      <button
        onClick={share}
        className={`px-4 py-2 rounded border text-sm hover:bg-muted ${className}`}
      >
        Share via Email
      </button>

      {error && (
        <div className="text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  )
}
