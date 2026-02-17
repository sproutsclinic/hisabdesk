ï»¿"use client"

import { Card } from "@/components/ui/card"

export default function IncomeSummaryCards({
  total,
}: {
  total: number
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Total Income</p>
        <p className="text-lg font-semibold text-green-600">
          ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {total.toLocaleString("en-IN")}
        </p>
      </Card>
    </div>
  )
}
