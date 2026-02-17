ï»¿"use client"

/**
 * =========================================================
 * Smart Refresh Engine (Realtime + Auto Revalidation)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Phase E (Final Realtime Polish)
 * =========================================================
 *
 * PURPOSE
 * Automatically keeps data fresh WITHOUT manual refresh.
 *
 * Combines:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Supabase realtime
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ tab focus refresh
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ network reconnect refresh
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ visibility change refresh
 *
 * WHY IMPORTANT
 * ---------------------------------------------------------
 * Without this:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ stale dashboard after tab switch
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ stale data after reconnect
 *
 * With this:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ always fresh like native apps
 *
 * Similar to:
 *   React Query / SWR behavior
 *
 * =========================================================
 *
 * WHAT IT DOES
 *
 * Auto refresh when:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ user returns to tab
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ internet reconnects
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ realtime event fires
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
