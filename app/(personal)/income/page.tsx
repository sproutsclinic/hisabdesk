"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import IncomeMonthlyChart from "@/components/charts/IncomeMonthlyChart"

import IncomeAIInsightsCard from "./components/IncomeAIInsightsCard"
import IncomeKPICards from "./components/IncomeKPICards"

import IncomeGoalCard from "@/components/income/IncomeGoalCard"
import IncomeForecastCard from "@/components/income/IncomeForecastCard"
import IncomeAutoSaveCard from "@/components/income/IncomeAutoSaveCard"
import IncomeCoachCard from "@/components/income/IncomeCoachCard"
import IncomeInvestmentCard from "@/components/income/IncomeInvestmentCard"

/* ========================================================= */

type Row = {
  id: string
  date: string
  amount: number
  category: string
  notes?: string
}

/* ========================================================= */

export default function IncomePage() {
  const [rows, setRows] = useState<Row[]>([])
  const [summary, setSummary] = useState<any>(null)

  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  /* ================= LOADERS ================= */

  async function load() {
    setLoading(true)

    const res = await fetch("/api/income", { cache: "no-store" })
    const json = await res.json()

    setRows(json?.data?.rows || [])
    setLoading(false)
  }

  async function loadSummary() {
    const res = await fetch("/api/income/summary", { cache: "no-store" })
    const json = await res.json()

    setSummary(json?.data || null)
  }

  useEffect(() => {
    load()
    loadSummary()
  }, [])

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {
    if (filter === "all") return rows
    return rows.filter((r) => r.category.startsWith(filter))
  }, [rows, filter])

  const total = filtered.reduce((s, r) => s + r.amount, 0)

  /* ================= UI ================= */

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Income</h1>

        {/* FIXED ROUTE */}
        <Link
          href="/income/add"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm"
        >
          + Add
        </Link>
      </div>

      <IncomeGoalCard />
      <IncomeForecastCard />
      <IncomeAutoSaveCard />
      <IncomeCoachCard />
      <IncomeInvestmentCard />

      {/* TOTAL */}
      <div className="p-4 bg-green-50 border rounded-xl">
        <p className="text-sm text-muted-foreground">Filtered Total</p>
        <p className="text-xl font-semibold text-green-700">
          ₹ {total.toLocaleString("en-IN")}
        </p>
      </div>

      <IncomeKPICards summary={summary} />
      <IncomeAIInsightsCard />

      {/* FILTER */}
      {summary?.categories && (
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="all">All Categories</option>

          {summary.categories.map((c: any) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      )}

      {/* CHART */}
      {summary?.monthly && (
        <IncomeMonthlyChart data={summary.monthly} />
      )}

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No income yet</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <Link
              key={r.id}
              href={`/income/${r.id}`}
              className="block border rounded-xl p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">{r.category}</p>
                  <p className="text-xs text-muted-foreground">{r.date}</p>

                  {r.notes && (
                    <p className="text-xs text-muted-foreground">
                      {r.notes}
                    </p>
                  )}
                </div>

                <p className="text-green-600 font-semibold">
                  ₹ {r.amount.toLocaleString("en-IN")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}