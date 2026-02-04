"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts"

type Row = {
  date: string
  income: number
  expense: number
}

export default function IncomeExpenseChart({ data }: { data: Row[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm w-full">
      <h3 className="font-semibold mb-4">Income vs Expense Trend</h3>

      {/* ✅ CRITICAL: fixed + min height for SSR */}
      <div className="w-full h-64 md:h-72 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="income"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="expense"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
