"use client"

import { Card } from "@/components/ui/card"

export default function IncomeKPICards({ summary }: { summary: any }) {
  if (!summary) return null

  const thisMonth = summary.thisMonth ?? 0
  const lastMonth = summary.lastMonth ?? 0

  const growth =
    lastMonth === 0
      ? 100
      : Math.round(((thisMonth - lastMonth) / lastMonth) * 100)

  return (
    <div className="grid grid-cols-3 gap-3">

      <Kpi label="This Month" value={thisMonth} />

      <Kpi label="Last Month" value={lastMonth} />

      <Kpi
        label="Growth %"
        value={`${growth}%`}
        color={growth >= 0 ? "text-green-600" : "text-red-600"}
      />

    </div>
  )
}

function Kpi({
  label,
  value,
  color = "",
}: any) {
  return (
    <Card className="p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-semibold ${color}`}>
        {typeof value === "number"
          ? `₹ ${value.toLocaleString("en-IN")}`
          : value}
      </p>
    </Card>
  )
}
