ï»¿"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function SavingsAutomationCard() {
  const [amount, setAmount] = useState<number | null>(null)
  const [text, setText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)

    const res = await fetch("/api/ai/savings-automation", {
      method: "POST",
    })

    const json = await res.json()

    setAmount(json.amount)
    setText(json.advice)

    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Card className="p-4 bg-green-50 border-green-200 space-y-2 text-sm whitespace-pre-wrap">
      <p className="font-medium">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â° Smart Savings Automation</p>

      {loading && "Calculating..."}

      {!loading && amount && (
        <>
          <p className="text-lg font-semibold text-green-700">
            Move ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {amount.toLocaleString("en-IN")} to savings
          </p>
          <p>{text}</p>
        </>
      )}
    </Card>
  )
}
