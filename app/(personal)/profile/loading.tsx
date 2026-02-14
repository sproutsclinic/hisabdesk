/* =========================================================
   HisabDesk — Profile Loading
   ---------------------------------------------------------
   ROUTE LOADING UI (Next.js)

   PURPOSE
   - Skeleton screen while profile loads
   - Smooth UX
   - ZERO logic

   RULES
   ✅ UI only
   ❌ no hooks
   ❌ no fetch
   ❌ no DB
   ❌ no AI
   ❌ no calculations

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"

/* =========================================================
   COMPONENT
   ========================================================= */

export default function Loading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      {/* HEADER */}
      <div className="space-y-2">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="h-3 w-72 bg-gray-200 rounded" />
      </div>

      {/* PROFILE CARD */}
      <Card className="p-6 space-y-4">
        <div className="h-5 w-32 bg-gray-200 rounded" />

        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </Card>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="h-20 bg-gray-200" />
        <Card className="h-20 bg-gray-200" />
        <Card className="h-20 bg-gray-200" />
      </div>
    </div>
  )
}
