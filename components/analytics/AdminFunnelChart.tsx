ï»¿"use client"

import { useEffect, useState } from "react"

type Row = {
  step: string
  count: number
  conversion: number
}

export default function AdminFunnelChart() {
  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    fetch("/api/admin/analytics/funnel")
      .then((r) => r.json())
      .then((d) => setRows(d || []))
  }, [])

  const max = Math.max(...rows.map((r) => r.count), 1)

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <h2 className="text-sm font-semibold mb-6">Conversion Funnel</h2>

      <div className="space-y-5">
        {rows.map((row) => (
          <div key={row.step}>
            <div className="flex justify-between text-xs mb-1">
              <span className="capitalize">
                {row.step.replaceAll("_", " ")}
              </span>

              <span className="font-semibold">
                {row.count} ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ {row.conversion}%
              </span>
            </div>

            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
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
