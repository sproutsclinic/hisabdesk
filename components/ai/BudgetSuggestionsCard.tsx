ï»¿"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function BudgetSuggestionsCard() {
  const [text, setText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)

    const res = await fetch("/api/ai/budget-suggestions", {
      method: "POST",
    })

    const json = await res.json()

    setText(json?.suggestions ?? null)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Card className="p-4 bg-blue-50 border-blue-200 text-sm whitespace-pre-wrap space-y-2">
      <p className="font-medium">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ AI Budget Planner</p>

      {loading && "Analyzing spending patterns..."}
      {!loading && text}
    </Card>
  )
}
