"use client"

/**
 * =========================================================
 * Smart Refresh Engine (Realtime + Auto Revalidation)
 * HisabDesk – Phase E (Final Realtime Polish)
 * =========================================================
 *
 * PURPOSE
 * Automatically keeps data fresh WITHOUT manual refresh.
 *
 * Combines:
 *   ✓ Supabase realtime
 *   ✓ tab focus refresh
 *   ✓ network reconnect refresh
 *   ✓ visibility change refresh
 *
 * WHY IMPORTANT
 * ---------------------------------------------------------
 * Without this:
 *   ❌ stale dashboard after tab switch
 *   ❌ stale data after reconnect
 *
 * With this:
 *   ✓ always fresh like native apps
 *
 * Similar to:
 *   React Query / SWR behavior
 *
 * =========================================================
 *
 * WHAT IT DOES
 *
 * Auto refresh when:
 *   ✓ user returns to tab
 *   ✓ internet reconnects
 *   ✓ realtime event fires
 *
 * =========================================================
 *
 * USAGE
 *
 * import { useSmartRefresh } from "@/lib/realtime/smart-refresh"
 *
 * useSmartRefresh({
 *   orgId,
 *   refresh: loadData
 * })
 *
 * =========================================================
 *
 * SAFE
 * - client only
 * - reusable
 * - no backend dependency
 * =========================================================
 */

import { useEffect, useRef } from "react"
import { subscribeOrgRealtime } from "@/lib/realtime/org-realtime"

/* =========================================================
   TYPES
========================================================= */

type Options = {
  orgId?: string
  refresh: () => void | Promise<void>
}

/* =========================================================
   HOOK
========================================================= */

export function useSmartRefresh({
  orgId,
  refresh,
}: Options) {
  const ref = useRef(refresh)
  ref.current = refresh

  /* ------------------------------------------------------
     REALTIME
  ------------------------------------------------------ */

  useEffect(() => {
    if (!orgId) return

    const unsub = subscribeOrgRealtime(orgId, () => {
      ref.current?.()
    })

    return unsub
  }, [orgId])

  /* ------------------------------------------------------
     TAB FOCUS
  ------------------------------------------------------ */

  useEffect(() => {
    function onFocus() {
      ref.current?.()
    }

    window.addEventListener("focus", onFocus)

    return () =>
      window.removeEventListener("focus", onFocus)
  }, [])

  /* ------------------------------------------------------
     VISIBILITY CHANGE
  ------------------------------------------------------ */

  useEffect(() => {
    function handler() {
      if (!document.hidden) {
        ref.current?.()
      }
    }

    document.addEventListener(
      "visibilitychange",
      handler
    )

    return () =>
      document.removeEventListener(
        "visibilitychange",
        handler
      )
  }, [])

  /* ------------------------------------------------------
     NETWORK RECONNECT
  ------------------------------------------------------ */

  useEffect(() => {
    function online() {
      ref.current?.()
    }

    window.addEventListener("online", online)

    return () =>
      window.removeEventListener("online", online)
  }, [])
}
