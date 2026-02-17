ï»¿"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"

import { Trophy } from "lucide-react"

type Row = {
  referral_code: string
  count: number
}

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data } = await supabase
      .rpc("referral_leaderboard") // simple SQL view or function
    setRows(data || [])
  }

  return (
    <div className="max-w-xl space-y-6">

      <h1 className="text-lg font-semibold flex gap-2 items-center">
        <Trophy size={18} />
        Top Referrers
      </h1>

      {rows.map((r, i) => (
        <Card key={i} className="flex justify-between text-sm">
          <span>#{i + 1}</span>
          <span>{r.referral_code}</span>
          <span>{r.count}</span>
        </Card>
      ))}
    </div>
  )
}
