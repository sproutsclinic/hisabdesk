"use client"

/**
 * =========================================================
 * Org Realtime Provider (Auto Live Refresh Wrapper)
 * HisabDesk – Phase E (Realtime UX Automation)
 * =========================================================
 *
 * PURPOSE
 * Makes ANY page live automatically.
 *
 * Instead of manually subscribing everywhere:
 *
 * ❌ useEffect(() => subscribeOrgRealtime...)
 *
 * Just wrap page:
 *
 * ✓ <OrgRealtimeProvider orgId refresh={loadData}>
 *
 * BENEFITS
 *   ✓ zero duplicate code
 *   ✓ instant live updates
 *   ✓ plug & play
 *   ✓ enterprise clean architecture
 *
 * CONNECTS TO
 *   lib/realtime/org-realtime.ts
 *
 * SAFE
 * - client only
 * - optional wrapper
 * - no existing files modified
 *
 * =========================================================
 *
 * USAGE (example page)
 *
 * <OrgRealtimeProvider
 *    orgId={orgId}
 *    refresh={loadData}
 * >
 *    ... page UI ...
 * </OrgRealtimeProvider>
 *
 * =========================================================
 */

import { useEffect, useRef } from "react"
import { subscribeOrgRealtime } from "@/lib/realtime/org-realtime"

/* =========================================================
   TYPES
========================================================= */

type Props = {
  orgId: string
  refresh: () => void | Promise<void>
  children: React.ReactNode
}

/* =========================================================
   COMPONENT
========================================================= */

export default function OrgRealtimeProvider({
  orgId,
  refresh,
  children,
}: Props) {
  const refreshRef = useRef(refresh)

  /* keep latest callback */
  refreshRef.current = refresh

  /* ======================================================
     SUBSCRIBE
  ====================================================== */

  useEffect(() => {
    if (!orgId) return

    const unsub = subscribeOrgRealtime(orgId, () => {
      refreshRef.current?.()
    })

    return unsub
  }, [orgId])

  return <>{children}</>
}
