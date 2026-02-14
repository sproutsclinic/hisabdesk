/* =========================================================
   HisabDesk — LoansEmptyState
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Shown when user has no loans
   - Friendly guidance
   - ZERO logic

   RULES
   ✅ presentation only
   ❌ no hooks
   ❌ no fetch
   ❌ no math
   ❌ no DB
   ❌ no AI

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"

/* =========================================================
   COMPONENT
   ========================================================= */

export default function LoansEmptyState() {
  return (
    <Card className="p-10 text-center space-y-3">
      <div className="text-lg font-semibold">
        No loans yet
      </div>

      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Add your home, car, education or personal loans to track
        EMIs, outstanding balance and payoff progress in one
        place.
      </p>

      <p className="text-xs text-muted-foreground">
        Use the form above to add your first loan.
      </p>
    </Card>
  )
}
