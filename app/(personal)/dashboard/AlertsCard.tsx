"use client"

// ==========================================================
// HisabDesk — Alerts Card (Rule-Based Intelligence)
// ----------------------------------------------------------
// PURPOSE
//   Shows deterministic financial alerts on dashboard
//
//   Why this exists:
//     ✓ instant (no AI latency)
//     ✓ zero cost
//     ✓ always available
//     ✓ complements AI insights
//
//   Flow:
//     GET /api/dashboard/alerts
//
//   NOTE:
//     Alerts = rules engine
//     AIInsightsCard = smart reasoning
//
//   Use BOTH together
//
//   Usage:
//     <AlertsCard />
//
// ==========================================================

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

// ==========================================================
// TYPES
// ==========================================================

type AlertType = "info" | "warning" | "danger"

interface AlertItem {
  type: AlertType
  message: string
}

// ==========================================================
// STYLE HELPERS
// ==========================================================

function styles(type: AlertType) {
  if (type === "danger")
    return "bg-red-50 border-red-200 text-red-700"

  if (type === "warning")
    return "bg-yellow-50 border-yellow-200 text-yellow-700"

  return "bg-blue-50 border-blue-200 text-blue-700"
}

function icon(type: AlertType) {
  if (type === "danger") return "🚨"
  if (type === "warning") return "⚠️"
  return "💡"
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function AlertsCard() {
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------
  // LOAD ALERTS
  // --------------------------------------------------------

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        const res = await fetch("/api/dashboard/alerts")

        const json = await res.json()

        setAlerts(json || [])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // ========================================================
  // UI
  // ========================================================

  return (
    <Card className="p-4 space-y-3">
      <div className="font-semibold text-sm">
        Alerts
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">
          Checking alerts…
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No alerts
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`
                text-sm px-3 py-2 rounded border
                ${styles(a.type)}
              `}
            >
              {icon(a.type)} {a.message}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
