ï»¿"use client"

/**
 * =========================================================
 * Offline / Sync Status Toast
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Phase D (Mobile Reliability UX)
 * =========================================================
 *
 * PURPOSE
 * Show real-time network + sync feedback:
 *
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Offline detected
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Back online
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Syncing queued actions
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Queue count indicator
 *
 * WHY IMPORTANT
 * ---------------------------------------------------------
 * Without feedback:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ user thinks save failed
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ confusion offline
 *
 * With this:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ trust
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ clarity
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ app-like UX (Notion/Drive style)
 *
 * CONNECTS TO
 *   lib/pwa/offline-sync-queue.ts
 *
 * SAFE
 * - client only
 * - plug & play
 * - no other file changes
 *
 * =========================================================
 *
 * USAGE (add once in layout)
 *
 * <OfflineStatusToast />
 *
 * =========================================================
 */

import { useEffect, useState } from "react"
import {
  getQueueSize,
  processQueue,
} from "@/lib/pwa/offline-sync-queue"

type State =
  | "offline"
  | "online"
  | "syncing"
  | "idle"

/* =========================================================
   COMPONENT
========================================================= */

export default function OfflineStatusToast() {
  const [state, setState] = useState<State>("idle")
  const [queue, setQueue] = useState(0)
  const [visible, setVisible] = useState(false)

  /* ======================================================
     HELPERS
  ====================================================== */

  function show(type: State) {
    setState(type)
    setVisible(true)

    setTimeout(() => {
      setVisible(false)
    }, 3000)
  }

  /* ======================================================
     NETWORK EVENTS
  ====================================================== */

  useEffect(() => {
    function goOffline() {
      show("offline")
    }

    async function goOnline() {
      const q = getQueueSize()

      if (q > 0) {
        setQueue(q)
        show("syncing")

        await processQueue()

        show("online")
      } else {
        show("online")
      }
    }

    window.addEventListener("offline", goOffline)
    window.addEventListener("online", goOnline)

    return () => {
      window.removeEventListener("offline", goOffline)
      window.removeEventListener("online", goOnline)
    }
  }, [])

  /* ======================================================
     UI TEXT
  ====================================================== */

  const map: Record<State, string> = {
    offline: "YouÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢re offline. Changes will sync later.",
    syncing: `Syncing ${queue} changes...`,
    online: "Back online ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“",
    idle: "",
  }

  const color =
    state === "offline"
      ? "bg-red-600"
      : state === "syncing"
      ? "bg-yellow-600"
      : "bg-green-600"

  /* ======================================================
     UI
  ====================================================== */

  if (!visible || state === "idle") return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`${color} text-white text-sm px-4 py-2 rounded-xl shadow-lg`}
      >
        {map[state]}
      </div>
    </div>
  )
}
