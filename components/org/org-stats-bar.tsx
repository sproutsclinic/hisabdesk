"use client"

/**
 * =========================================================
 * Organization Stats Bar (Workspace KPIs Header)
 * HisabDesk – Phase C Day 12
 * =========================================================
 *
 * PURPOSE
 * Shows quick KPIs for current organization:
 *
 *   ✓ Income
 *   ✓ Expenses
 *   ✓ Profit
 *   ✓ GST Payable
 *
 * WHY
 * ---------------------------------------------------------
 * Every CA / founder wants numbers instantly visible.
 * Removes 3–4 clicks per check.
 *
 * Similar to:
 *   Stripe dashboard header stats
 *   Zoho Books summary row
 *
 * =========================================================
 *
 * CONNECTS
 *   income
 *   expenses
 *   gst_summary
 *
 * USAGE
 *
 * In:
 * app/org/[orgId]/layout.tsx
 *
 * import OrgStatsBar from "@/components/org/org-stats-bar"
 *
 * <OrgStatsBar orgId={orgId} />
 *
 * Place under header.
 *
 * =========================================================
 *
 * SAFE
 * - read only
 * - client only
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

/* =========================================================
   TYPES
========================================================= */

type Stats = {
  income: number
  expenses: number
  profit: number
  gst: number
}

/* =========================================================
   COMPONENT
========================================================= */

export default function OrgStatsBar({
  orgId,
}: {
  orgId: string
}) {
  const [stats, setStats] = useState<Stats>({
    income: 0,
    expenses: 0,
    profit: 0,
    gst: 0,
  })

  /* ======================================================
     LOAD STATS
  ====================================================== */

  useEffect(() => {
    load()
  }, [orgId])

  async function load() {
    const [incRes, expRes, gstRes] = await Promise.all([
      supabase
        .from("income")
        .select("amount")
        .eq("org_id", orgId),

      supabase
        .from("expenses")
        .select("amount")
        .eq("org_id", orgId),

      supabase
        .from("gst_summary")
        .select("net_payable")
        .eq("org_id", orgId),
    ])

    const income =
      incRes.data?.reduce(
        (s, r) => s + Number(r.amount),
        0
      ) || 0

    const expenses =
      expRes.data?.reduce(
        (s, r) => s + Number(r.amount),
        0
      ) || 0

    const gst =
      gstRes.data?.reduce(
        (s, r) => s + Number(r.net_payable),
        0
      ) || 0

    setStats({
      income,
      expenses,
      profit: income - expenses,
      gst,
    })
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card label="Income" value={stats.income} />

      <Card label="Expenses" value={stats.expenses} />

      <Card
        label="Profit"
        value={stats.profit}
        highlight={stats.profit >= 0}
      />

      <Card
        label="GST Payable"
        value={stats.gst}
        warn={stats.gst > 0}
      />
    </div>
  )
}

/* =========================================================
   CARD
========================================================= */

function Card({
  label,
  value,
  highlight,
  warn,
}: {
  label: string
  value: number
  highlight?: boolean
  warn?: boolean
}) {
  return (
    <div
      className={`
        border rounded-xl p-4 text-center bg-white
        ${highlight ? "border-green-400" : ""}
        ${warn ? "border-red-400" : ""}
      `}
    >
      <p className="text-xs text-gray-500 mb-1">
        {label}
      </p>

      <p className="font-semibold text-lg">
        ₹ {value.toLocaleString()}
      </p>
    </div>
  )
}
