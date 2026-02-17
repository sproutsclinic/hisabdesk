ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â BillsSummaryCards
   ---------------------------------------------------------
   UI ONLY
   Shows monthly bill impact
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no logic
   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"
import type { BillsOverview } from "@/lib/api/bills/types"

interface Props {
  overview: BillsOverview
}

export default function BillsSummaryCards({ overview }: Props) {
  const s = overview.summary

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Stat label="Active Bills" value={s.activeBills} prefix="" />
      <Stat label="Monthly Total" value={s.totalMonthly} />
      <Stat label="Upcoming This Month" value={s.upcomingThisMonth} />
      <Stat label="Auto Pay Enabled" value={s.autoPayCount} prefix="" />
    </div>
  )
}

/* ========================================================= */

function Stat({
  label,
  value,
  prefix = "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ",
}: {
  label: string
  value: number
  prefix?: string
}) {
  return (
    <Card className="p-4 space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">
        {prefix}
        {Math.round(value)}
      </div>
    </Card>
  )
}
