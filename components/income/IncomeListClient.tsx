"use client"

import { useMemo, useState, useDeferredValue } from "react"
import Link from "next/link"
import { deleteIncome, updateIncome } from "@/lib/api/income"
import { getSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/db"

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

type Income =
  Database["public"]["Tables"]["incomes"]["Row"]

/* ==========================================================
   ADDITIVE LIMITS (protect browser performance)
========================================================== */

const MAX_CLIENT_ROWS = 300

interface Props {
  initialIncome: Income[]
  total: number
  page?: number // ✅ additive
  pageSize?: number // ✅ additive
}

const COLORS = [
  "#16a34a",
  "#2563eb",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#6b7280",
]

export default function IncomeListClient({
  initialIncome,
  total,
}: Props) {
  const supabase = getSupabaseClient()

  /* ==========================================================
     STATE (capped)
  ========================================================== */

  const safeInitial =
    initialIncome.length > MAX_CLIENT_ROWS
      ? initialIncome.slice(0, MAX_CLIENT_ROWS)
      : initialIncome

  const [items, setItems] = useState(safeInitial)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  // ✅ smoother typing for large datasets
  const deferredSearch = useDeferredValue(search)

  /* ============================= */

  const format = (n: number) =>
    `₹ ${Number(n || 0).toLocaleString("en-IN")}`

  const extractUrl = (notes?: string | null) => {
    if (!notes) return null
    const match = notes.match(/https?:\/\/\S+/)
    return match?.[0] ?? null
  }

  /* ============================= */
  /* NEW — upload only */
  /* ============================= */

  const handleUpload = async (id: string, file: File) => {
    try {
      setUploadingId(id)

      const path = `income/${id}/${Date.now()}-${file.name}`

      await supabase.storage
        .from("vault-documents")
        .upload(path, file)

      const { data } = supabase.storage
        .from("vault-documents")
        .getPublicUrl(path)

      const existing =
        items.find((i) => i.id === id)?.notes || ""

      const newNotes = `${existing} ${data.publicUrl}`

      await updateIncome(id, { notes: newNotes })

      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, notes: newNotes } : i
        )
      )
    } finally {
      setUploadingId(null)
    }
  }

  /* ============================= */
  /* FILTERING (memoized + deferred) */
  /* ============================= */

  const filtered = useMemo(() => {
    return items
      .filter((i) => {
        const text =
          `${i.category ?? ""} ${i.subcategory ?? ""} ${i.notes ?? ""}`.toLowerCase()

        return (
          (!deferredSearch ||
            text.includes(deferredSearch.toLowerCase())) &&
          (!categoryFilter || i.category === categoryFilter)
        )
      })
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
  }, [items, deferredSearch, categoryFilter])

  /* ============================= */

  const totalAmount = filtered.reduce(
    (s, i) => s + Number(i.amount || 0),
    0
  )

  const today = new Date()

  const monthAmount = filtered
    .filter((i) => {
      const d = new Date(i.date)
      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      )
    })
    .reduce((s, i) => s + Number(i.amount || 0), 0)

  /* ============================= */
  /* CHART DATA (memoized) */
  /* ============================= */

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {}

    filtered.forEach((i) => {
      const key = i.category || "Other"
      map[key] = (map[key] || 0) + Number(i.amount || 0)
    })

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }))
  }, [filtered])

  const trendData = useMemo(() => {
    const map: Record<string, number> = {}

    filtered.forEach((i) => {
      const d = new Date(i.date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      map[key] = (map[key] || 0) + Number(i.amount || 0)
    })

    return Object.entries(map).map(([k, amount]) => ({
      date: k,
      amount,
    }))
  }, [filtered])

  /* ============================= */

  const handleDelete = async (id: string) => {
    try {
      setLoadingId(id)
      await deleteIncome(id)
      setItems((p) => p.filter((i) => i.id !== id))
    } finally {
      setLoadingId(null)
    }
  }

  /* ============================= */

  return (
    <main className="space-y-8">

      {/* SUMMARY */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Total Income" value={format(totalAmount)} />
        <Card title="This Month" value={format(monthAmount)} />
        <Card title="Records" value={String(filtered.length)} />
        <Card
          title="Avg / Entry"
          value={format(
            Math.round(totalAmount / (filtered.length || 1))
          )}
        />
      </section>

      {/* CHARTS (RESTORED) */}
      <section className="grid md:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Income Sources</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" outerRadius={90}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="amount" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* LIST */}
      <section className="space-y-3">
        {filtered.map((i: any) => {
          const receiptUrl = extractUrl(i.notes)

          return (
            <div
              key={i.id}
              className="rounded-2xl border bg-white p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-green-600">
                  {format(Number(i.amount))}
                </p>
                <p className="text-sm text-gray-600">
                  {i.category}
                </p>
              </div>

              <div className="flex items-center gap-2">

                <Link
                  href={`/income/${i.id}/edit`}
                  className="px-3 py-2 border rounded-xl text-sm"
                >
                  ✏ Edit
                </Link>

                {receiptUrl && (
                  <a
                    href={receiptUrl}
                    target="_blank"
                    className="px-3 py-2 border rounded-xl text-sm"
                  >
                    📎 View
                  </a>
                )}

                <label className="px-3 py-2 border rounded-xl text-sm cursor-pointer">
                  {uploadingId === i.id ? "Uploading..." : "⬆ Upload"}
                  <input
                    hidden
                    type="file"
                    onChange={(e) =>
                      e.target.files &&
                      handleUpload(i.id, e.target.files[0])
                    }
                  />
                </label>

                <button
                  onClick={() => handleDelete(i.id)}
                  className="px-3 py-2 border rounded-xl text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </section>
    </main>
  )
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border p-4 shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
