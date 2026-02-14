"use client"

// ==========================================================
// HisabDesk — AI Usage Badge Component
// ----------------------------------------------------------
// PURPOSE
//   Small reusable AI cost indicator for header/navbar
//
//   Shows:
//     ✓ remaining budget
//     ✓ status color
//
//   Used in:
//     - Top navbar
//     - Profile header
//     - Admin bar
//
//   Uses:
//     useAIUsage hook
//
//   Lightweight + auto refresh safe
// ==========================================================

import { useAIUsage } from "@/lib/hooks/useAIUsage"

// ==========================================================
// UI HELPERS
// ==========================================================

function getColor(status: string) {
  if (status === "healthy") return "bg-green-100 text-green-700"
  if (status === "warning") return "bg-yellow-100 text-yellow-700"
  return "bg-red-100 text-red-700"
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function AIUsageBadge() {
  const { data, loading } = useAIUsage()

  if (loading || !data) return null

  const status = data.summary.status
  const remaining = data.summary.remainingBudget

  return (
    <div
      className={`
        px-3 py-1 rounded-full text-xs font-medium
        ${getColor(status)}
      `}
      title={`AI remaining budget: $${remaining}`}
    >
      AI ${remaining}$
    </div>
  )
}
