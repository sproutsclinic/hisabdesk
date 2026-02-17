ï»¿"use client"

import { Card } from "@/components/ui/card"
import type { IncomeRow } from "@/lib/api/income/types"

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

              {/* category can be null per your domain model */}
              <td>{r.category ?? "-"}</td>

              {/* notes nullable */}
              <td>{r.notes ?? "-"}</td>

              <td className="text-right font-medium">
                ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {Number(r.amount).toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
