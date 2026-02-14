"use client"

// ==========================================================
// HisabDesk — Personal Global Loading
// Location: app/personal/loading.tsx
//
// PURPOSE
// Global loading fallback for ALL /personal routes
//
// Next.js behavior:
// - auto shown during route transitions
// - auto shown during server fetch
// - improves perceived performance
//
// ARCHITECTURE RULES
// ✅ UI only
// ✅ no logic
// ✅ no data
// ❌ no fetch
// ❌ no DB
//
// Uses existing shadcn Skeleton component
// ==========================================================

import { Skeleton } from "@/components/ui/skeleton"

/* =========================================================
Page
========================================================= */

export default function PersonalLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-xl" />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>

      {/* Charts / Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>

      {/* Table */}
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  )
}
