/* =========================================================
   HisabDesk — Profile Error
   ---------------------------------------------------------
   ROUTE ERROR UI (Next.js)

   PURPOSE
   - Show friendly error screen
   - Allow retry
   - Pure presentation

   RULES
   ✅ UI only
   ❌ no business logic
   ❌ no DB
   ❌ no hooks (except reset from Next.js)

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  console.error("Profile page error:", error)

  return (
    <div className="p-6 flex justify-center">
      <Card className="p-8 max-w-md w-full text-center space-y-4">
        <h2 className="text-lg font-semibold">
          Something went wrong
        </h2>

        <p className="text-sm text-muted-foreground">
          We couldn’t load your profile details.  
          Please try again.
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
