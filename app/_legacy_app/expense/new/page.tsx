"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

export default function NewExpensePage() {
  const router = useRouter()
  const supabase = getSupabaseClient()

  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const save = async () => {
    if (!amount || !category) {
      alert("Amount + Category required")
      return
    }

    setLoading(true)

    const { error } = await supabase.from("expenses").insert({
      amount: Number(amount),
      category,
      notes,
      created_at: new Date(),
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    router.push("/expense/list")
  }

  return (
    <main className="max-w-md mx-auto card space-y-4">
      <h1 className="heading-lg">Add Expense</h1>

      <input
        type="number"
        placeholder="Amount ₹"
        className="input"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="text"
        placeholder="Category"
        className="input"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="text"
        placeholder="Notes (optional)"
        className="input"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button onClick={save} disabled={loading} className="btn">
        {loading ? "Saving..." : "Save Expense"}
      </button>
    </main>
  )
}
