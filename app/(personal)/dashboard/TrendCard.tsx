"use client"

// ==========================================================
// HisabDesk — Trend Card (Income vs Expense)
// ----------------------------------------------------------
// PURPOSE
//   Lightweight monthly cashflow trend
//
//   Why:
//     ✓ no heavy chart libraries
//     ✓ fast
//     ✓ mobile friendly
//     ✓ zero dependencies
//
//   Uses:
//     GET /api/dashboard/trend
//
//   NOTE:
//     Grid-based mini chart (like your existing style)
//     Keeps UI consistent with current dashboard
//
//   Usage:
//     <TrendCard />
//
// ==========================================================

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

// ==========================================================
// TYPES
// ==========================================================

interface TrendRow {
  month: string
  income: number
  expense: number
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function TrendCard() {
  const [rows, setRows] = useState<TrendRow[]>([])
  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------------

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        const res = await fetch("/api/dashboard/trend")
        const json = await res.json()

        setRows(json || [])
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
      <p className="text-sm font-medium">Cashflow Trend</p>

      {loading ? (
        <p className="text-xs text-muted-foreground">
          Loading trend…
        </p>
      ) : rows.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No data available
        </p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs text-center">
          {rows.map((r) => {
            const monthLabel = r.month.split("-")[1]

            return (
              <div
                key={r.month}
                className="bg-gray-50 rounded-lg p-2 space-y-1"
              >
                <p className="text-gray-500">{monthLabel}</p>

                <p className="text-green-600">
                  +₹ {r.income.toLocaleString("en-IN")}
                </p>

                <p className="text-red-600">
                  -₹ {r.expense.toLocaleString("en-IN")}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
