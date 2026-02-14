"use client"

// ==========================================================
// HisabDesk — AI Usage Chart
// ----------------------------------------------------------
// PURPOSE
//   Visual module-wise token usage bar chart
//
//   Used in:
//     ✓ Profile → AI Usage page
//     ✓ Admin dashboard
//
//   Lightweight:
//     ✓ no chart libraries
//     ✓ pure Tailwind bars
//     ✓ zero bundle bloat
//
//   Uses:
//     useAIUsage hook
//
// ==========================================================

import { useAIUsage } from "@/lib/hooks/useAIUsage"
import { Card } from "@/components/ui/card"

// ==========================================================
// COMPONENT
// ==========================================================

export default function AIUsageChart() {
  const { data, loading } = useAIUsage()

  if (loading) {
    return <Card className="p-4">Loading usage chart…</Card>
  }

  if (!data || !data.modules.length) return null

  const max = Math.max(...data.modules.map((m) => m.tokens))

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold">AI Usage by Module</h3>

      <div className="space-y-3">
        {data.modules.map((m) => {
          const width =
            max === 0 ? 0 : (m.tokens / max) * 100

          return (
            <div key={m.module} className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{m.module}</span>
                <span>
                  {m.tokens} tokens • ${m.cost}
                </span>
              </div>

              <div className="w-full h-2 bg-muted rounded-full">
                <div
                  className="h-2 bg-primary rounded-full transition-all"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
