ï»¿"use client"

/* =========================================================
   Income AI Advice Card
   UI only
   Fetches ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ /api/ai/income-summary
   No business logic
========================================================= */

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface Props {
  totalIncome: number
}

export default function IncomeAIAdviceCard({ totalIncome }: Props) {
  const [advice, setAdvice] = useState<string>("Loading AI insights...")

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/ai/income-summary", {
          method: "POST",
          body: JSON.stringify({ totalIncome }),
        })

        const json = await res.json()

        setAdvice(json?.advice || "No suggestions yet")
      } catch {
        setAdvice("AI insights unavailable")
      }
    }

    load()
  }, [totalIncome])

  return (
    <Card className="p-4 bg-purple-50 border-purple-200 space-y-2">
      <h3 className="text-sm font-medium text-purple-900">
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ AI Income Insights
      </h3>

      <p className="text-sm text-purple-800">{advice}</p>
    </Card>
  )
}
