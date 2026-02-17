ï»¿"use client"

/* =========================================================
   HisabDesk ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Wealth Planner (FINAL ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Type Safe)
========================================================= */

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import AreaTrendChart from "@/components/charts/AreaTrendChart"

/* ========================================================= */

type TrendPoint = {
  month: string
  value: number
}

type Allocation = {
  name: string
  value: number
}

type Goal = {
  name: string
  progress: number
}

type Summary = {
  netWorth: number
  changePct: number
  trend: TrendPoint[]
  allocation: Allocation[]
  goals: Goal[]
}

/* ========================================================= */

export default function WealthPlannerPage() {
  const [data, setData] = useState<Summary | null>(null)
  const [aiText, setAiText] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch("/api/wealth/summary", { cache: "no-store" })
    const json = await res.json()
    setData(json.data)
  }

  async function loadAI() {
    const res = await fetch("/api/ai/wealth-advice", { method: "POST" })
    const json = await res.json()
    setAiText(json?.insights ?? null)
  }

  useEffect(() => {
    Promise.all([load(), loadAI()]).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-6 text-sm">Loading wealth data...</p>
  if (!data) return <p className="p-6 text-sm">No data</p>

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">

      {/* NET WORTH KPI */}
      <Card className="p-6 text-center bg-green-50 border-green-200">
        <p className="text-sm text-muted-foreground">Net Worth</p>
        <p className="text-3xl font-bold text-green-700 mt-2">
          ? {data.netWorth.toLocaleString("en-IN")}
        </p>
        <p className="text-sm mt-1">
          {data.changePct >= 0 ? "?" : "?"} {data.changePct}% vs last month
        </p>
      </Card>

      {/* TREND CHART */}
      {data.trend.length > 0 && (
        <AreaTrendChart
          title="Net Worth Growth"
          data={data.trend.map((t) => ({
            label: t.month,
            value: t.value,
          }))}
        />
      )}

      {/* ASSET ALLOCATION */}
      <Card className="p-5 space-y-4">
        <h3 className="text-lg font-medium">Asset Allocation</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {data.allocation.map((a) => (
            <div key={a.name} className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">{a.name}</p>
              <p className="font-semibold">
                ? {a.value.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* GOALS */}
      <Card className="p-5 space-y-4">
        <h3 className="text-lg font-medium">Goals Progress</h3>

        {data.goals.map((g) => (
          <div key={g.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{g.name}</span>
              <span>{g.progress}%</span>
            </div>

            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-black rounded"
                style={{ width: `${g.progress}%` }}
              />
            </div>
          </div>
        ))}
      </Card>

      {/* AI WEALTH ADVISOR */}
      {aiText && (
        <Card className="p-4 bg-blue-50 border-blue-200 text-sm whitespace-pre-wrap">
          ?? {aiText}
        </Card>
      )}
    </main>
  )
}
