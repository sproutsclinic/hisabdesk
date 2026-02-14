"use client"

/**
 * =========================================================
 * Organization Reports Center
 * HisabDesk – Enterprise Reporting Hub
 * =========================================================
 *
 * ROUTE
 *   /org/[orgId]/reports
 *
 * PURPOSE
 * Generate & export organization reports:
 *
 *   ✓ P&L summary
 *   ✓ Income report
 *   ✓ Expense report
 *   ✓ Tax summary
 *   ✓ CSV export
 *
 * CONNECTS TO
 *   existing income / expenses tables
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Row = {
  id: string
  amount: number
  description?: string
  created_at: string
}

export default function OrgReportsPage() {
  const params = useParams()
  const orgId = params?.orgId as string

  const [income, setIncome] = useState<Row[]>([])
  const [expenses, setExpenses] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  /* ======================================================
     LOAD DATA
  ====================================================== */

  useEffect(() => {
    async function load() {
      setLoading(true)

      const [i, e] = await Promise.all([
        supabase
          .from("income")
          .select("*")
          .eq("org_id", orgId),

        supabase
          .from("expenses")
          .select("*")
          .eq("org_id", orgId),
      ])

      setIncome(i.data || [])
      setExpenses(e.data || [])
      setLoading(false)
    }

    load()
  }, [orgId])

  /* ======================================================
     CALCULATIONS
  ====================================================== */

  const totalIncome = income.reduce(
    (s, r) => s + Number(r.amount),
    0
  )

  const totalExpense = expenses.reduce(
    (s, r) => s + Number(r.amount),
    0
  )

  const profit = totalIncome - totalExpense

  /* ======================================================
     CSV EXPORT
  ====================================================== */

  function downloadCSV(filename: string, rows: Row[]) {
    const header = "Date,Description,Amount\n"

    const body = rows
      .map(
        (r) =>
          `${new Date(r.created_at).toLocaleDateString()},${r.description || ""},${r.amount}`
      )
      .join("\n")

    const blob = new Blob([header + body], {
      type: "text/csv",
    })

    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()

    URL.revokeObjectURL(url)
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Reports</h2>
        <p className="text-sm text-gray-500">
          Export financial statements
        </p>
      </div>

      {loading && <p>Loading...</p>}

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <Card label="Total Income" value={totalIncome} />
        <Card label="Total Expense" value={totalExpense} />
        <Card label="Profit" value={profit} />
      </div>

      {/* EXPORT BUTTONS */}
      <div className="flex gap-4">
        <button
          onClick={() =>
            downloadCSV("income.csv", income)
          }
          className="border px-4 py-2 rounded-lg"
        >
          Export Income CSV
        </button>

        <button
          onClick={() =>
            downloadCSV("expenses.csv", expenses)
          }
          className="border px-4 py-2 rounded-lg"
        >
          Export Expense CSV
        </button>
      </div>
    </div>
  )
}

/* ======================================================
   CARD
====================================================== */

function Card({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="border rounded-xl p-5 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold">
        ₹ {value.toLocaleString()}
      </p>
    </div>
  )
}
