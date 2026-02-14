"use client"

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
        💰 Smart Auto-Save
      </h3>

      <p className="text-xs text-muted-foreground">
        Suggested saving ({data.rate * 100}% rule)
      </p>

      <p className="text-xl font-semibold text-emerald-700">
        ₹ {data.suggested.toLocaleString("en-IN")}
      </p>

      <p className="text-xs text-muted-foreground">
        From ₹ {data.total.toLocaleString("en-IN")} income
      </p>

    </div>
  )
}
