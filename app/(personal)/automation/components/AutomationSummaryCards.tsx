/* =========================================================
   HisabDesk — AutomationSummaryCards
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Show monthly automation impact
   - Income vs Expense vs Net
   - Pure presentation
   - ZERO logic

   RULES
   ✅ UI only
   ❌ no hooks
   ❌ no fetch
   ❌ no calculations
   ❌ no DB
   ❌ no AI

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"

import type { AutomationOverview } from "@/lib/api/automation/types"

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  overview: AutomationOverview
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function AutomationSummaryCards({
  overview,
}: Props) {
  const s = overview.summary

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Stat label="Active Rules" value={s.activeRules} prefix="" />

      <Stat label="Monthly Income" value={s.monthlyIncome} />

      <Stat label="Monthly Expense" value={s.monthlyExpense} />

      <Stat
        label="Net Monthly Impact"
        value={s.netMonthlyImpact}
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
