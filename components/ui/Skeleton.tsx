ï»¿"use client"

import { cn } from "@/lib/utils"

/* ==========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Skeleton System
   ----------------------------------------------------------
   Enterprise safe
   No DOM injection
   SSR safe
   Pure Tailwind
========================================================== */


/* ==========================================================
   BASE
========================================================== */

export function Skeleton({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        `
        relative overflow-hidden
        rounded-xl
        bg-zinc-200
        animate-pulse
        `,
        className,
      )}
    />
  )
}


/* ==========================================================
   TEXT BLOCK
========================================================== */

export function SkeletonText({
  lines = 3,
}: {
  lines?: number
}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full",
          )}
        />
      ))}
    </div>
  )
}


/* ==========================================================
   CARD PLACEHOLDER
========================================================== */

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
      <Skeleton className="h-5 w-32" />
      <SkeletonText lines={3} />
    </div>
  )
}


/* ==========================================================
   LIST PLACEHOLDER
========================================================== */

export function SkeletonList({
  count = 5,
}: {
  count?: number
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-2xl" />
      ))}
    </div>
  )
}


/* ==========================================================
   TABLE ROW
========================================================== */

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-20 ml-auto" />
    </div>
  )
}
