"use client"

// ==========================================================
// HisabDesk — Net Worth Card
// ----------------------------------------------------------
// PURPOSE
//   Shows real-time net worth snapshot
//
//   Net Worth = Assets - Liabilities
//
//   Why:
//     ✓ core wealth metric
//     ✓ fast API (no AI)
//     ✓ lightweight
//     ✓ dashboard essential
//
//   Uses:
//     GET /api/dashboard/networth
//
//   Usage:
//     <NetWorthCard />
//
// ==========================================================

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

// ==========================================================
// TYPES
// ==========================================================

interface NetworthResponse {
  assets: number
  liabilities: number
  networth: number
}

// ==========================================================
// HELPERS
// ==========================================================

function color(value: number) {
  if (value > 0) return "text-green-600"
  if (value < 0) return "text-red-600"
  return ""
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function NetWorthCard() {
  const [data, setData] = useState<NetworthResponse>({
    assets: 0,
    liabilities: 0,
    networth: 0,
  })

  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------
  // LOAD
  // --------------------------------------------------------

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        const res = await fetch("/api/dashboard/networth")
        const json = await res.json()

        setData(json)
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
    <Card className="p-5 space-y-3">
      <p className="text-sm font-medium">Net Worth</p>

      {loading ? (
        <p className="text-xs text-muted-foreground">
          Calculating…
        </p>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Assets
            </span>
            <span className="text-green-600 font-medium">
              ₹ {data.assets.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Liabilities
            </span>
            <span className="text-red-600 font-medium">
              ₹ {data.liabilities.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Net Worth</span>
            <span className={color(data.networth)}>
              ₹ {data.networth.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      )}
    </Card>
  )
}
