"use client"

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
        🔮 Income Forecast
      </h3>

      <div className="grid grid-cols-3 gap-4 text-sm">

        {data.map((v, i) => (
          <div key={i} className="text-center">
            <p className="text-xs text-muted-foreground">
              +{i + 1} Month
            </p>
            <p className="font-semibold text-blue-700">
              ₹ {v.toLocaleString("en-IN")}
            </p>
          </div>
        ))}

      </div>
    </div>
  )
}
