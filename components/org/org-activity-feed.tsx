"use client"

/**
 * =========================================================
 * Organization Activity Feed (Audit + Timeline)
 * HisabDesk – Phase C Day 13
 * =========================================================
 *
 * PURPOSE
 * Shows real-time activity inside org:
 *
 *   ✓ income added
 *   ✓ expense added
 *   ✓ GST sync
 *   ✓ reconciliation
 *   ✓ member changes
 *
 * WHY
 * ---------------------------------------------------------
 * Enterprise requirement:
 *   "Who did what & when?"
 *
 * Helps:
 *   ✓ CA tracking
 *   ✓ audit trails
 *   ✓ debugging
 *   ✓ trust
 *
 * =========================================================
 *
 * CONNECTS
 *   audit_logs  (recommended)
 *
 * If audit_logs doesn't exist,
 * safely falls back to recent income/expense activity.
 *
 * =========================================================
 *
 * USAGE
 *
 * <OrgActivityFeed orgId={orgId} />
 *
 * Place:
 *   dashboard sidebar OR bottom section
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

type Activity = {
  id: string
  message: string
  created_at: string
}

/* =========================================================
   COMPONENT
========================================================= */

export default function OrgActivityFeed({
  orgId,
}: {
  orgId: string
}) {
  const [rows, setRows] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  /* ======================================================
     LOAD
  ====================================================== */

  useEffect(() => {
    load()

    const t = setInterval(load, 10000)
    return () => clearInterval(t)
  }, [orgId])

  async function load() {
    setLoading(true)

    /* ----------------------------------------------------
       1️⃣ try audit_logs first (enterprise)
    ---------------------------------------------------- */

    const { data: audit } = await supabase
      .from("audit_logs")
      .select("id, action, created_at")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(10)

    if (audit && audit.length) {
      setRows(
        audit.map((a: any) => ({
          id: a.id,
          message: a.action,
          created_at: a.created_at,
        }))
      )
      setLoading(false)
      return
    }

    /* ----------------------------------------------------
       2️⃣ fallback (income/expense)
    ---------------------------------------------------- */

    const [inc, exp] = await Promise.all([
      supabase
        .from("income")
        .select("id, amount, created_at")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("expenses")
        .select("id, amount, created_at")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
        .limit(5),
    ])

    const incomeRows =
      inc.data?.map((r) => ({
        id: r.id,
        message: `Income added ₹ ${r.amount}`,
        created_at: r.created_at,
      })) || []

    const expenseRows =
      exp.data?.map((r) => ({
        id: r.id,
        message: `Expense added ₹ ${r.amount}`,
        created_at: r.created_at,
      })) || []

    const merged = [...incomeRows, ...expenseRows]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      )
      .slice(0, 10)

    setRows(merged)
    setLoading(false)
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="border rounded-xl bg-white p-4">
      <h3 className="text-sm font-medium mb-3">
        Activity
      </h3>

      {loading && (
        <p className="text-xs text-gray-400">
          Loading...
        </p>
      )}

      {!loading && rows.length === 0 && (
        <p className="text-xs text-gray-400">
          No recent activity
        </p>
      )}

      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex justify-between text-xs border-b pb-2"
          >
            <span>{r.message}</span>
            <span className="text-gray-400">
              {new Date(
                r.created_at
              ).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
