"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AddExpense() {
  const router = useRouter()

  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  /* ================= SAVE ================= */

  const saveExpense = async () => {
    try {
      if (!amount) {
        alert("Please enter amount")
        return
      }

      if (!category) {
        alert("Please enter category")
        return
      }

      setLoading(true)

      await supabase.from("expenses").insert({
        category,
        amount: Number(amount),
        notes,
        date: new Date()
      })

      router.push("/expense/list")

    } catch (err) {
      console.error(err)
      alert("Failed to save expense")
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */

  return (
    <main className="container-app py-12 min-h-screen bg-gray-50">

      <div className="max-w-md mx-auto card space-y-6">

        <h1 className="heading-lg">Add Expense</h1>

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount ₹"
          className="input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Category */}
        <input
          type="text"
          placeholder="Category (rent, salary, travel)"
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* Notes */}
        <input
          type="text"
          placeholder="Notes (optional)"
          className="input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Save Button */}
        <button
          onClick={saveExpense}
          disabled={loading}
          className="btn"
        >
          {loading ? "Saving..." : "Save Expense"}
        </button>

      </div>
    </main>
  )
}
