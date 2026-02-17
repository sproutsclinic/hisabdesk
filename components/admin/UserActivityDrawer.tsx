ï»¿"use client"

import { useEffect, useState } from "react"

type Row = {
  id: string
  type: "audit" | "event"
  action?: string
  event?: string
  created_at: string
}

export default function UserActivityDrawer({
  userId,
  open,
  onClose,
}: {
  userId: string | null
  open: boolean
  onClose: () => void
}) {
  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    if (!userId || !open) return

    fetch(`/api/admin/users/activity?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setRows(d || []))
  }, [userId, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">User Activity</h2>
          <button onClick={onClose} className="text-xs">
            ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {rows.map((row) => (
            <div
              key={row.id}
              className="border rounded-lg p-3 bg-gray-50"
            >
              <p className="font-medium capitalize">
                {(row.action || row.event || "").replaceAll("_", " ")}
              </p>

              <p className="text-gray-500 mt-1">
                {new Date(row.created_at).toLocaleString()}
              </p>
            </div>
          ))}

          {!rows.length && (
            <p className="text-gray-500">No activity</p>
          )}
        </div>
      </div>
    </div>
  )
}
