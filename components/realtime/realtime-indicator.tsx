"use client"

/**
 * =========================================================
 * Realtime Indicator (Live Status Badge)
 * HisabDesk – Phase E (Collaboration UX)
 * =========================================================
 *
 * PURPOSE
 * Show live connection status to user:
 *
 *   ✓ Live (connected)
 *   ✓ Reconnecting
 *   ✓ Offline
 *
 * WHY IMPORTANT
 * ---------------------------------------------------------
 * Users trust data more when they see:
 *   ● Live
 *
 * Used by:
 *   Notion / Google Docs / Stripe dashboards
 *
 * CONNECTS TO
 *   Supabase Realtime websocket
 *
 * SAFE
 * - client only
 * - optional
 * - zero breaking changes
 *
 * =========================================================
 *
 * USAGE
 *
 * <RealtimeIndicator />
 *
 * Put in header/navbar
 *
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Status = "connecting" | "connected" | "offline"

/* =========================================================
   COMPONENT
========================================================= */

export default function RealtimeIndicator() {
  const [status, setStatus] =
    useState<Status>("connecting")

  /* ======================================================
     NETWORK DETECTION
  ====================================================== */

  useEffect(() => {
    function online() {
      setStatus("connected")
    }

    function offline() {
      setStatus("offline")
    }

    window.addEventListener("online", online)
    window.addEventListener("offline", offline)

    if (!navigator.onLine) {
      setStatus("offline")
    } else {
      setStatus("connected")
    }

    return () => {
      window.removeEventListener("online", online)
      window.removeEventListener("offline", offline)
    }
  }, [])

  /* ======================================================
     SUPABASE REALTIME CONNECTION WATCH
  ====================================================== */

  useEffect(() => {
    const channel = supabase.channel("presence-check")

    channel.subscribe((state) => {
      if (state === "SUBSCRIBED") {
        setStatus("connected")
      } else if (state === "CLOSED") {
        setStatus("connecting")
      }
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  /* ======================================================
     UI
  ====================================================== */

  const map = {
    connected: {
      text: "Live",
      color: "bg-green-500",
    },
    connecting: {
      text: "Connecting",
      color: "bg-yellow-500",
    },
    offline: {
      text: "Offline",
      color: "bg-red-500",
    },
  }

  const s = map[status]

  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <span
        className={`w-2 h-2 rounded-full ${s.color}`}
      />
      {s.text}
    </div>
  )
}
