"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import ExpenseMonthlyChart from "@/components/charts/ExpenseMonthlyChart"
import BudgetSuggestionsCard from "@/components/ai/BudgetSuggestionsCard"
import SavingsAutomationCard from "@/components/ai/SavingsAutomationCard"
import RecurringDetectionCard from "@/components/ai/RecurringDetectionCard"
import ExpenseBudgetAlerts from "./components/ExpenseBudgetAlerts"
import ExpenseMerchantCard from "./components/ExpenseMerchantCard"

type Row = {
  id: string
  date: string
  amount: number
  category: string
  notes?: string
}

export default function ExpensePage() {
  const [rows, setRows] = useState<Row[]>([])
  const [summary, setSummary] = useState<any>(null)

  const [aiText, setAiText] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const [loading, setLoading] = useState(true)

  const [categoryFilter, setCategoryFilter] = useState("all")
  const [monthFilter, setMonthFilter] = useState("all")
  const [search, setSearch] = useState("")

  async function loadList() {
    const res = await fetch("/api/expense", { cache: "no-store" })
    const json = await res.json()
    setRows(json.data.rows)
  }

  async function loadSummary() {
    const res = await fetch("/api/expense/summary")
    const json = await res.json()
    setSummary(json.data)
  }

  async function loadAI() {
    setAiLoading(true)

    const res = await fetch("/api/ai/expense-summary", {
      method: "POST",
    })

    const json = await res.json()

    setAiText(json?.insights ?? null)
    setAiLoading(false)
  }

  useEffect(() => {
    Promise.all([loadList(), loadSummary(), loadAI()]).finally(() =>
      setLoading(false)
    )
  }, [])

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesCategory =
        categoryFilter === "all" || r.category.startsWith(categoryFilter)

      const matchesMonth =
        monthFilter === "all" || r.date.startsWith(monthFilter)

      const matchesSearch =
        search === "" ||
        r.category.toLowerCase().includes(search.toLowerCase()) ||
        (r.notes || "").toLowerCase().includes(search.toLowerCase())

      return matchesCategory && matchesMonth && matchesSearch
    })
  }, [rows, categoryFilter, monthFilter, search])

  const total = filtered.reduce((s, r) => s + Number(r.amount), 0) || 0

  const months = summary?.monthly || []
  const categories = summary?.categories || []

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Expenses</h1>

        <div className="flex gap-2">
          <Link
            href="/personal/expense/recurring"
            className="border px-4 py-2 rounded-lg text-sm"
          >
            Recurring
          </Link>

          <Link
            href="/personal/expense/add"
            className="bg-black text-white px-4 py-2 rounded-lg text-sm"
          >
            + Add
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded-lg p-2 text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((c: any) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={monthFilter === "all" ? "" : monthFilter}
          onChange={(e) => setMonthFilter(e.target.value || "all")}
          className="border rounded-lg p-2 text-sm"
        />

        <input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 text-sm"
        />
      </div>

      {summary?.merchants && (
        <ExpenseMerchantCard merchants={summary.merchants} />
      )}

      <Card className="p-4 bg-red-50">
        <p className="text-sm text-muted-foreground">Filtered Total</p>
        <p className="text-xl font-semibold text-red-600">
          ₹ {total.toLocaleString("en-IN")}
        </p>
      </Card>

      <BudgetSuggestionsCard />
      <SavingsAutomationCard />
      <RecurringDetectionCard />
      <ExpenseBudgetAlerts />

      <Card className="p-4 bg-blue-50 text-sm whitespace-pre-wrap">
        {aiLoading ? "Analyzing spending..." : aiText}
      </Card>

      {months.length > 0 && <ExpenseMonthlyChart data={months} />}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <Link key={r.id} href={"/personal/expense/" + r.id}>
              <Card className="p-3 flex justify-between text-sm">
                <div>
                  <p className="font-medium">{r.category}</p>
                  <p className="text-xs text-gray-500">{r.date}</p>
                </div>

                <p className="text-red-600 font-semibold">
                  ₹ {r.amount.toLocaleString("en-IN")}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}