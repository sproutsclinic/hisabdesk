"use client"

import { useMemo } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const COLORS = [
  "#16a34a",
  "#ef4444",
  "#2563eb",
  "#f59e0b",
  "#8b5cf6",
]

export default function DashboardClient({
  income,
  expenses,
}: {
  income: any[]
  expenses: any[]
}) {
  /* ==========================================================
     HELPERS
  ========================================================== */

  const format = (n: number) =>
    `₹ ${Number(n || 0).toLocaleString("en-IN")}`

  /* ==========================================================
     CALCULATIONS
  ========================================================== */

  const totalIncome = useMemo(
    () => income.reduce((s, i) => s + Number(i.amount || 0), 0),
    [income]
  )

  const totalExpense = useMemo(
    () => expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [expenses]
  )

  const net = totalIncome - totalExpense

  const gstPayable = useMemo(
    () =>
      expenses.reduce(
        (s, e) =>
          s + (Number(e.amount || 0) * Number(e.gst_percent || 0)) / 100,
        0
      ),
    [expenses]
  )

  /* ==========================================================
     CATEGORY SPLIT
  ========================================================== */

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {}

    expenses.forEach((e) => {
      const cat = e.category || "Misc"
      map[cat] = (map[cat] || 0) + Number(e.amount || 0)
    })

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }))
  }, [expenses])

  /* ==========================================================
     TREND DATA
  ========================================================== */

  const trendData = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {}

    income.forEach((i) => {
      const d = new Date(i.date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (!map[key]) map[key] = { income: 0, expense: 0 }
      map[key].income += Number(i.amount || 0)
    })

    expenses.forEach((e) => {
      const d = new Date(e.date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (!map[key]) map[key] = { income: 0, expense: 0 }
      map[key].expense += Number(e.amount || 0)
    })

    return Object.entries(map)
      .sort()
      .map(([k, v]) => ({
        month: k,
        income: v.income,
        expense: v.expense,
        profit: v.income - v.expense,
      }))
  }, [income, expenses])

  /* ==========================================================
     AI INSIGHTS (RULE ENGINE)
  ========================================================== */

  const insights = useMemo(() => {
    const list: string[] = []

    if (net < 0)
      list.push("⚠ Expenses exceed income. Reduce discretionary spend.")

    if (gstPayable > 10000)
      list.push(`🧾 High GST payable: ${format(gstPayable)}`)

    const top = categoryData.sort((a, b) => b.value - a.value)[0]

    if (top)
      list.push(
        `💡 Highest expense category: ${top.name} (${format(top.value)})`
      )

    return list
  }, [net, gstPayable, categoryData])

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <main className="space-y-10">

      {/* KPI */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Income" value={format(totalIncome)} />
        <Card title="Expense" value={format(totalExpense)} />
        <Card title="Net" value={format(net)} />
        <Card title="GST Payable" value={format(gstPayable)} />
      </section>

      {/* CHARTS */}
      <section className="grid md:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="income" />
              <Line dataKey="expense" />
              <Line dataKey="profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Expense Split</h3>
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

      </section>

      {/* AI INSIGHTS */}
      <section className="bg-white rounded-2xl border p-5 shadow-sm">
        <h3 className="font-semibold mb-4">AI Insights</h3>

        <ul className="space-y-2 text-sm text-zinc-700">
          {insights.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      </section>

    </main>
  )
}

/* CARD */

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border p-4 shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
