"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

/*
=========================================================
CA STATS CARDS (Firm Intelligence Layer)
Phase C — Day 15

Adds:
✓ total clients
✓ GST issues count
✓ AIS mismatches
✓ anomalies detected
✓ duplicates detected
✓ overall risk score

Enterprise:
✓ Multi-tenant safe
✓ Aggregates across all client orgs
✓ Read-only analytics
✓ No schema changes

Usage:
<CADashboardStatsCards />
=========================================================
*/

type Stats = {
  clients: number
  gstIssues: number
  aisIssues: number
  anomalies: number
  duplicates: number
}

export default function CADashboardStatsCards() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    clients: 0,
    gstIssues: 0,
    aisIssues: 0,
    anomalies: 0,
    duplicates: 0,
  })

  /* ======================================================
     LOAD ALL CA INTELLIGENCE
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
       GST summary
    -------------------------------------------- */

    const { data: gst } = await supabase
      .from("gst_summary")
      .select("*")
      .in("org_id", orgIds)

    const gstIssues =
      gst?.reduce(
        (s: number, g: any) =>
          s +
          (g.mismatch || 0) +
          (g.missing || 0) +
          (g.partial || 0),
        0
      ) || 0

    /* --------------------------------------------
       Transactions intelligence
    -------------------------------------------- */

    const { data: tx } = await supabase
      .from("transactions")
      .select("meta, source")
      .in("org_id", orgIds)

    let aisIssues = 0
    let anomalies = 0
    let duplicates = 0

    tx?.forEach((t: any) => {
      if (t.meta?.reconciliation_status === "missing")
        aisIssues++

      if (t.meta?.anomaly) anomalies++

      if (
        t.meta?.duplicate_status === "duplicate" ||
        t.meta?.duplicate_status === "suspected"
      )
        duplicates++
    })

    setStats({
      clients: orgIds.length,
      gstIssues,
      aisIssues,
      anomalies,
      duplicates,
    })

    setLoading(false)
  }

  /* ======================================================
     UI
  ====================================================== */

  const riskScore = calculateRisk(stats)

  return (
    <div className="grid gap-4 md:grid-cols-6">
      <Card label="Clients" value={stats.clients} />

      <Card
        label="GST Issues"
        value={stats.gstIssues}
        danger={stats.gstIssues > 0}
      />

      <Card
        label="AIS Mismatch"
        value={stats.aisIssues}
        danger={stats.aisIssues > 0}
      />

      <Card
        label="Anomalies"
        value={stats.anomalies}
        danger={stats.anomalies > 0}
      />

      <Card
        label="Duplicates"
        value={stats.duplicates}
        danger={stats.duplicates > 0}
      />

      <Card
        label="Risk Score"
        value={`${riskScore}%`}
        highlight={riskScore > 40}
      />

      {loading && (
        <p className="col-span-full text-xs text-gray-400">
          Loading firm analytics…
        </p>
      )}
    </div>
  )
}

/* ====================================================== */

function Card({
  label,
  value,
  highlight,
  danger,
}: {
  label: string
  value: string | number
  highlight?: boolean
  danger?: boolean
}) {
  const color = highlight
    ? "bg-black text-white"
    : danger
    ? "bg-red-50 border-red-200 text-red-700"
    : ""

  return (
    <div className={`border rounded-xl p-4 text-center ${color}`}>
      <p className="text-xs opacity-70">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}

/* ====================================================== */

function calculateRisk(s: Stats) {
  const totalIssues =
    s.gstIssues + s.aisIssues + s.anomalies + s.duplicates

  if (!totalIssues) return 0

  return Math.min(100, totalIssues * 2)
}
