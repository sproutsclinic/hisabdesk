"use client"

import { useEffect, useState } from "react"

type Data = {
  signups: number
  paid: number
  conversionRate: number
}

export default function AdminConversionCard() {
  const [data, setData] = useState<Data>({
    signups: 0,
    paid: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    fetch("/api/admin/analytics/conversion")
      .then((r) => r.json())
      .then((d) => setData(d))
  }, [])

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <h2 className="text-sm font-semibold mb-6">Conversion Stats</h2>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500">Signups</p>
          <p className="text-lg font-semibold">{data.signups}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Paid Users</p>
          <p className="text-lg font-semibold">{data.paid}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Conversion</p>
          <p className="text-lg font-semibold">
            {data.conversionRate}%
          </p>
        </div>
      </div>
    </div>
  )
}
