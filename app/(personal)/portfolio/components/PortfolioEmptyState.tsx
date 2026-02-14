/* =========================================================
   HisabDesk — PortfolioEmptyState
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Friendly empty state when no assets exist
   - Improves UX for first-time users
   - Pure presentation
   - ZERO business logic
   - ZERO DB
   - ZERO calculations

   USAGE
     {assets.length === 0 && <PortfolioEmptyState />}

   RULES
   ✅ UI only
   ❌ no hooks
   ❌ no fetch
   ❌ no AI
   ❌ no math

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"

/* =========================================================
   COMPONENT
   ========================================================= */

export default function PortfolioEmptyState() {
  return (
    <Card className="p-10 rounded-2xl text-center space-y-4 border-dashed">
      {/* -----------------------------------------------------
         ICON (simple visual block, no dependency)
         ----------------------------------------------------- */}
      <div className="mx-auto w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-lg">
        📊
      </div>

      {/* -----------------------------------------------------
         TEXT
         ----------------------------------------------------- */}
      <div className="space-y-1">
        <h3 className="font-medium">No investments yet</h3>

        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Add your first asset to start tracking allocation,
          returns and AI rebalance insights.
        </p>
      </div>

      {/* -----------------------------------------------------
         HINT
         ----------------------------------------------------- */}
      <div className="text-xs text-muted-foreground">
        Examples: Stocks, Mutual Funds, Gold, FD, Crypto
      </div>
    </Card>
  )
}
