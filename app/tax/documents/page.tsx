"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

// ======================
// CATEGORY RULES
// ======================
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

  // ======================
  // UPLOAD → PREVIEW
  // ======================
  const upload = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)

    const newName = `${Date.now()}-${file.name}`
    setFileName(newName)

    await supabase.storage
      .from("documents")
      .upload(`bank/${newName}`, file)

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
    setLoading(false)
  }

  // ======================
  // DELETE ROW
  // ======================
  const deleteRow = (index: number) => {
    setTransactions(transactions.filter((_, i) => i !== index))
  }

  // ======================
  // TOGGLE
  // ======================
  const toggle = (index: number) => {
    const updated = [...transactions]
    updated[index].selected = !updated[index].selected
    setTransactions(updated)
  }

  // ======================
  // IMPORT WITH DUPLICATE CHECK
  // ======================
  const importSelected = async () => {
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) return

    const selected = transactions.filter(t => t.selected)

    // fetch existing
    const { data: existingIncome } = await supabase
      .from("incomes")
      .select("amount, notes, date")
      .eq("user_id", user.id)

    const { data: existingExpense } = await supabase
      .from("expenses")
      .select("amount, notes, date")
      .eq("user_id", user.id)

    const isDuplicate = (t: any, existing: any[]) =>
      existing?.some(e =>
        Number(e.amount) === Number(t.amount) &&
        new Date(e.date).toDateString() === new Date(t.date).toDateString() &&
        e.notes === `${t.notes} (${t.category})`
      )

    const incomes: any[] = []
    const expenses: any[] = []

    selected.forEach(t => {
      const record = {
        user_id: user.id,
        amount: t.amount,
        notes: `${t.notes} (${t.category})`,
        date: new Date(t.date)
      }

      if (t.type === "income" && !isDuplicate(t, existingIncome || []))
        incomes.push(record)

      if (t.type === "expense" && !isDuplicate(t, existingExpense || []))
        expenses.push(record)
    })

    if (incomes.length) await supabase.from("incomes").insert(incomes)
    if (expenses.length) await supabase.from("expenses").insert(expenses)

    await supabase.storage.from("documents").remove([`bank/${fileName}`])

    alert(`Imported ${incomes.length + expenses.length} new transactions (duplicates skipped)`)

    setTransactions([])
    setFileName("")
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Bank Statement Import</h1>

      <input type="file" accept=".pdf" onChange={upload} />

      {loading && <p>Parsing…</p>}

      {transactions.length > 0 && (
        <>
          {transactions.map((t, i) => (
            <div key={i} className="flex gap-3 items-center border-b py-1">
              <input
                type="checkbox"
                checked={t.selected}
                onChange={() => toggle(i)}
              />

              <span>{t.date}</span>
              <span className="flex-1">{t.notes}</span>
              <span>₹ {t.amount}</span>
              <span>{t.type}</span>

              <span className="text-xs bg-blue-100 px-2 rounded">
                {t.category}
              </span>

              <button onClick={() => deleteRow(i)}>🗑</button>
            </div>
          ))}

          <button
            onClick={importSelected}
            className="bg-green-600 text-white px-4 py-2"
          >
            Import Selected
          </button>
        </>
      )}
    </div>
  )
}
