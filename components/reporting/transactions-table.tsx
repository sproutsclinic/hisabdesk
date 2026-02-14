"use client"

/**
 * =========================================================
 * Transactions Table (Enterprise Ledger View)
 * HisabDesk – Phase G (Professional Reporting)
 * =========================================================
 *
 * PURPOSE
 * Accountant-style ledger table:
 *
 *   ✓ all income + expenses combined
 *   ✓ sortable
 *   ✓ searchable
 *   ✓ filterable
 *   ✓ export-friendly
 *
 * WHY IMPORTANT
 * ---------------------------------------------------------
 * Every CA expects:
 *   "table view of all entries"
 *
 * KPI → summary
 * Table → detailed audit
 *
 * Similar to:
 *   Tally ledger
 *   QuickBooks transactions
 *   Zoho Books entries
 *
 * =========================================================
 *
 * CONNECTS TO
 *   income
 *   expenses
 *
 * OPTIONAL
 *   pass filters from AdvancedFilters
 *
 * SAFE
 * - client only
 * - read only
 * - reusable
 *
 * =========================================================
 *
 * USAGE
 *
 * <TransactionsTable
 *    orgId={orgId}
 *    filters={filters}
 * />
 *
 * =========================================================
 */

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { ReportFilters } from "@/components/reporting/advanced-filters"

/* =========================================================
   TYPES
========================================================= */

type Row = {
  id: string
  type: "income" | "expense"
  amount: number
  note?: string
  created_at: string
}

/* =========================================================
   MAIN
========================================================= */

export default function TransactionsTable({
  orgId,
  filters,
}: {
  orgId: string
  filters?: ReportFilters
}) {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] =
    useState<"date" | "amount">("date")

  /* ======================================================
     LOAD
  ====================================================== */

  useEffect(() => {
    load()
  }, [orgId])

  async function load() {
    setLoading(true)

    const [incomeRes, expenseRes] = await Promise.all([
      supabase
        .from("income")
        .select("id, amount, note, created_at")
        .eq("org_id", orgId),

      supabase
        .from("expenses")
        .select("id, amount, note, created_at")
        .eq("org_id", orgId),
    ])

    const income =
      incomeRes.data?.map((r) => ({
        ...r,
        type: "income" as const,
      })) || []

    const expense =
      expenseRes.data?.map((r) => ({
        ...r,
        type: "expense" as const,
      })) || []

    setRows([...income, ...expense])
    setLoading(false)
  }

  /* ======================================================
     FILTERING
  ====================================================== */

  const filtered = useMemo(() => {
    let data = [...rows]

    if (!filters) return data

    if (filters.type && filters.type !== "all") {
      data = data.filter((r) => r.type === filters.type)
    }

    if (filters.from) {
      data = data.filter(
        (r) => r.created_at >= filters.from!
      )
    }

    if (filters.to) {
      data = data.filter(
        (r) => r.created_at <= filters.to!
      )
    }

    if (filters.min) {
      data = data.filter(
        (r) => r.amount >= filters.min!
      )
    }

    if (filters.max) {
      data = data.filter(
        (r) => r.amount <= filters.max!
      )
    }

    if (filters.search) {
      data = data.filter((r) =>
        r.note
          ?.toLowerCase()
          .includes(filters.search!.toLowerCase())
      )
    }

    return data
  }, [rows, filters])

  /* ======================================================
     SORTING
  ====================================================== */

  const sorted = useMemo(() => {
    const d = [...filtered]

    if (sort === "amount") {
      d.sort((a, b) => b.amount - a.amount)
    } else {
      d.sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
      )
    }

    return d
  }, [filtered, sort])

  /* ======================================================
     UI
  ====================================================== */

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Loading transactions...
      </div>
    )
  }

  return (
    <div className="border rounded-2xl bg-white overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b text-sm">
        <span className="font-semibold">
          Transactions
        </span>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value as any)
          }
          className="border rounded px-2 py-1 text-xs"
        >
          <option value="date">Sort: Date</option>
          <option value="amount">
            Sort: Amount
          </option>
        </select>
      </div>

      {/* TABLE */}
      <div className="max-h-[420px] overflow-auto text-sm">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Note</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((r) => (
              <tr
                key={`${r.type}-${r.id}`}
                className="border-t"
              >
                <td className="p-3 capitalize">
                  {r.type}
                </td>

                <td className="p-3 text-gray-600">
                  {r.note || "-"}
                </td>

                <td className="p-3 text-gray-500">
                  {new Date(
                    r.created_at
                  ).toLocaleDateString()}
                </td>

                <td
                  className={`p-3 text-right font-medium ${
                    r.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ₹ {r.amount}
                </td>
              </tr>
            ))}

            {!sorted.length && (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-gray-400"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
