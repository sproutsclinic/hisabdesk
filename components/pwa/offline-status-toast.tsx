"use client"

/**
 * =========================================================
 * Offline / Sync Status Toast
 * HisabDesk – Phase D (Mobile Reliability UX)
 * =========================================================
 *
 * PURPOSE
 * Show real-time network + sync feedback:
 *
 *   ✓ Offline detected
 *   ✓ Back online
 *   ✓ Syncing queued actions
 *   ✓ Queue count indicator
 *
 * WHY IMPORTANT
 * ---------------------------------------------------------
 * Without feedback:
 *   ❌ user thinks save failed
 *   ❌ confusion offline
 *
 * With this:
 *   ✓ trust
 *   ✓ clarity
 *   ✓ app-like UX (Notion/Drive style)
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
    offline: "You’re offline. Changes will sync later.",
    syncing: `Syncing ${queue} changes...`,
    online: "Back online ✓",
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
