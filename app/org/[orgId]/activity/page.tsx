"use client"

/**
 * =========================================================
 * Organization Activity History
 * HisabDesk – Enterprise Audit UI
 * =========================================================
 *
 * ROUTE
 *   /org/[orgId]/activity
 *
 * PURPOSE
 * Human-readable audit trail for org:
 *
 *   ✓ who did what
 *   ✓ when
 *   ✓ entity affected
 *   ✓ finance actions
 *   ✓ admin actions
 *
 * CONNECTS TO
 *   activity_logs table
 *   lib/audit/activity-log.ts
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Log = {
  id: string
  action: string
  entity?: string
  entity_id?: string
  meta?: any
  created_at: string
  profiles?: {
    email?: string
  }
}

export default function OrgActivityPage() {
  const params = useParams()
  const orgId = params?.orgId as string

  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  /* ======================================================
     LOAD
  ====================================================== */

  async function load() {
    setLoading(true)

    const { data } = await supabase
      .from("activity_logs")
      .select(
        `
        *,
        profiles(email)
      `
      )
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(100)

    setLogs(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [orgId])

  /* ======================================================
     FORMATTERS
  ====================================================== */

  function formatAction(a: string) {
    return a.replace(/_/g, " ")
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleString()
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">
          Activity History
        </h2>
        <p className="text-sm text-gray-500">
          Track all organization actions
        </p>
      </div>

      {loading && <p>Loading...</p>}

      <div className="border rounded-xl divide-y">
        {logs.map((l) => (
          <div
            key={l.id}
            className="p-4 flex justify-between items-start text-sm"
          >
            <div className="space-y-1">
              <p className="font-medium capitalize">
                {formatAction(l.action)}
              </p>

              <p className="text-gray-500">
                {l.entity && (
                  <>
                    {l.entity} • {l.entity_id}
                  </>
                )}
              </p>

              {l.meta &&
                Object.keys(l.meta).length > 0 && (
                  <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto max-w-md">
                    {JSON.stringify(l.meta, null, 2)}
                  </pre>
                )}
            </div>

            <div className="text-right text-xs text-gray-500">
              <p>{l.profiles?.email || "system"}</p>
              <p>{formatDate(l.created_at)}</p>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <p className="p-4 text-gray-500 text-sm">
            No activity yet
          </p>
        )}
      </div>
    </div>
  )
}
