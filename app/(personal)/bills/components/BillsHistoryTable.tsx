/* =========================================================
   HisabDesk — BillsHistoryTable
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Show past bill payments (transactions)
   - Pure display
   - No logic

   RULES
   ✅ UI only
   ❌ no fetch
   ❌ no DB
   ❌ no AI
   ❌ no calculations

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"

/* ========================================================= */

interface Row {
  id: string
  name: string
  amount: number
  paid_at: string
}

interface Props {
  rows: Row[]
}

/* ========================================================= */

export default function BillsHistoryTable({
  rows,
}: Props) {
  return (
    <Card className="p-6 space-y-3">
      <h2 className="font-medium">Payment History</h2>

      {rows.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No payments yet
        </div>
      )}

      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex justify-between border rounded p-3 text-sm"
          >
            <span>{r.name}</span>

            <span className="text-muted-foreground">
              ₹ {Math.round(r.amount)} •{" "}
              {new Date(r.paid_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
