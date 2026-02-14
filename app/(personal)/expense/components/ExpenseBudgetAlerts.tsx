"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function ExpenseBudgetAlerts() {
  const [alerts, setAlerts] = useState<any[]>([])

  async function load() {
    const res = await fetch("/api/expense/budget-alerts")
    const json = await res.json()
    setAlerts(json.data || [])
  }

  useEffect(() => {
    load()
  }, [])

  if (!alerts.length) return null

  return (
    <div className="space-y-2">
      {alerts.map((a, i) => (
        <Card
          key={i}
          className={`
            p-4 text-sm
            ${
              a.type === "over"
                ? "bg-red-50 border-red-300 text-red-700"
                : "bg-amber-50 border-amber-300 text-amber-700"
            }
          `}
        >
          {a.type === "over" ? "🚨 Over budget" : "⚠️ Near limit"} —{" "}
          {a.category}

          <div className="text-xs mt-1">
            ₹ {a.spent.toLocaleString("en-IN")} / ₹{" "}
            {a.limit.toLocaleString("en-IN")} ({a.percent}%)
          </div>
        </Card>
      ))}
    </div>
  )
}
