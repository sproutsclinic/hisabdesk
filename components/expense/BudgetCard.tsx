ï»¿"use client"

import { Card } from "@/components/ui/card"

export default function BudgetCard({
  category,
  spent,
  limit,
}: {
  category: string
  spent: number
  limit: number
}) {
  const percent =
    limit > 0 ? Math.round((spent / limit) * 100) : 0

  const over = percent > 100

  return (
    <Card className="p-4 space-y-2">

      <div className="flex justify-between text-sm font-medium">
        <span>{category}</span>
        <span>
          ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {spent.toLocaleString("en-IN")} / ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {limit.toLocaleString("en-IN")}
        </span>
      </div>

      <div className="h-2 rounded bg-gray-200 overflow-hidden">
        <div
          className={`h-full ${
            over ? "bg-red-500" : percent > 80 ? "bg-amber-500" : "bg-green-600"
          }`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>

      {over && (
        <p className="text-xs text-red-600">
          ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  Over budget by ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {(spent - limit).toLocaleString("en-IN")}
        </p>
      )}
    </Card>
  )
}
