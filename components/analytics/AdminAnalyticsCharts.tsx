"use client"

import { useEffect, useState } from "react"

type Row = {
  event: string
  count: number
}

export default function AdminAnalyticsCharts() {
  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    fetch("/api/admin/analytics/summary")
      .then((r) => r.json())
      .then((d) => setRows(d || []))
  }, [])

  const max = Math.max(...rows.map((r) => r.count), 1)

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <h2 className="text-sm font-semibold mb-6">Event Activity</h2>

      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.event}>
            <div className="flex justify-between text-xs mb-1">
              <span className="capitalize">{row.event.replaceAll("_", " ")}</span>
              <span className="font-semibold">{row.count}</span>
            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all"
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
