"use client"

/**
 * =========================================================
 * CA Tasks & Compliance Tracker
 * HisabDesk – CA Productivity Layer
 * =========================================================
 *
 * ROUTE
 *   /ca/tasks
 *
 * PURPOSE
 * Daily working screen for CA firms:
 *
 *   ✓ GST due clients
 *   ✓ Expiring subscriptions
 *   ✓ Inactive bookkeeping clients
 *   ✓ Quick open workspace
 *
 * WHY
 * Real CAs care about:
 *   "What needs action TODAY?"
 *
 * This page answers exactly that.
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Task = {
  orgId: string
  orgName: string
  type: "gst" | "expiry" | "inactive"
  message: string
}

export default function CATasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  /* ======================================================
     LOAD TASKS
  ====================================================== */

  useEffect(() => {
    async function load() {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: memberships } = await supabase
        .from("organization_members")
        .select("organizations(id, name)")
        .eq("user_id", user.id)

      const orgs =
        memberships
          ?.map((m: any) => m.organizations)
          .filter(Boolean) || []

      const today = new Date().getDate()
      const next3 = new Date()
      next3.setDate(next3.getDate() + 3)

      const allTasks: Task[] = []

      for (const org of orgs) {
        /* ==================================================
           GST DUE (18th reminder)
        ================================================== */
        if (today === 18) {
          allTasks.push({
            orgId: org.id,
            orgName: org.name,
            type: "gst",
            message: "GST filing due soon",
          })
        }

        /* ==================================================
           SUBSCRIPTION EXPIRY
        ================================================== */
        const { data: billing } = await supabase
          .from("organizations")
          .select("pro_expires_at, is_pro")
          .eq("id", org.id)
          .maybeSingle()

        if (
          billing?.is_pro &&
          billing.pro_expires_at &&
          new Date(billing.pro_expires_at) <= next3
        ) {
          allTasks.push({
            orgId: org.id,
            orgName: org.name,
            type: "expiry",
            message: "Subscription expiring soon",
          })
        }

        /* ==================================================
           INACTIVE BOOKKEEPING (7 days no income)
        ================================================== */
        const last7 = new Date()
        last7.setDate(last7.getDate() - 7)

        const { count } = await supabase
          .from("income")
          .select("*", { count: "exact", head: true })
          .eq("org_id", org.id)
          .gte("created_at", last7.toISOString())

        if ((count || 0) === 0) {
          allTasks.push({
            orgId: org.id,
            orgName: org.name,
            type: "inactive",
            message: "No recent bookkeeping activity",
          })
        }
      }

      setTasks(allTasks)
      setLoading(false)
    }

    load()
  }, [])

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Tasks & Alerts
        </h1>
        <p className="text-sm text-gray-500">
          Clients requiring attention today
        </p>
      </div>

      {loading && <p>Loading...</p>}

      <div className="border rounded-xl divide-y">
        {tasks.map((t, i) => (
          <a
            key={i}
            href={`/org/${t.orgId}`}
            className="flex justify-between items-center p-4 hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{t.orgName}</p>
              <p className="text-xs text-gray-500">
                {t.message}
              </p>
            </div>

            <Badge type={t.type} />
          </a>
        ))}

        {!loading && tasks.length === 0 && (
          <p className="p-4 text-sm text-gray-500">
            All clear — no pending tasks 🎉
          </p>
        )}
      </div>
    </div>
  )
}

/* ======================================================
   BADGE
====================================================== */

function Badge({ type }: { type: string }) {
  const map: any = {
    gst: "bg-yellow-500",
    expiry: "bg-red-500",
    inactive: "bg-blue-500",
  }

  return (
    <span
      className={`text-white text-xs px-3 py-1 rounded ${map[type]}`}
    >
      {type.toUpperCase()}
    </span>
  )
}
