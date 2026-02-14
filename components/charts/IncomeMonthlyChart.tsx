"use client"

import { Card } from "@/components/ui/card"

type Props = {
  data: { month: string; total: number }[]
}

export default function IncomeMonthlyChart({ data }: Props) {
  if (!data?.length) return null

  const max = Math.max(...data.map((d) => d.total))

  return (
    <Card className="p-4 rounded-2xl">
      <h3 className="text-sm font-medium mb-4">Monthly Trend</h3>

      <div className="flex items-end gap-3 h-40">
        {data.map((d) => {
          const h = (d.total / max) * 100

          return (
            <div key={d.month} className="flex-1 text-center">
              <div
                className="bg-green-500 rounded-md"
                style={{ height: `${h}%` }}
              />
              <p className="text-[10px] mt-2 text-muted-foreground">
                {d.month.slice(5)}
              </p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
