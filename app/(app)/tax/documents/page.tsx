"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

/* ================= CATEGORY RULES ================= */

const getCategory = (text: string) => {
  const t = text.toLowerCase()

  if (t.includes("swiggy") || t.includes("zomato")) return "Food"
  if (t.includes("uber") || t.includes("ola")) return "Travel"
  if (t.includes("amazon") || t.includes("flipkart")) return "Shopping"
  if (t.includes("petrol") || t.includes("fuel")) return "Fuel"
  if (t.includes("rent")) return "Rent"
  if (t.includes("salary")) return "Income"

  return "Other"
}

export default function Documents() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState("")

  /* ================= UPLOAD ================= */

  const upload = async (e: any) => {
    try {
      const file = e.target.files[0]
      if (!file) return

      setLoading(true)

      const newName = `${Date.now()}-${file.name}`
      setFileName(newName)

      await supabase.storage.from("documents").upload(`bank/${newName}`, file)

      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: newName })
      })

      const data = await res.json()

      const withSelection = (data.transactions || []).map((t: any) => ({
        ...t,
        selected: true,
        category: getCategory(t.notes)
      }))

      setTransactions(withSelection)
    } catch (err) {
      console.error(err)
      alert("Failed to parse file")
    } finally {
      setLoading(false)
    }
  }

  /* ================= ROW ACTIONS ================= */

  const deleteRow = (index: number) => {
    setTransactions(transactions.filter((_, i) => i !== index))
  }

  const toggle = (index: number) => {
    const updated = [...transactions]
    updated[index].selected = !updated[index].selected
    setTransactions(updated)
  }

  /* ================= IMPORT ================= */

  const importSelected = async () => {
    try {
      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (!user) return

      const selected = transactions.filter(t => t.selected)

      const incomes: any[] = []
      const expenses: any[] = []

      selected.forEach(t => {
        const record = {
          user_id: user.id,
          amount: t.amount,
          notes: `${t.notes} (${t.category})`,
          date: new Date(t.date)
        }

        if (t.type === "income") incomes.push(record)
        if (t.type === "expense") expenses.push(record)
      })

      if (incomes.length) await supabase.from("incomes").insert(incomes)
      if (expenses.length) await supabase.from("expenses").insert(expenses)

      await supabase.storage.from("documents").remove([`bank/${fileName}`])

      alert(`Imported ${incomes.length + expenses.length} transactions`)

      setTransactions([])
      setFileName("")
    } catch (err) {
      console.error(err)
      alert("Import failed")
    }
  }

  /* ================= UI ================= */

  return (
    <main className="container-app py-10 space-y-8 bg-gray-50 min-h-screen">

      <h1 className="heading-lg">Bank Statement Import</h1>

      {/* Upload */}
      <div className="card space-y-4 max-w-md">
        <input
          type="file"
          accept=".pdf"
          onChange={upload}
          className="input"
        />

        {loading && <p className="muted">Parsing statement…</p>}
      </div>

      {/* Transactions */}
      {transactions.length > 0 && (
        <div className="space-y-4">

          {transactions.map((t, i) => (
            <div
              key={i}
              className="card flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex items-center gap-3 flex-1">

                <input
                  type="checkbox"
                  checked={t.selected}
                  onChange={() => toggle(i)}
                />

                <div className="flex-1">
                  <p className="text-sm font-medium">{t.notes}</p>
                  <p className="text-xs text-gray-500">{t.date}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ₹ {Number(t.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{t.type}</p>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {t.category}
                </span>

                <button
                  onClick={() => deleteRow(i)}
                  className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={importSelected}
            disabled={loading}
            className="btn"
          >
            Import Selected
          </button>

        </div>
      )}

    </main>
  )
}
