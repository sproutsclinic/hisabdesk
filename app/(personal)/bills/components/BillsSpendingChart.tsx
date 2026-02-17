ï»¿"use client"

import { PieChart, Pie, Cell, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"
import type { BillComputed } from "@/lib/api/bills/types"

export default function BillsSpendingChart({ rows }: { rows: BillComputed[] }) {
  const data = Object.values(
    rows.reduce((acc: any, b) => {
      acc[b.category] = (acc[b.category] || 0) + b.amount
      return acc
    }, {}),
  ).map((v: any, i) => ({ name: i, value: v }))

  return (
    <Card className="p-4">
      <PieChart width={300} height={300}>
        <Pie data={data} dataKey="value">
          {data.map((_, i) => (
            <Cell key={i} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </Card>
  )
}
