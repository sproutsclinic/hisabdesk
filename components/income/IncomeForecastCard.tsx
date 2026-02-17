ï»¿"use client"

import { useEffect, useState } from "react"

export default function IncomeForecastCard() {
  const [data, setData] = useState<number[]>([])

  useEffect(() => {
    fetch("/api/income/forecast")
      .then((r) => r.json())
      .then((j) => setData(j.data || []))
  }, [])

  if (!data.length) return null

  return (
    <div className="p-4 border rounded-2xl bg-blue-50 space-y-3">

      <h3 className="text-sm font-medium">
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â® Income Forecast
      </h3>

      <div className="grid grid-cols-3 gap-4 text-sm">

        {data.map((v, i) => (
          <div key={i} className="text-center">
            <p className="text-xs text-muted-foreground">
              +{i + 1} Month
            </p>
            <p className="font-semibold text-blue-700">
              ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {v.toLocaleString("en-IN")}
            </p>
          </div>
        ))}

      </div>
    </div>
  )
}
