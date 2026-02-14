"use client"

import { Card } from "@/components/ui/card"
import type { IncomeRow } from "@/hooks/useIncome"

export default function IncomeTable({
  rows,
}: {
  rows: IncomeRow[]
}) {
  if (!rows.length) {
    return (
      <Card className="p-6 text-sm text-muted-foreground">
        No income records yet
      </Card>
    )
  }

  return (
    <Card className="p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-muted-foreground">
          <tr>
            <th className="text-left py-2">Date</th>
            <th className="text-left">Category</th>
            <th className="text-left">Notes</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="py-2">{r.date}</td>
              <td>{r.category}</td>
              <td>{r.notes}</td>
              <td className="text-right font-medium">
                ₹ {r.amount.toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
