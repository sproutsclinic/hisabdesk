"use client"

/**
 * =========================================================
 * Global Route Loading (Production Hardened)
 * HisabDesk – Stability Phase
 * =========================================================
 *
 * PURPOSE
 * - Prevent blank screen flash
 * - Provide consistent skeleton across routes
 * - Improve perceived performance
 * - Enterprise polish (QuickBooks/Zoho style)
 *
 * RULES
 * - Additive only
 * - No routing changes
 * - No logic changes
 * =========================================================
 */

export default function Loading() {
  return (
    <div
      className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950"
      role="status"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Header skeleton */}
        <div className="h-8 w-48 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />

        {/* KPI Cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        </div>

        {/* Table skeleton */}
        <div className="space-y-3">
          <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        </div>

      </div>
    </div>
  )
}
