"use client"

/**
 * =========================================================
 * CA ACTIVITY FEED (Firm Timeline)
 * Phase C — Day 20
 * Route: /ca/activity
 *
 * PURPOSE
 * Firm-wide activity visibility
 *
 * Shows:
 * ✓ GST sync runs
 * ✓ AIS imports
 * ✓ OCR uploads
 * ✓ bulk exports
 * ✓ reconciliations
 * ✓ anomaly/duplicate scans
 *
 * Source:
 * audit_logs table (already exists)
 *
 * WHY
 * Gives CA a single operational timeline
 * “What happened across all clients today?”
 *
 * SAFE
 * - read only
 * - no schema changes
 * =========================================================
 */

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

/* ====================================================== */

type Log = {
  id: string
  org_id: string | null
  action: string
  created_at: string
  meta?: any
}

type Org = {
  id: string
  name: string
}

/* ====================================================== */

export default function CAActivityPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [orgs, setOrgs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  /* ======================================================
     INIT
  ====================================================== */

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    /* --------------------------------------------
       ORGS
    -------------------------------------------- */

    const { data: members } = await supabase
      .from("organization_members")
      .select("organizations(id,name)")
      .eq("user_id", user.id)

    const orgMap: Record<string, string> = {}

    members?.forEach((m: any) => {
      if (m.organizations)
        orgMap[m.organizations.id] = m.organizations.name
    })

    setOrgs(orgMap)

    const orgIds = Object.keys(orgMap)

    /* --------------------------------------------
       AUDIT LOGS
    -------------------------------------------- */

    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .or(
        `org_id.is.null,org_id.in.(${orgIds.join(",")})`
      )
      .order("created_at", { ascending: false })
      .limit(300)

    setLogs(data || [])
    setLoading(false)
  }

  /* ======================================================
     FILTER
  ====================================================== */

  const filtered = useMemo(() => {
    if (filter === "all") return logs
    return logs.filter((l) => l.action.includes(filter))
  }, [logs, filter])

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Activity Feed
        </h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="gst">GST</option>
          <option value="ais">AIS</option>
          <option value="ocr">OCR</option>
          <option value="duplicate">Duplicate</option>
          <option value="anomaly">Anomaly</option>
          <option value="export">Export</option>
        </select>
      </div>

      {/* LIST */}
      {loading && (
        <p className="text-sm text-gray-400">Loading…</p>
      )}

      <div className="space-y-3">
        {filtered.map((log) => (
          <Row
            key={log.id}
            log={log}
            orgName={
              log.org_id
                ? orgs[log.org_id]
                : "System"
            }
          />
        ))}

        {!loading && filtered.length === 0 && (
          <p className="text-sm text-gray-400">
            No activity yet
          </p>
        )}
      </div>
    </div>
  )
}

/* ====================================================== */

function Row({
  log,
  orgName,
}: {
  log: Log
  orgName?: string
}) {
  const color = colorFor(log.action)

  return (
    <div className="border rounded-xl bg-white p-4 shadow-sm flex items-start justify-between gap-4">
      <div>
        <p className={`text-sm font-medium ${color}`}>
          {formatAction(log.action)}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          {orgName}
        </p>

        {log.meta && (
          <pre className="text-xs text-gray-400 mt-2 whitespace-pre-wrap">
            {JSON.stringify(log.meta, null, 2)}
          </pre>
        )}
      </div>

      <span className="text-xs text-gray-400">
        {new Date(log.created_at).toLocaleString("en-IN")}
      </span>
    </div>
  )
}

/* ====================================================== */

function formatAction(a: string) {
  return a
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function colorFor(a: string) {
  if (a.includes("gst")) return "text-green-600"
  if (a.includes("ais")) return "text-blue-600"
  if (a.includes("anomaly")) return "text-red-600"
  if (a.includes("duplicate")) return "text-yellow-600"
  if (a.includes("ocr")) return "text-purple-600"
  return "text-gray-800"
}
