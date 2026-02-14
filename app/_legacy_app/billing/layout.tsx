"use client"

/**
 * =========================================================
 * Billing Layout (Dedicated Billing Shell)
 * HisabDesk – Billing Section Wrapper
 * =========================================================
 *
 * ROUTE
 *   /billing/*
 *
 * PURPOSE
 * Shared layout for all billing pages:
 *   ✓ summary header
 *   ✓ clean container
 *   ✓ consistent spacing
 *   ✓ upgrade visibility
 *
 * WHY
 * ---------------------------------------------------------
 * Keeps all billing routes consistent:
 *   /billing
 *   /billing/success
 *   /billing/anything-future
 *
 * =========================================================
 *
 * SAFE
 * - layout only
 * - no business logic
 * =========================================================
 */

import { ReactNode } from "react"
import PlanBadge from "@/components/billing/plan-badge"

export default function BillingLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">
            Billing
          </h1>
          <p className="text-xs text-gray-500">
            Manage your subscription & payments
          </p>
        </div>

        <PlanBadge />
      </header>

      {/* content */}
      <main className="p-6 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  )
}
