"use client"

// ==========================================================
// HisabDesk — Dashboard AI Insights Card
// ----------------------------------------------------------
// PURPOSE
//   Auto AI summary for dashboard metrics
//
//   Shows:
//     ✓ savings advice
//     ✓ expense warnings
//     ✓ quick improvements
//
//   Behavior:
//     • calls /api/ai/insights
//     • auto refresh on mount
//     • lightweight (module AI → cheap tokens)
//
//   This makes AI an INTEGRAL dashboard element,
//   not just a chat feature.
//
//   Usage:
//     <AIInsightsCard />
//
// ==========================================================

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

// ==========================================================
// TYPES
// ==========================================================

interface Props {
  income?: number
  expense?: number
  networth?: number
  savingsRate?: number
}

interface Response {
  insights?: string
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function AIInsightsCard({
  income,
  expense,
  networth,
  savingsRate,
}: Props) {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------
  // FETCH AI SUMMARY
  // --------------------------------------------------------

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        const res = await fetch("/api/ai/insights", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            income,
            expense,
            networth,
            savingsRate,
          }),
        })

        const json: Response = await res.json()

        setText(json.insights || "")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [income, expense, networth, savingsRate])

  // ========================================================
  // UI
  // ========================================================

  return (
    <Card className="p-4 space-y-3">
      <div className="font-semibold text-sm">
        AI Insights
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">
          Generating insights…
        </div>
      ) : text ? (
        <div className="text-sm whitespace-pre-wrap">
          {text}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          No insights available
        </div>
      )}
    </Card>
  )
}
