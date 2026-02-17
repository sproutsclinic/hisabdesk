ï»¿
function safeRepeat(char: string, count: number): string {
  if (!Number.isFinite(count)) return ""
  const safe = Math.max(0, Math.floor(count))
  return char.repeat(safe)
}
"use client"

/**
 * =========================================================
 * Push Registration Component (Browser Side)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Phase D Mobile (FINAL PIECE)
 * =========================================================
 *
 * PURPOSE
 * Registers browser for push notifications.
 *
 * Flow:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ ask permission
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ register service worker
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ subscribe with VAPID
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ save subscription to DB
 *
 * CONNECTS TO
 *   public/sw.js
 *   lib/pwa/push-notifications.ts (saveSubscription)
 *
 * SAFE
 * - client only
 * - optional UI
 * - no existing files modified
 *
 * =========================================================
 *
 * USAGE (add once in layout/header/settings)
 *
 * import PushRegister from "@/components/pwa/push-register"
 *
 * <PushRegister />
 *
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

const PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

/* =========================================================
   HELPERS
========================================================= */

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) % 4
  )

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/")

  const rawData = window.atob(base64)

  return new Uint8Array(
    [...rawData].map((c) => c.charCodeAt(0))
  )
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PushRegister() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)

  /* ------------------------------------------------------
     AUTO CHECK EXISTING PERMISSION
  ------------------------------------------------------ */

  useEffect(() => {
    if (typeof window === "undefined") return

    if (Notification.permission === "granted") {
      setEnabled(true)
    }
  }, [])

  /* ======================================================
     REGISTER
  ====================================================== */

  async function enablePush() {
    try {
      setLoading(true)

      if (!("serviceWorker" in navigator)) return

      /* 1. ask permission */
      const permission =
        await Notification.requestPermission()

      if (permission !== "granted") return

      /* 2. register SW */
      const registration =
        await navigator.serviceWorker.register("/sw.js")

      /* 3. subscribe */
      const subscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            urlBase64ToUint8Array(PUBLIC_KEY),
        })

      /* 4. save to backend */
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
        }),
      })

      setEnabled(true)
    } finally {
      setLoading(false)
    }
  }

  /* ======================================================
     UI
  ====================================================== */

  if (enabled) {
    return (
      <button
        disabled
        className="text-xs text-green-600"
      >
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚ÂÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Notifications enabled
      </button>
    )
  }

  return (
    <button
      onClick={enablePush}
      disabled={loading}
      className="text-xs underline"
    >
      {loading
        ? "Enabling..."
        : "Enable notifications"}
    </button>
  )
}

