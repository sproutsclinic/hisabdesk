/* =========================================================
   HisabDesk — LoansSummaryCards
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Display loan overview stats
   - Pure presentation
   - Reusable

   RULES
   ✅ UI only
   ❌ no hooks
   ❌ no fetch
   ❌ no calculations
   ❌ no business logic

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"

import type { LoanSummary } from "@/lib/api/loans/types"

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  summary: LoanSummary
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function LoansSummaryCards({ summary }: Props) {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Stat label="Outstanding" value={summary.totalOutstanding} />
      <Stat label="Total EMI" value={summary.totalEMI} />
      <Stat label="Interest Left" value={summary.totalInterestLeft} />
      <Stat
        label="Active Loans"
        value={summary.activeLoans}
        prefix=""
      />
    </div>
  )
}

/* =========================================================
   SMALL CARD
   ========================================================= */

function Stat({
  label,
  value,
  prefix = "₹ ",
}: {
  label: string
  value: number
  prefix?: string
}) {
  return (
    <Card className="p-4 space-y-1">
      <div className="text-xs text-muted-foreground">
        {label}
      </div>

      <div className="text-lg font-semibold">
        {prefix}
        {Math.round(value)}
      </div>
    </Card>
  )
}
