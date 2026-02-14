// ==========================================================
// HisabDesk — Dashboard Loading UI (Skeleton)
// ----------------------------------------------------------
// PURPOSE
//   Instant skeleton while dashboard server data loads
//
//   Why:
//     ✓ avoids blank screen
//     ✓ improves perceived performance
//     ✓ App Router native loading.tsx
//
//   RULES
//     ✓ UI only
//     ✓ no logic
//     ✓ lightweight
//
// ==========================================================

import { Card } from "@/components/ui/card"

// ==========================================================

export default function Loading() {
  return (
    <main className="space-y-8 animate-pulse">

      {/* Header */}
      <div className="space-y-2">
        <div className="h-6 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
      </div>



      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <SkeletonCard />
        <SkeletonCard />
      </div>



      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>



      {/* Widgets grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

    </main>
  )
}



// ==========================================================
// REUSABLE SKELETON CARD
// ==========================================================

function SkeletonCard() {
  return (
    <Card className="p-5 space-y-3">
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="h-6 w-32 bg-gray-300 rounded" />
      <div className="h-3 w-full bg-gray-100 rounded" />
    </Card>
  )
}
