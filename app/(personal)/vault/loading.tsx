// ==========================================================
// HisabDesk — Vault Loading UI (Skeleton)
// ----------------------------------------------------------
// PURPOSE
//   Skeleton while Vault data loads
//
//   Improves:
//     ✓ perceived speed
//     ✓ UX polish
//     ✓ avoids blank screen
//
//   RULES
//     ✓ UI only
//     ✓ no logic
//
// ==========================================================

import { Card } from "@/components/ui/card"

// ==========================================================

export default function Loading() {
  return (
    <main className="space-y-6 animate-pulse">

      {/* Header */}
      <div className="space-y-2">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
      </div>

      {/* Upload card */}
      <SkeletonCard />

      {/* List cards */}
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />

    </main>
  )
}

// ==========================================================
// SKELETON CARD
// ==========================================================

function SkeletonCard() {
  return (
    <Card className="p-5 space-y-3">
      <div className="h-4 w-40 bg-gray-200 rounded" />
      <div className="h-8 w-full bg-gray-100 rounded" />
      <div className="h-8 w-24 bg-gray-200 rounded" />
    </Card>
  )
}
