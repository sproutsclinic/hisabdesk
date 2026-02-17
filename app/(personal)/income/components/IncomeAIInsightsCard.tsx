ï»¿"use client"

/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Income AI Insights Card
   ---------------------------------------------------------
   PURPOSE
   - fetch AI insights for income
   - display compact bullets
   - thin client only
   - NO calculations
   - NO OpenAI direct
   - fetch only

   FLOW
   UI ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ /api/ai/income-summary ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ AI
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
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ AI Income Insights
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
