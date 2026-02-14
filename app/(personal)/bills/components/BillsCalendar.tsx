"use client"

import { Card } from "@/components/ui/card"
import type { BillComputed } from "@/lib/api/bills/types"

interface Props {
  rows: BillComputed[]
}

export default function BillsCalendar({ rows }: Props) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const days = new Date(year, month + 1, 0).getDate()

  const map = new Map<number, BillComputed[]>()

  rows.forEach((b) => {
    const d = new Date(b.nextDueDate).getDate()
    if (!map.has(d)) map.set(d, [])
    map.get(d)!.push(b)
  })

  return (
    <Card className="p-4">
      <div className="grid grid-cols-7 gap-2 text-xs">
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1
          const bills = map.get(day) ?? []

          return (
            <div
              key={day}
              className="border rounded p-2 min-h-[70px]"
            >
              <div className="font-medium">{day}</div>

              {bills.map((b) => (
                <div key={b.id} className="text-[10px]">
                  ₹{Math.round(b.amount)} {b.name}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
