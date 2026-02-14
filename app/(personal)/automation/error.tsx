/* =========================================================
   HisabDesk — Automation Error Boundary
   ---------------------------------------------------------
   ROUTE ERROR UI

   PURPOSE
   - Catches runtime errors for automation page
   - Shows friendly retry screen
   - ZERO business logic

   RULES
   ✅ UI only
   ❌ no fetch
   ❌ no DB
   ❌ no calculations
   ❌ no AI

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"

interface Props {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  console.error("Automation page error:", error)

  return (
    <div className="p-6">
      <Card className="p-8 text-center space-y-4">
        <h2 className="text-lg font-semibold">
          Something went wrong
        </h2>

        <p className="text-sm text-muted-foreground">
          Failed to load automation rules. Please try again.
        </p>

        <button
          onClick={reset}
          className="px-4 py-2 rounded bg-black text-white"
        >
          Retry
        </button>
      </Card>
    </div>
  )
}
