ï»¿"use client"

import { useEffect, useState } from "react"

export default function IncomeAutoSaveCard() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/income/autosave")
      .then((r) => r.json())
      .then((j) => setData(j.data))
  }, [])

  if (!data) return null

  return (
    <div className="p-4 border rounded-2xl bg-emerald-50 space-y-2">

      <h3 className="text-sm font-medium">
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â° Smart Auto-Save
      </h3>

      <p className="text-xs text-muted-foreground">
        Suggested saving ({data.rate * 100}% rule)
      </p>

      <p className="text-xl font-semibold text-emerald-700">
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {data.suggested.toLocaleString("en-IN")}
      </p>

      <p className="text-xs text-muted-foreground">
        From ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {data.total.toLocaleString("en-IN")} income
      </p>

    </div>
  )
}
