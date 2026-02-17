ï»¿"use client"

import { useEffect, useState } from "react"
import BudgetCard from "@/components/expense/BudgetCard"

export default function ExpenseBudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)

  const [category, setCategory] = useState("")
  const [limit, setLimit] = useState("")

  /* ======================================================== */

  async function load() {
    const b = await fetch("/api/expense/budgets").then((r) =>
      r.json()
    )

    const s = await fetch("/api/expense/summary").then((r) =>
      r.json()
    )

    setBudgets(b.data)
    setSummary(s.data)
  }

  useEffect(() => {
    load()
  }, [])

  /* ======================================================== */

  async function save() {
    await fetch("/api/expense/budgets", {
      method: "POST",
      body: JSON.stringify({
        category,
        limit_amount: Number(limit),
      }),
    })

    setCategory("")
    setLimit("")
    load()
  }

  /* ======================================================== */

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      <h1 className="text-2xl font-semibold">Budgets</h1>

      {/* Add Budget */}
      <div className="flex gap-2">
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2 flex-1"
        />

        <input
          placeholder="Limit"
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="border rounded p-2 w-32"
        />

        <button
          onClick={save}
          className="bg-black text-white px-4 rounded"
        >
          Save
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-3">

        {budgets.map((b) => {
          const spent =
            summary?.categoryTotals?.[b.category] || 0

          return (
            <BudgetCard
              key={b.id}
              category={b.category}
              spent={spent}
              limit={b.limit_amount}
            />
          )
        })}

      </div>
    </main>
  )
}
