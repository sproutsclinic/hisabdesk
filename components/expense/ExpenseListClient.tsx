ï»¿"use client"

// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Expense List UI (Graphical Dashboard Version)
// Client only ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ charts + numbers + categories
// Phase 5 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ADD BUTTONS + IMPORT + RECEIPT UPLOAD
// Phase 3.2 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Performance hardening + pagination safety (ADDITIVE ONLY)
// ==========================================================

import { useMemo, useState, useDeferredValue } from "react"
import Link from "next/link"
import { deleteExpense, updateExpense } from "@/lib/api/expenses"
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

type Expense =
  Database["public"]["Tables"]["expenses"]["Row"]

/* ==========================================================
   ADDITIVE LIMITS (prevents heavy browser compute)
========================================================== */

const MAX_CLIENT_ROWS = 300

interface Props {
  initialExpenses: Expense[]
  total: number
  page?: number // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ additive (from server)
  pageSize?: number // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ additive (from server)
}

const COLORS = [
  "#2563eb",
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#6b7280",
]

export default function ExpenseListClient({
  initialExpenses,
  total,
  page,
  pageSize,
}: Props) {
  const supabase = getSupabaseClient()

  /* ==========================================================
     STATE (capped for safety)
  ========================================================== */

  const safeInitial =
    initialExpenses.length > MAX_CLIENT_ROWS
      ? initialExpenses.slice(0, MAX_CLIENT_ROWS)
      : initialExpenses

  const [items, setItems] = useState(safeInitial)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ smoother typing performance on large lists
  const deferredSearch = useDeferredValue(search)

  /* ========================================================== */

  const format = (n: number) =>
    `ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ${Number(n || 0).toLocaleString("en-IN")}`

  const extractUrl = (notes?: string | null) => {
    if (!notes) return null
    const match = notes.match(/https?:\/\/\S+/)
    return match?.[0] ?? null
  }

  /* ==========================================================
     INLINE RECEIPT UPLOAD (ADDITIVE)
  ========================================================== */

  const handleUpload = async (id: string, file: File) => {
    try {
      setUploadingId(id)

      const path = `expense/${id}/${Date.now()}-${file.name}`

      await supabase.storage
        .from("vault-documents")
        .upload(path, file)

      const { data } = supabase.storage
        .from("vault-documents")
        .getPublicUrl(path)

      const existing =
        items.find((e) => e.id === id)?.notes || ""

      const newNotes = `${existing} ${data.publicUrl}`

      await updateExpense(id, { notes: newNotes })

      setItems((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, notes: newNotes } : e
        )
      )
    } finally {
      setUploadingId(null)
    }
  }

  /* ==========================================================
     FILTERING (memoized + deferred)
  ========================================================== */

  const filtered = useMemo(() => {
    return items
      .filter((e) => {
        const text = `${e.notes ?? ""} ${e.category ?? ""}`.toLowerCase()

        return (
          (!deferredSearch ||
            text.includes(deferredSearch.toLowerCase())) &&
          (!categoryFilter || e.category === categoryFilter)
        )
      })
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
  }, [items, deferredSearch, categoryFilter])

  /* ========================================================== */

  const totalAmount = filtered.reduce(
    (s, e) => s + Number(e.amount || 0),
    0
  )

  const today = new Date()

  const monthAmount = filtered
    .filter((e) => {
      const d = new Date(e.date)
      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      )
    })
    .reduce((s, e) => s + Number(e.amount || 0), 0)

  /* ==========================================================
     CHART DATA (memoized)
  ========================================================== */

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.forEach((e) => {
      map[e.category || "Misc"] =
        (map[e.category || "Misc"] || 0) + Number(e.amount || 0)
    })
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }))
  }, [filtered])

  const trendData = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.forEach((e) => {
      const d = new Date(e.date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      map[key] = (map[key] || 0) + Number(e.amount || 0)
    })
    return Object.entries(map).map(([date, amount]) => ({
      date,
      amount,
    }))
  }, [filtered])

  /* ========================================================== */

  const handleDelete = async (id: string) => {
    try {
      setLoadingId(id)
      await deleteExpense(id)
      setItems((prev) => prev.filter((e) => e.id !== id))
    } finally {
      setLoadingId(null)
    }
  }

  const uniqueCategories = [...new Set(items.map((e) => e.category))]

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <main className="space-y-8">

      {/* ======================================================
         HEADER + ACTION BUTTONS
      ====================================================== */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-lg font-semibold">Expenses</h1>
          <p className="text-sm text-gray-500">
            Track and manage your spending
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">

          <Link
            href="/expense/import"
            className="px-4 py-2 rounded-xl border text-sm"
          >
            ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¥ Import Statement
          </Link>

          <Link
            href="/expense/add"
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm"
          >
            ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ Add Expense
          </Link>

        </div>
      </section>

      {/* ======================================================
         SUMMARY
      ====================================================== */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Total Spent" value={format(totalAmount)} />
        <Card title="This Month" value={format(monthAmount)} />
        <Card title="Records" value={String(filtered.length)} />
        <Card
          title="Avg / Expense"
          value={format(Math.round(totalAmount / (filtered.length || 1)))}
        />
      </section>

      {/* ======================================================
         CHARTS
      ====================================================== */}
      <section className="grid md:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Category Split</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" outerRadius={90}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => format(typeof v === "number" ? v : Number(v) || 0)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(v) => format(typeof v === "number" ? v : Number(v) || 0)} />
              <Line dataKey="amount" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </section>

      {/* ======================================================
         LIST
      ====================================================== */}
      <section className="space-y-3">
        {filtered.map((e) => {
          const receiptUrl = extractUrl(e.notes)

          return (
            <div
              key={e.id}
              className="rounded-2xl border bg-white p-4 shadow-sm flex justify-between items-center"
            >

              <div>
                <p className="font-semibold text-red-600">
                  {format(Number(e.amount))}
                </p>
                <p className="text-sm text-gray-600">
                  {e.category}
                </p>
              </div>

              <div className="flex items-center gap-2">

                {receiptUrl && (
                  <a
                    href={receiptUrl}
                    target="_blank"
                    className="px-3 py-2 rounded-xl border text-sm"
                  >
                    ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â½ View
                  </a>
                )}

                <label className="px-3 py-2 rounded-xl border text-sm cursor-pointer">
                  {uploadingId === e.id ? "Uploading..." : "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â  Upload"}
                  <input
                    hidden
                    type="file"
                    onChange={(ev) =>
                      ev.target.files &&
                      handleUpload(e.id, ev.target.files[0])
                    }
                  />
                </label>

                <button
                  onClick={() => handleDelete(e.id)}
                  disabled={loadingId === e.id}
                  className="px-4 py-2 rounded-xl border border-red-300 text-red-600 text-sm"
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

/* SMALL CARD */
function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border p-4 shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
