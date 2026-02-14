"use client"

/**
 * =========================================================
 * CA SYSTEM HEALTH PAGE (Firm Ops Monitor)
 * Phase C — Day 21
 * Route: /ca/system-health
 *
 * PURPOSE
 * Operational dashboard for CA / Admin
 *
 * Shows:
 * ✓ total clients
 * ✓ total transactions
 * ✓ total GST invoices
 * ✓ audit logs count
 * ✓ storage usage (docs)
 * ✓ recent failures
 *
 * WHY
 * Gives confidence before filing deadlines
 * “Is system healthy today?”
 *
 * SAFE
 * - read only
 * - no schema changes
 * - production safe queries only
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

/* ====================================================== */

type Metrics = {
  clients: number
  transactions: number
  gstInvoices: number
  auditLogs: number
  docs: number
  failures: number
}

/* ====================================================== */

export default function CASystemHealthPage() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<Metrics>({
    clients: 0,
    transactions: 0,
    gstInvoices: 0,
    auditLogs: 0,
    docs: 0,
    failures: 0,
  })

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
      .select("org_id")
      .eq("user_id", user.id)

    const orgIds =
      members?.map((m: any) => m.org_id) || []

    if (!orgIds.length) {
      setLoading(false)
      return
    }

    /* --------------------------------------------
       PARALLEL METRICS
    -------------------------------------------- */

    const [
      txRes,
      gstRes,
      auditRes,
      docsCount,
    ] = await Promise.all([
      supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .in("org_id", orgIds),

      supabase
        .from("gst_invoices")
        .select("id", { count: "exact", head: true })
        .in("org_id", orgIds),

      supabase
        .from("audit_logs")
        .select("id, action", { count: "exact" })
        .or(`org_id.is.null,org_id.in.(${orgIds.join(",")})`),

      countDocs(orgIds),
    ])

    const failures =
      auditRes.data?.filter((l: any) =>
        l.action?.includes("failed")
      ).length || 0

    setMetrics({
      clients: orgIds.length,
      transactions: txRes.count || 0,
      gstInvoices: gstRes.count || 0,
      auditLogs: auditRes.count || 0,
      docs: docsCount,
      failures,
    })

    setLoading(false)
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          System Health
        </h1>
        <p className="text-sm text-gray-500">
          Operational overview of your firm
        </p>
      </div>

      {loading && (
        <p className="text-sm text-gray-400">Checking…</p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card label="Clients" value={metrics.clients} />

        <Card
          label="Transactions"
          value={format(metrics.transactions)}
        />

        <Card
          label="GST Invoices"
          value={format(metrics.gstInvoices)}
        />

        <Card
          label="Audit Logs"
          value={format(metrics.auditLogs)}
        />

        <Card
          label="Documents"
          value={format(metrics.docs)}
        />

        <Card
          label="Failures"
          value={metrics.failures}
          danger={metrics.failures > 0}
        />
      </div>
    </div>
  )
}

/* ====================================================== */

async function countDocs(orgIds: string[]) {
  let total = 0

  for (const id of orgIds) {
    const { data } = await supabase.storage
      .from("ca-docs")
      .list(id)

    total += data?.length || 0
  }

  return total
}

/* ====================================================== */

function Card({
  label,
  value,
  danger,
}: {
  label: string
  value: number | string
  danger?: boolean
}) {
  return (
    <div
      className={`border rounded-xl p-5 text-center bg-white ${
        danger ? "border-red-300 text-red-600" : ""
      }`}
    >
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}

function format(n: number) {
  return new Intl.NumberFormat("en-IN").format(n)
}
