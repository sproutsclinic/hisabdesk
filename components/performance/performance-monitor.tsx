ï»¿"use client"

/**
 * =========================================================
 * Performance Monitor (Live App Health HUD)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Phase F (Scale & Performance)
 * =========================================================
 *
 * PURPOSE
 * Shows realtime client performance metrics:
 *
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ page load time
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ API latency
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ memory usage
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ offline queue size
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ realtime connection status
 *
 * WHY IMPORTANT
 * ---------------------------------------------------------
 * Enterprise SaaS MUST know:
 *   "Is the app slow for users?"
 *
 * Helps you debug:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ slow queries
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ heavy pages
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ offline backlog
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ network issues
 *
 * Similar to:
 *   Vercel Speed Insights (mini)
 *   Chrome DevTools lite
 *
 * =========================================================
 *
 * SAFE
 * - dev tool
 * - optional
 * - zero backend impact
 *
 * =========================================================
 *
 * USAGE
 *
 * <PerformanceMonitor />
 *
 * Put once in layout (bottom corner)
 *
 * Only shows in development by default.
 * =========================================================
 */

import { useEffect, useState } from "react"
import { getQueueSize } from "@/lib/pwa/offline-sync-queue"

type Stats = {
  loadMs: number
  memoryMB: number
  queue: number
  online: boolean
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PerformanceMonitor() {
  const [stats, setStats] = useState<Stats>({
    loadMs: 0,
    memoryMB: 0,
    queue: 0,
    online: true,
  })

  const [visible, setVisible] = useState(false)

  /* ------------------------------------------------------
     AUTO SHOW ONLY DEV
  ------------------------------------------------------ */

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      setVisible(true)
    }
  }, [])

  /* ------------------------------------------------------
     COLLECT METRICS
  ------------------------------------------------------ */

  useEffect(() => {
    function collect() {
      const nav =
        performance.getEntriesByType(
          "navigation"
        )[0] as any

      const loadMs = nav
        ? Math.round(nav.loadEventEnd)
        : 0

      const memory =
        (performance as any).memory?.usedJSHeapSize ||
        0

      setStats({
        loadMs,
        memoryMB: Math.round(memory / 1024 / 1024),
        queue: getQueueSize(),
        online: navigator.onLine,
      })
    }

    collect()

    const t = setInterval(collect, 3000)

    return () => clearInterval(t)
  }, [])

  if (!visible) return null

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="fixed bottom-4 right-4 text-xs bg-black text-white rounded-xl px-4 py-3 shadow-xl z-50 space-y-1">
      <Row label="Load" value={`${stats.loadMs} ms`} />
      <Row
        label="Memory"
        value={`${stats.memoryMB} MB`}
      />
      <Row label="Queue" value={stats.queue} />
      <Row
        label="Network"
        value={stats.online ? "Online" : "Offline"}
      />

      <button
        onClick={() => setVisible(false)}
        className="opacity-50 mt-1"
      >
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢
      </button>
    </div>
  )
}

/* ======================================================
   ROW
====================================================== */

function Row({
  label,
  value,
}: {
  label: string
  value: any
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="opacity-70">{label}</span>
      <span>{value}</span>
    </div>
  )
}
