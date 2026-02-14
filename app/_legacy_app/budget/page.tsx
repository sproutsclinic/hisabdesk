// ==========================================================
// HisabDesk — Budget Planner
// Separate module • No dependency changes • Add-only feature
// Phase 5 — Manual Monthly Budget Planning (Step 1)
// ==========================================================

"use client"

import { useEffect, useMemo, useState } from "react"
import { getExpenseSummary } from "@/lib/api/expenses"
import { Card } from "@/components/ui/card"

/* ==========================================================
   ✅ NEW — ADDITION ONLY (DB persistence helpers)
========================================================== */
import { getBudgets, saveBudgets } from "@/lib/api/budget"

// ==========================================================
// TYPES
// ==========================================================

type Row = {
  category: string
  planned: number
  actual: number
}

// ==========================================================
// PAGE
// ==========================================================

export default function BudgetPage() {
  const userId = "00000000-0000-0000-0000-000000000000"

  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  /* ==========================================================
     ✅ NEW — ADDITION ONLY (month/year + saving state)
  ========================================================== */

  const today = new Date()
  const month = today.getMonth() + 1
  const year = today.getFullYear()

  const [saving, setSaving] = useState(false)

  // ========================================================
  // LOAD ACTUAL EXPENSE DATA (auto-calc actual spent)
  // ========================================================

  useEffect(() => {
    async function load() {
      const summary = await getExpenseSummary(userId)

      const categories: Record<string, number> = {}

      summary.items?.forEach((e: any) => {
        const cat = e.category || "Misc"
        categories[cat] =
          (categories[cat] || 0) + Number(e.amount || 0)
      })

      const initial: Row[] = Object.entries(categories).map(
        ([category, actual]) => ({
          category,
          actual,
          planned: actual, // default = last month spend
        })
      )

      /* ======================================================
         ✅ NEW — ADDITION ONLY (load saved budgets from DB)
      ====================================================== */

      const savedBudgets = await getBudgets(userId, month, year)

      const savedMap: Record<string, number> = {}

      savedBudgets?.forEach((b: any) => {
        savedMap[b.category] = Number(b.planned)
      })

      const merged = initial.map((r) => ({
        ...r,
        planned: savedMap[r.category] ?? r.planned,
      }))

      setRows(merged)
      setLoading(false)
    }

    load()
  }, [])

  // ========================================================
  // HELPERS
  // ========================================================

  const format = (n: number) =>
    `₹ ${Number(n || 0).toLocaleString("en-IN")}`

  const updatePlanned = (index: number, value: number) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, planned: value } : r
      )
    )
  }

  /* ==========================================================
     ✅ NEW — ADDITION ONLY (save handler)
  ========================================================== */

  const handleSaveBudget = async () => {
    try {
      setSaving(true)

      await saveBudgets(
        userId,
        rows.map((r) => ({
          category: r.category,
          planned: r.planned,
        })),
        month,
        year
      )

      alert("Budget saved successfully ✅")
    } finally {
      setSaving(false)
    }
  }

  // ========================================================
  // TOTALS
  // ========================================================

  const totals = useMemo(() => {
    const planned = rows.reduce((s, r) => s + r.planned, 0)
    const actual = rows.reduce((s, r) => s + r.actual, 0)

    return {
      planned,
      actual,
      remaining: planned - actual,
    }
  }, [rows])

  // ========================================================
  // UI
  // ========================================================

  if (loading) return null

  return (
    <main className="min-h-screen bg-white">
      <div className="container-app py-8 space-y-8">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div>
          <h1 className="text-2xl font-semibold">
            Monthly Budget Planner
          </h1>
          <p className="text-sm text-gray-500">
            Plan category limits and track spending
          </p>
        </div>

        {/* ================================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================================= */}

        <section className="grid md:grid-cols-3 gap-4">

          <Card className="p-5">
            <p className="text-xs text-gray-500">Planned Budget</p>
            <p className="text-xl font-semibold text-blue-600">
              {format(totals.planned)}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-gray-500">Actual Spent</p>
            <p className="text-xl font-semibold text-red-600">
              {format(totals.actual)}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-gray-500">Remaining</p>
            <p
              className={`text-xl font-semibold ${
                totals.remaining >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {format(totals.remaining)}
            </p>
          </Card>

        </section>

        {/* ================================================= */}
        {/* ✅ NEW — SAVE BUTTON (ADDITION ONLY) */}
        {/* ================================================= */}

        <div className="flex justify-end">
          <button
            onClick={handleSaveBudget}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-zinc-900 text-white text-sm"
          >
            {saving ? "Saving..." : "Save Budget"}
          </button>
        </div>

        {/* ================================================= */}
        {/* TABLE */}
        {/* ================================================= */}

        <Card className="p-5 overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-2">Category</th>
                <th>Planned</th>
                <th>Actual</th>
                <th>Remaining</th>
                <th>% Used</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {rows.map((r, i) => {
                const remaining = r.planned - r.actual
                const percent =
                  r.planned > 0
                    ? Math.round((r.actual / r.planned) * 100)
                    : 0

                return (
                  <tr key={r.category}>

                    <td className="py-3 font-medium">
                      {r.category}
                    </td>

                    <td>
                      <input
                        type="number"
                        value={r.planned}
                        onChange={(e) =>
                          updatePlanned(i, Number(e.target.value))
                        }
                        className="border rounded-lg px-2 py-1 w-28"
                      />
                    </td>

                    <td className="text-red-600">
                      {format(r.actual)}
                    </td>

                    <td
                      className={
                        remaining >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {format(remaining)}
                    </td>

                    <td className="w-40">

                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            percent < 80
                              ? "bg-green-500"
                              : percent < 100
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <span className="text-xs ml-2">
                        {percent}%
                      </span>

                    </td>

                  </tr>
                )
              })}

            </tbody>
          </table>

        </Card>

      </div>
    </main>
  )
}
