/* =========================================================
   HisabDesk — Loans Loading UI
   ---------------------------------------------------------
   ROUTE LOADING STATE

   PURPOSE
   - Shown automatically by Next.js while page loads
   - Skeleton placeholders only
   - ZERO logic

   RULES
   ✅ UI only
   ❌ no hooks
   ❌ no fetch
   ❌ no math
   ❌ no business logic

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"

/* =========================================================
   COMPONENT
   ========================================================= */

export default function LoansLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      {/* HEADER */}
      <div className="space-y-2">
        <div className="h-6 w-40 bg-muted rounded" />
        <div className="h-4 w-72 bg-muted rounded" />
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 space-y-2">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-6 w-24 bg-muted rounded" />
          </Card>
        ))}
      </div>

      {/* FORM */}
      <Card className="p-6 space-y-4">
        <div className="h-4 w-24 bg-muted rounded" />

        <div className="grid md:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 bg-muted rounded"
            />
          ))}
        </div>

        <div className="h-9 w-28 bg-muted rounded" />
      </Card>

      {/* LIST */}
      <Card className="p-6 space-y-3">
        <div className="h-4 w-32 bg-muted rounded" />

        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-muted rounded"
          />
        ))}
      </Card>
    </div>
  )
}
