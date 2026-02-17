ï»¿"use client"

/**
 * =========================================================
 * Usage Guard (Client-side Soft Blocker)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Billing Enforcement UX
 * =========================================================
 *
 * PURPOSE
 * Prevent user actions when limits reached.
 *
 * This is UX layer ONLY.
 * Server still enforces limits securely.
 *
 * Shows:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ disabled state
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ upgrade message
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
