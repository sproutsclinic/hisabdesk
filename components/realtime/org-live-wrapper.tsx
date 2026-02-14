"use client"

/**
 * =========================================================
 * Org Live Wrapper (ONE-LINE Realtime + Refresh + Presence)
 * HisabDesk – Phase E FINAL (Enterprise Automation)
 * =========================================================
 *
 * PURPOSE
 * This is the FINAL abstraction that wires EVERYTHING
 * automatically for an organization page.
 *
 * Instead of adding separately:
 *
 *   ❌ OrgRealtimeProvider
 *   ❌ useSmartRefresh
 *   ❌ RealtimeIndicator
 *   ❌ PresenceIndicator
 *
 * You just do:
 *
 *   <OrgLiveWrapper orgId refresh={loadData}>
 *      ... page ...
 *   </OrgLiveWrapper>
 *
 * =========================================================
 *
 * WHAT IT ENABLES AUTOMATICALLY
 *
 *   ✓ realtime DB updates
 *   ✓ auto refresh on change
 *   ✓ refresh on tab focus
 *   ✓ refresh on reconnect
 *   ✓ live indicator badge
 *   ✓ online users presence
 *
 * This becomes:
 *   "plug & play live org page"
 *
 * =========================================================
 *
 * USAGE (RECOMMENDED)
 *
 * app/org/[orgId]/layout.tsx
 *
 * <OrgLiveWrapper orgId={orgId} refresh={loadData}>
 *   {children}
 * </OrgLiveWrapper>
 *
 * =========================================================
 *
 * SAFE
 * - client only
 * - wrapper only
 * - no existing files modified
 * =========================================================
 */

import { useSmartRefresh } from "@/lib/realtime/smart-refresh"
import RealtimeIndicator from "@/components/realtime/realtime-indicator"
import PresenceIndicator from "@/components/realtime/presence-indicator"

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

export default function OrgLiveWrapper({
  orgId,
  refresh,
  children,
}: Props) {
  /* auto realtime refresh */
  useSmartRefresh({
    orgId,
    refresh,
  })

  return (
    <div className="relative">
      {/* --------------------------------------------------
         TOP RIGHT LIVE STATUS BAR
      -------------------------------------------------- */}
      <div className="absolute top-0 right-0 flex items-center gap-3 p-2 z-20">
        <RealtimeIndicator />
        <PresenceIndicator orgId={orgId} />
      </div>

      {children}
    </div>
  )
}
