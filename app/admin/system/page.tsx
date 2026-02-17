ï»¿"use client"

/**
 * =========================================================
 * System Health Dashboard (Admin) ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â FINAL ENTERPRISE VERSION
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Observability + Metrics + Safe Polling
 * =========================================================
 *
 * FEATURES
 * ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ health checks (DB/Storage/Auth/etc)
 * ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ safe polling (no overlapping calls)
 * ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ manual refresh
 * ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ last checked time
 * ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ crash-safe try/catch
 * ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ enterprise metrics (users, orgs, MRR, storage)
 *
 * CONNECTS TO
 *   lib/system/health-monitor.ts
 *   lib/system/metrics-aggregator.ts
 *
 * SAFE
 * - page only
 * - does not modify any other files
 * =========================================================
 */

import { useEffect, useState } from "react"
import { getSystemHealth } from "@/lib/system/health-monitor"
import { getSystemMetrics } from "@/lib/system/metrics-aggregator"

/* =========================================================
   TYPES
========================================================= */

type Check = {
  name: string
  status: "ok" | "warn" | "fail"
  latency?: number
  message?: string
}

type Metrics = {
  users: number
  activeUsers7d: number
  organizations: number
  proUsers: number
  mrr: number
  transactions: number
  storageMB: number
}

/* =========================================================
   PAGE
========================================================= */

export default function AdminSystemPage() {
  const [loading, setLoading] = useState(true)

  const [checks, setChecks] = useState<Check[]>([])
  const [status, setStatus] = useState("ok")

  const [metrics, setMetrics] = useState<Metrics | null>(null)

  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  /* ======================================================
     LOAD (SAFE)
  ====================================================== */

  async function load() {
    try {
      setLoading(true)

      /* ---------- health ---------- */
      const health = await getSystemHealth()
      setChecks(health.checks)
      setStatus(health.status)

      /* ---------- metrics ---------- */
      const m = await getSystemMetrics()
      setMetrics(m)

      setLastChecked(new Date())
    } catch {
      /* NEVER crash admin panel */
      setChecks([
        {
          name: "system",
          status: "fail",
          message: "Health check failed",
        },
      ])
      setStatus("down")
    } finally {
      setLoading(false)
    }
  }

  /* ======================================================
     AUTO REFRESH (NO OVERLAP)
  ====================================================== */

  useEffect(() => {
    load()

    const t = setInterval(() => {
      if (!loading) load()
    }, 10000)

    return () => clearInterval(t)
  }, [loading])

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-6 space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            System Health
          </h1>

          <p className="text-sm text-gray-500">
            Infrastructure & reliability status
          </p>

          {lastChecked && (
            <p className="text-xs text-gray-400 mt-1">
              Last checked:{" "}
              {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="border px-3 py-1 rounded-lg text-sm"
          >
            Refresh
          </button>

          <StatusBadge status={status} />
        </div>
      </div>

      {loading && <p>Checking system...</p>}

      {/* ==================================================
         HEALTH CHECKS
      ================================================== */}
      <div className="grid grid-cols-2 gap-4">
        {checks.map((c) => (
          <Card key={c.name} check={c} />
        ))}
      </div>

      {/* ==================================================
         BUSINESS METRICS
      ================================================== */}
      {metrics && (
        <div className="grid grid-cols-4 gap-4 pt-6">
          <MetricCard label="Users" value={metrics.users} />
          <MetricCard
            label="Active (7d)"
            value={metrics.activeUsers7d}
          />
          <MetricCard
            label="Organizations"
            value={metrics.organizations}
          />
          <MetricCard
            label="Pro Users"
            value={metrics.proUsers}
          />
          <MetricCard
            label="MRR"
            value={`ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ${metrics.mrr.toLocaleString()}`}
          />
          <MetricCard
            label="Transactions"
            value={metrics.transactions}
          />
          <MetricCard
            label="Storage Used"
            value={`${metrics.storageMB} MB`}
          />
        </div>
      )}
    </div>
  )
}

/* ======================================================
   COMPONENTS
====================================================== */

function StatusBadge({ status }: { status: string }) {
  const map: any = {
    ok: "bg-green-500",
    degraded: "bg-yellow-500",
    down: "bg-red-500",
  }

  return (
    <span
      className={`px-4 py-2 text-white rounded-lg text-sm ${map[status]}`}
    >
      {status.toUpperCase()}
    </span>
  )
}

function Card({ check }: { check: Check }) {
  const color =
    check.status === "ok"
      ? "border-green-400"
      : check.status === "warn"
      ? "border-yellow-400"
      : "border-red-500"

  return (
    <div className={`border rounded-xl p-4 ${color}`}>
      <div className="flex justify-between items-center">
        <p className="font-medium capitalize">
          {check.name}
        </p>

        <span className="text-xs uppercase">
          {check.status}
        </span>
      </div>

      {check.latency && (
        <p className="text-sm text-gray-500">
          {check.latency} ms
        </p>
      )}

      {check.message && (
        <p className="text-xs text-gray-500 mt-2">
          {check.message}
        </p>
      )}
    </div>
  )
}

function MetricCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="border rounded-xl p-5 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
