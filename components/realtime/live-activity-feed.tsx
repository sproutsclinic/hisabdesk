"use client"

/**
 * =========================================================
 * Live Activity Feed (Realtime Timeline)
 * HisabDesk – Phase E (Collaboration UI)
 * =========================================================
 *
 * PURPOSE
 * Show live actions happening inside organization:
 *
 *   ✓ expense added
 *   ✓ income recorded
 *   ✓ document uploaded
 *   ✓ member joined
 *
 * Updates instantly without refresh.
 *
 * WHY IMPORTANT
 * ---------------------------------------------------------
 * Creates:
 *   ✓ trust
 *   ✓ team visibility
 *   ✓ "multi-user SaaS" feel
 *
 * Similar to:
 *   Notion activity
 *   Slack timeline
 *   Stripe logs
 *
 * CONNECTS TO
 *   activity_logs table
 *   Supabase realtime
 *
 * REQUIRED TABLE (already exists earlier)
 *   activity_logs:
 *     id, org_id, action, meta, created_at
 *
 * SAFE
 * - client only
 * - read only
 * - plug & play
 *
 * =========================================================
 *
 * USAGE
 *
 * <LiveActivityFeed orgId={orgId} />
 *
 * Put in:
 *   ✓ dashboard sidebar
 *   ✓ admin page
 *   ✓ CA portal
 *
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Activity = {
  id: string
  action: string
  meta: any
  created_at: string
}

export default function LiveActivityFeed({
  orgId,
}: {
  orgId: string
}) {
  const [items, setItems] = useState<Activity[]>([])

  /* ======================================================
     INITIAL LOAD
  ====================================================== */

  async function load() {
    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(20)

    setItems(data || [])
  }

  useEffect(() => {
    if (!orgId) return
    load()
  }, [orgId])

  /* ======================================================
     REALTIME SUBSCRIBE
  ====================================================== */

  useEffect(() => {
    if (!orgId) return

    const channel = supabase
      .channel(`activity-${orgId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_logs",
          filter: `org_id=eq.${orgId}`,
        },
        (payload) => {
          setItems((prev) => [
            payload.new as Activity,
            ...prev.slice(0, 19),
          ])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orgId])

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="border rounded-xl p-4 bg-white">
      <h3 className="text-sm font-semibold mb-3">
        Live Activity
      </h3>

      <div className="space-y-3 max-h-72 overflow-auto">
        {items.map((a) => (
          <Row key={a.id} item={a} />
        ))}

        {items.length === 0 && (
          <p className="text-xs text-gray-400">
            No activity yet
          </p>
        )}
      </div>
    </div>
  )
}

/* ======================================================
   ROW
====================================================== */

function Row({ item }: { item: Activity }) {
  return (
    <div className="text-xs border-b pb-2">
      <p className="font-medium">{item.action}</p>

      <p className="text-gray-400">
        {new Date(item.created_at).toLocaleTimeString()}
      </p>
    </div>
  )
}
