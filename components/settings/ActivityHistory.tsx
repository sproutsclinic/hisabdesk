ï»¿"use client"

import { useEffect, useState } from "react"

type Row = {
  id: string
  action: string
  user_id: string | null
  meta: any
  created_at: string
}

export default function ActivityHistory() {
  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    fetch("/api/admin/activity")
      .then((r) => r.json())
      .then((d) => setRows(d || []))
  }, [])

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <h2 className="text-sm font-semibold mb-4">Activity History</h2>

      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-white border-b">
            <tr>
              <th className="text-left py-2">Action</th>
              <th className="text-left py-2">User</th>
              <th className="text-left py-2">Time</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b last:border-none">
                <td className="py-2 capitalize">
                  {row.action.replaceAll("_", " ")}
                </td>

                <td className="py-2 text-gray-500">
                  {row.user_id?.slice(0, 8) || "-"}
                </td>

                <td className="py-2 text-gray-500">
                  {new Date(row.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!rows.length && (
          <p className="text-xs text-gray-500 mt-3">No activity yet</p>
        )}
      </div>
    </div>
  )
}
