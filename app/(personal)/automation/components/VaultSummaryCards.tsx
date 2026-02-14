/* =========================================================
   HisabDesk — VaultSummaryCards
   ---------------------------------------------------------
   UI ONLY
   Shows file stats
   ❌ no logic
   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"

/* ========================================================= */

interface Props {
  summary: {
    totalFiles: number
    totalSize: number
  }
}

/* ========================================================= */

export default function VaultSummaryCards({
  summary,
}: Props) {
  const sizeMB = summary.totalSize / 1024 / 1024

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Stat
        label="Total Files"
        value={summary.totalFiles}
        suffix=""
      />

      <Stat
        label="Storage Used"
        value={sizeMB}
        suffix=" MB"
        decimals
      />
    </div>
  )
}

/* ========================================================= */

function Stat({
  label,
  value,
  suffix = "",
  decimals = false,
}: {
  label: string
  value: number
  suffix?: string
  decimals?: boolean
}) {
  return (
    <Card className="p-4 space-y-1">
      <div className="text-xs text-muted-foreground">
        {label}
      </div>

      <div className="text-lg font-semibold">
        {decimals ? value.toFixed(2) : Math.round(value)}
        {suffix}
      </div>
    </Card>
  )
}
