ï»¿"use client"

import { useEffect, useState } from "react"

export default function IncomeInvestmentCard() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/investments/sip-suggestions")
      .then((r) => r.json())
      .then((j) => setData(j.data))
  }, [])

  if (!data) return null

  function Row(label: string, value: number) {
    return (
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">
          ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {value.toLocaleString("en-IN")}
        </span>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-2xl bg-violet-50 space-y-3">

      <h3 className="text-sm font-medium">
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã¢â‚¬Â¹ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â  Smart SIP Suggestions
      </h3>

      <p className="text-xs text-muted-foreground">
        From ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {data.autosave.toLocaleString("en-IN")} surplus
      </p>

      {Row("Equity / Mutual Funds", data.equity)}
      {Row("Debt / FD / Bonds", data.debt)}
      {Row("Gold", data.gold)}

      <button className="w-full bg-black text-white rounded-lg p-2 text-sm mt-2">
        Start Investing ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢
      </button>

    </div>
  )
}
