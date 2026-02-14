"use client"

/**
 * =========================================================
 * Usage Guard (Client-side Soft Blocker)
 * HisabDesk – Billing Enforcement UX
 * =========================================================
 *
 * PURPOSE
 * Prevent user actions when limits reached.
 *
 * This is UX layer ONLY.
 * Server still enforces limits securely.
 *
 * Shows:
 *   ✓ disabled state
 *   ✓ upgrade message
 *
 * =========================================================
 *
 * USAGE
 *
 * <UsageGuard allowed={canCreate}>
 *   <button>Add Expense</button>
 * </UsageGuard>
 *
 * =========================================================
 */

import { ReactNode } from "react"

export default function UsageGuard({
  allowed,
  children,
  message = "Limit reached. Upgrade plan to continue.",
}: {
  allowed: boolean
  children: ReactNode
  message?: string
}) {
  if (allowed) return <>{children}</>

  return (
    <div className="relative opacity-60 cursor-not-allowed">
      {/* block pointer */}
      <div className="absolute inset-0 z-10" />

      {children}

      <p className="text-xs text-red-600 mt-2">
        {message}
      </p>
    </div>
  )
}
