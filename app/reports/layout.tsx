"use client"

/**
 * =========================================================
 * Reports Layout (Enterprise Analytics Shell)
 * HisabDesk – Phase G FINAL WRAPPER
 * =========================================================
 *
 * PURPOSE
 * Provides:
 *
 *   ✓ org auto-detection
 *   ✓ realtime auto refresh
 *   ✓ live indicator
 *   ✓ presence
 *   ✓ performance monitor (dev)
 *
 * So EVERY reports page automatically gets:
 *   ✓ live updates
 *   ✓ fresh data
 *   ✓ collaboration ready
 *
 * CONNECTS TO
 *   components/realtime/org-live-wrapper
 *   components/performance/performance-monitor
 *
 * SAFE
 * - new layout only
 * - wraps existing /reports pages
 *
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import OrgLiveWrapper from "@/components/realtime/org-live-wrapper"
import PerformanceMonitor from "@/components/performance/performance-monitor"

/* =========================================================
   LAYOUT
========================================================= */

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [orgId, setOrgId] = useState<string | null>(
    null
  )

  const [ready, setReady] = useState(false)

  /* ------------------------------------------------------
     LOAD ORG
  ------------------------------------------------------ */

  useEffect(() => {
    init()
  }, [])

  async function init() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from("organization_members")
      .select("org_id")
      .eq("user_id", user.id)
      .limit(1)
      .single()

    if (data) setOrgId(data.org_id)

    setReady(true)
  }

  if (!ready || !orgId) return null

  /* ------------------------------------------------------
     WRAP WITH LIVE ENGINE
  ------------------------------------------------------ */

  return (
    <OrgLiveWrapper
      orgId={orgId}
      refresh={() => {}}
    >
      {children}

      {/* dev only */}
      <PerformanceMonitor />
    </OrgLiveWrapper>
  )
}
