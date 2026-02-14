"use client"

/**
 * =========================================================
 * Organization Realtime Engine (Live Collaboration)
 * HisabDesk – Phase E (Realtime)
 * =========================================================
 *
 * PURPOSE
 * Real-time updates across tabs/users:
 *
 *   ✓ new income appears instantly
 *   ✓ new expense appears instantly
 *   ✓ document uploads refresh instantly
 *   ✓ team collaboration live
 *
 * WITHOUT THIS
 *   ❌ manual refresh
 *
 * WITH THIS
 *   ✓ auto live dashboard
 *   ✓ modern SaaS feel (Stripe/Notion style)
 *
 * =========================================================
 *
 * CONNECTS TO
 *   Supabase Realtime (postgres changes)
 *
 * REQUIREMENT
 * Enable REPLICATION in Supabase:
 *   Database → Replication → enable tables
 *   income, expenses, org_documents, activity_logs
 *
 * =========================================================
 *
 * USAGE
 *
 * import { subscribeOrgRealtime } from "@/lib/realtime/org-realtime"
 *
 * useEffect(() => {
 *   const unsub = subscribeOrgRealtime(orgId, () => {
 *     loadData()
 *   })
 *
 *   return unsub
 * }, [orgId])
 *
 * =========================================================
 */

import { supabase } from "@/lib/supabase"

/* =========================================================
   TYPES
========================================================= */

type Callback = () => void

/* =========================================================
   MAIN SUBSCRIBE
========================================================= */

export function subscribeOrgRealtime(
  orgId: string,
  onChange: Callback
) {
  /* ------------------------------------------------------
     ONE CHANNEL PER ORG
  ------------------------------------------------------ */

  const channel = supabase.channel(`org-${orgId}`)

  /* ------------------------------------------------------
     TABLE LISTENERS
  ------------------------------------------------------ */

  const tables = [
    "income",
    "expenses",
    "org_documents",
    "activity_logs",
  ]

  tables.forEach((table) => {
    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table,
        filter: `org_id=eq.${orgId}`,
      },
      () => {
        onChange()
      }
    )
  })

  channel.subscribe()

  /* ------------------------------------------------------
     CLEANUP
  ------------------------------------------------------ */

  return () => {
    supabase.removeChannel(channel)
  }
}

/* =========================================================
   LIGHT HOOK (optional helper)
========================================================= */

import { useEffect } from "react"

export function useOrgRealtime(
  orgId: string,
  onChange: Callback
) {
  useEffect(() => {
    if (!orgId) return

    const unsub = subscribeOrgRealtime(
      orgId,
      onChange
    )

    return unsub
  }, [orgId])
}
