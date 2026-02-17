ï»¿"use client"

import { Card } from "@/components/ui/card"
import { useBillsAI } from "@/hooks/useBillsAI"
import type { BillComputed } from "@/lib/api/bills/types"

export default function BillsAIAdviceCard({ rows }: { rows: BillComputed[] }) {
  const { text, ask, loading } = useBillsAI()

  const handle = () => {
    const total = rows.reduce((a, b) => a + b.amount, 0)
    ask(`monthly=${total} count=${rows.length}`)
  }

  return (
    <Card className="p-4 space-y-2">
      <button onClick={handle} disabled={loading}>
        {loading ? "Analyzing..." : "AI Optimize Bills"}
      </button>

      {text && <div className="text-sm">{text}</div>}
    </Card>
  )
}
