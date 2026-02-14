"use client"

/**
 * =========================================================
 * Admin Request Logs (API Traffic Monitor)
 * HisabDesk – Enterprise Security Dashboard
 * =========================================================
 *
 * ROUTE
 *   /admin/requests
 *
 * PURPOSE
 * View system/API traffic:
 *
 *   ✓ which endpoints are hit
 *   ✓ by which user
 *   ✓ IP address
 *   ✓ latency
 *   ✓ status codes
 *
 * WHY IMPORTANT
 *   ✓ detect abuse
 *   ✓ debug slow APIs
 *   ✓ audit admin activity
 *   ✓ webhook troubleshooting
 *
 * CONNECTS TO
 *   request_logs table
 *   lib/security/request-logger.ts
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Log = {
  id: string
  method: string
  path: string
  ip: string
  status: number
  latency: number
  created_at: string
  user_id?: string | null
}

export default function AdminRequestsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  /* ======================================================
     LOAD
  ====================================================== */

  async function load() {
    setLoading(true)

    const { data } = await supabase
      .from("request_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)

    setLogs(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  /* ======================================================
     HELPERS
  ====================================================== */

  function statusColor(s: number) {
    if (s >= 500) return "text-red-600"
    if (s >= 400) return "text-yellow-600"
    return "text-green-600"
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Request Logs
          </h1>
          <p className="text-sm text-gray-500">
            API traffic & security monitoring
          </p>
        </div>

        <button
          onClick={load}
          className="border px-3 py-1 rounded-lg text-sm"
        >
          Refresh
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <div className="border rounded-xl overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Method</th>
              <th className="p-3">Path</th>
              <th className="p-3">Status</th>
              <th className="p-3">Latency</th>
              <th className="p-3">IP</th>
              <th className="p-3">User</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="p-3 text-xs text-gray-500">
                  {new Date(l.created_at).toLocaleString()}
                </td>

                <td className="p-3 font-medium">
                  {l.method}
                </td>

                <td className="p-3 font-mono text-xs">
                  {l.path}
                </td>

                <td
                  className={`p-3 font-medium ${statusColor(
                    l.status
                  )}`}
                >
                  {l.status}
                </td>

                <td className="p-3">
                  {l.latency} ms
                </td>

                <td className="p-3 text-xs text-gray-500">
                  {l.ip}
                </td>

                <td className="p-3 text-xs text-gray-500">
                  {l.user_id || "-"}
                </td>
              </tr>
            ))}

            {!loading && logs.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-4 text-center text-gray-500"
                >
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
