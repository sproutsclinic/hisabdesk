ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â BillsTable
   ---------------------------------------------------------
   UI ONLY
   List all bills
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no logic
   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"
import type { BillComputed } from "@/lib/api/bills/types"

interface Props {
  rows: BillComputed[]
  onDelete: (id: string) => void
}

export default function BillsTable({
  rows,
  onDelete,
}: Props) {
  return (
    <Card className="p-6 space-y-2">
      <h2 className="font-medium mb-2">Your Bills</h2>

      {rows.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No bills added yet
        </div>
      )}

      {rows.map((b) => (
        <div
          key={b.id}
          className="flex justify-between items-center border rounded p-3 text-sm"
        >
          <div className="flex flex-col">
            <span className="font-medium">{b.name}</span>
            <span className="text-muted-foreground">
              {b.category} ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ due {b.due_day}
            </span>
          </div>

          <div className="flex gap-6">
            <span>ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {Math.round(b.amount)}</span>
            <span>{b.daysLeft} days</span>
          </div>

          <button
            onClick={() => onDelete(b.id)}
            className="text-xs border px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </Card>
  )
}
