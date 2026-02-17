ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â PortfolioSummaryCards
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Displays portfolio KPIs
   - Pure presentation
   - Uses precomputed summary from engine/service
   - ZERO calculations
   - ZERO DB
   - ZERO AI

   ARCHITECTURE
     engine ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ summary numbers ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ this component renders

   RULES
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ UI only
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no math logic
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no hooks
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no fetch

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"
import type { PortfolioSummary } from "@/lib/api/portfolio/types"

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  summary: PortfolioSummary
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function PortfolioSummaryCards({
  summary,
}: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Stat
        label="Total Invested"
        value={summary.totalInvested}
      />

      <Stat
        label="Current Value"
        value={summary.totalCurrent}
      />

      <Stat
        label="Profit / Loss"
        value={summary.totalPnL}
        positive={summary.totalPnL >= 0}
      />

      <Stat
        label="Return %"
        value={summary.totalReturnPercent}
        suffix="%"
        positive={summary.totalReturnPercent >= 0}
      />
    </div>
  )
}

/* =========================================================
   INTERNAL CARD
   ========================================================= */

function Stat({
  label,
  value,
  suffix = "",
  positive,
}: {
  label: string
  value: number
  suffix?: string
  positive?: boolean
}) {
  return (
    <Card className="p-4 space-y-1 rounded-2xl shadow-sm">
      <div className="text-xs text-muted-foreground">
        {label}
      </div>

      <div
        className={`text-lg font-semibold ${
          positive === undefined
            ? ""
            : positive
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {Math.round(value)}
        {suffix}
      </div>
    </Card>
  )
}
