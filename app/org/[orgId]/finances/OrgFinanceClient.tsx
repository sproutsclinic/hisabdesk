"use client"

import { useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"

type Row = {
  id: string
  amount: number
  description?: string | null
  created_at: string
}

export default function OrgFinanceClient({
  orgId,
  initialIncome,
  initialExpenses,
}: {
  orgId: string
  initialIncome: Row[]
  initialExpenses: Row[]
}) {
  const supabase = getSupabaseClient()

  const [income, setIncome] = useState(initialIncome)
  const [expenses, setExpenses] = useState(initialExpenses)

  const [amount, setAmount] = useState("")
  const [desc, setDesc] = useState("")
  const [loading, setLoading] = useState(false)

  /* ====================================================== */

  async function addIncome() {
    if (!amount) return
    setLoading(true)

    const { data } = await supabase
      .from("income")
      .insert({
        org_id: orgId,
        amount: Number(amount),
        description: desc,
      })
      .select()
      .single()

    if (data) setIncome((p) => [data, ...p])

    setAmount("")
    setDesc("")
    setLoading(false)
  }

  async function addExpense() {
    if (!amount) return
    setLoading(true)

    const { data } = await supabase
      .from("expenses")
      .insert({
        org_id: orgId,
        amount: Number(amount),
        description: desc,
      })
      .select()
      .single()

    if (data) setExpenses((p) => [data, ...p])

    setAmount("")
    setDesc("")
    setLoading(false)
  }

  /* ====================================================== */

  return (
    <>
      <div className="flex gap-2">
        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-3 py-2 rounded-lg w-32"
        />

        <input
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="border px-3 py-2 rounded-lg w-64"
        />

        <button
          onClick={addIncome}
          disabled={loading}
          className="bg-green-600 text-white px-4 rounded-lg"
        >
          + Income
        </button>

        <button
          onClick={addExpense}
          disabled={loading}
          className="bg-red-600 text-white px-4 rounded-lg"
        >
          + Expense
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Table title="Income" rows={income} />
        <Table title="Expenses" rows={expenses} />
      </div>
    </>
  )
}

/* ====================================================== */

function Table({
  title,
  rows,
}: {
  title: string
  rows: Row[]
}) {
  return (
    <div className="border rounded-xl p-4">
      <h3 className="font-medium mb-3">{title}</h3>

      {rows.map((r) => (
        <div
          key={r.id}
          className="flex justify-between text-sm border-b py-2"
        >
          <span>{r.description || "-"}</span>
          <span>₹ {Number(r.amount).toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  )
}
