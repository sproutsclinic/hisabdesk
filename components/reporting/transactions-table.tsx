ï»¿"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { ReportFilters } from "@/components/reporting/advanced-filters"

type Row = {
  id: string
  type: "income" | "expense"
  amount: number
  note?: string
  created_at: string
}

export default function TransactionsTable({
  orgId,
  filters,
}: {
  orgId: string
  filters?: ReportFilters
}) {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<"date" | "amount">("date")

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

    const income: Row[] = (incomeRes.data ?? []).map((r: any) => ({
      id: String(r.id),
      amount: Number(r.amount ?? 0),
      note: r.note ?? undefined,
      created_at: String(r.created_at),
      type: "income",
    }))

    const expense: Row[] = (expenseRes.data ?? []).map((r: any) => ({
      id: String(r.id),
      amount: Number(r.amount ?? 0),
      note: r.note ?? undefined,
      created_at: String(r.created_at),
      type: "expense",
    }))

    setRows([...income, ...expense])
    setLoading(false)
  }

  const filtered = useMemo(() => {
    let data = [...rows]

    if (!filters) return data

    if (filters.type && filters.type !== "all") {
      data = data.filter((r) => r.type === filters.type)
    }

    if (filters.search) {
      data = data.filter((r) =>
        r.note?.toLowerCase().includes(filters.search!.toLowerCase())
      )
    }

    return data
  }, [rows, filters])

  const sorted = useMemo(() => {
    const d = [...filtered]

    if (sort === "amount") d.sort((a, b) => b.amount - a.amount)
    else d.sort((a, b) => b.created_at.localeCompare(a.created_at))

    return d
  }, [filtered, sort])

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>

  return (
    <div className="border rounded-2xl bg-white overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b text-sm">
        <span className="font-semibold">Transactions</span>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="border rounded px-2 py-1 text-xs"
        >
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
        </select>
      </div>

      <table className="w-full text-sm">
        <tbody>
          {sorted.map((r) => (
            <tr key={`${r.type}-${r.id}`} className="border-t">
              <td className="p-3">{r.type}</td>
              <td className="p-3">{r.note || "-"}</td>
              <td className="p-3">
                {new Date(r.created_at).toLocaleDateString()}
              </td>
              <td className="p-3 text-right">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {r.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
