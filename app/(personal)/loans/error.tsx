/* =========================================================
   HisabDesk — Loans Error UI
   ---------------------------------------------------------
   ROUTE ERROR BOUNDARY

   PURPOSE
   - Catch rendering/runtime errors for Loans page
   - Provide retry
   - UI only

   RULES
   ✅ presentation only
   ❌ no business logic
   ❌ no fetch
   ❌ no DB
   ❌ no AI

   ========================================================= */

"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function LoansError({ error, reset }: Props) {
  useEffect(() => {
    console.error("Loans page error:", error)
  }, [error])

  return (
    <div className="p-6">
      <Card className="p-8 text-center space-y-4">
        <h2 className="text-lg font-semibold">
          Something went wrong
        </h2>

        <p className="text-sm text-muted-foreground">
          Unable to load your loans right now. Please try again.
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
