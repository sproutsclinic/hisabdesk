/* =========================================================
   HisabDesk — Automation Loading
   ---------------------------------------------------------
   ROUTE LOADING UI

   PURPOSE
   - Shown automatically by Next.js while page loads
   - Pure skeleton UI
   - ZERO logic

   RULES
   ✅ UI only
   ❌ no hooks
   ❌ no fetch
   ❌ no business logic

   ========================================================= */

import { Card } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      {/* header */}
      <div className="space-y-2">
        <div className="h-6 w-40 bg-muted rounded" />
        <div className="h-4 w-72 bg-muted rounded" />
      </div>

      {/* summary skeleton */}
      <div className="grid md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-4 w-24 bg-muted rounded mb-3" />
            <div className="h-6 w-20 bg-muted rounded" />
          </Card>
        ))}
      </div>

      {/* form skeleton */}
      <Card className="p-6 space-y-3">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="grid md:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-10 bg-muted rounded"
            />
          ))}
        </div>
      </Card>

      {/* table skeleton */}
      <Card className="p-6 space-y-3">
        <div className="h-4 w-32 bg-muted rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-10 bg-muted rounded"
          />
        ))}
      </Card>
    </div>
  )
}
