ï»¿"use client"

import { Card } from "@/components/ui/card"

export default function ExpenseMerchantCard({
  merchants,
}: {
  merchants: { name: string; value: number }[]
}) {
  if (!merchants?.length) return null

  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-medium">Top Merchants</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        {merchants.slice(0, 6).map((m) => (
          <div key={m.name} className="bg-red-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">{m.name}</p>
            <p className="font-semibold text-red-600">
              ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {m.value.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
