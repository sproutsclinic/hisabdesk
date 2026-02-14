"use client"

// ==========================================================
// HisabDesk — Recurring Expenses (FIXED)
// ✓ safe fetch
// ✓ no crash if API returns empty
// ✓ consistent with /expense routes
// ==========================================================

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

type Row = {
  merchant: string
  frequency: string
  count: number
  amount: number
}

export default function RecurringPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const res = await fetch("/api/expense/recurring-detect", {
        cache: "no-store",
      })

      const json = await res.json()

      setRows(json?.data || [])
    } catch {
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">
        Recurring Expenses
      </h1>

      {loading && <p>Scanning subscriptions...</p>}

      {!loading &&
        rows.map((r) => (
          <Card key={r.merchant} className="p-4 flex justify-between">
            <div>
              <p className="font-medium capitalize">{r.merchant}</p>
              <p className="text-xs text-gray-500">
                {r.frequency} • {r.count} payments
              </p>
            </div>

            <p className="text-red-600 font-semibold">
              ₹ {Number(r.amount).toLocaleString("en-IN")}
            </p>
          </Card>
        ))}

      {!loading && rows.length === 0 && (
        <p className="text-gray-500">No recurring detected</p>
      )}
    </main>
  )
}