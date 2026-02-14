"use client"

/* =========================================================
   HisabDesk — Income AI Insights Card
   ---------------------------------------------------------
   PURPOSE
   - fetch AI insights for income
   - display compact bullets
   - thin client only
   - NO calculations
   - NO OpenAI direct
   - fetch only

   FLOW
   UI → /api/ai/income-summary → AI
========================================================= */

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function IncomeAIInsightsCard() {
  const [text, setText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  /* =======================================================
     FETCH ONLY
  ======================================================= */

  async function load() {
    try {
      setLoading(true)

      const res = await fetch("/api/ai/income-summary", {
        method: "POST",
      })

      const json = await res.json()

      setText(json?.insights ?? null)
    } catch {
      setText("AI temporarily unavailable")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  /* =======================================================
     UI
  ======================================================= */

  return (
    <Card className="p-4 rounded-2xl bg-blue-50 border-blue-200">
      <h3 className="text-sm font-medium mb-2">
        🤖 AI Income Insights
      </h3>

      {loading && (
        <p className="text-sm text-muted-foreground">
          Analyzing income stability...
        </p>
      )}

      {!loading && text && (
        <pre className="text-sm whitespace-pre-wrap leading-relaxed">
          {text}
        </pre>
      )}

      {!loading && !text && (
        <p className="text-sm text-muted-foreground">
          No insights available
        </p>
      )}
    </Card>
  )
}
