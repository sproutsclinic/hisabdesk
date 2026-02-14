"use client"

// ==========================================================
// HisabDesk — AI Usage Card Component
// ----------------------------------------------------------
// PURPOSE
//   Reusable compact card showing AI usage summary
//
//   Designed for:
//     ✓ Dashboard
//     ✓ Profile overview
//     ✓ Settings page
//
//   Difference vs full page:
//     • small summary only
//     • no table
//
//   Uses:
//     useAIUsage hook
//
// ==========================================================

import { Card } from "@/components/ui/card"
import { useAIUsage } from "@/lib/hooks/useAIUsage"

// ==========================================================
// HELPERS
// ==========================================================

function statusColor(status: string) {
  if (status === "healthy") return "text-green-600"
  if (status === "warning") return "text-yellow-600"
  return "text-red-600"
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function AIUsageCard() {
  const { data, loading } = useAIUsage()

  if (loading) {
    return <Card className="p-4">Loading AI usage…</Card>
  }

  if (!data) return null

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">AI Usage</h3>

        <span
          className={`text-xs font-medium ${statusColor(
            data.summary.status
          )}`}
        >
          {data.summary.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">Cost</p>
          <p className="font-medium">${data.summary.totalCost}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Remaining</p>
          <p className="font-medium">
            ${data.summary.remainingBudget}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">Tokens</p>
          <p className="font-medium">
            {data.summary.totalTokens}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">Projected</p>
          <p className="font-medium">
            ${data.summary.projectedMonthlyCost}
          </p>
        </div>
      </div>
    </Card>
  )
}
