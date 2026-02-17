ï»¿"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function PortfolioSIPAdviceCard() {
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/investments/sip-suggestions", {
      method: "POST",
    })
      .then((r) => r.json())
      .then((j) => setText(j.insights))
  }, [])

  if (!text) return null

  return (
    <Card className="p-4 bg-emerald-50 border-emerald-200 text-sm whitespace-pre-wrap">
      ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â° SIP Suggestions
      <div className="mt-2">{text}</div>
    </Card>
  )
}
