"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AddIncome() {
  const router = useRouter()

  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  /* ================= SAVE ================= */

  const saveIncome = async () => {
    try {
      if (!amount) {
        alert("Please enter amount")
        return
      }

      setLoading(true)

      await supabase.from("incomes").insert({
        amount: Number(amount),
        notes,
        date: new Date()
      })

      router.push("/income/list")

    } catch (err) {
      console.error(err)
      alert("Failed to save income")
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */

  return (
    <main className="container-app py-12 min-h-screen bg-gray-50">

      <div className="max-w-md mx-auto card space-y-6">

        <h1 className="heading-lg">Add Income</h1>

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount ₹"
          className="input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
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
          onClick={saveIncome}
          disabled={loading}
          className="btn"
        >
          {loading ? "Saving..." : "Save Income"}
        </button>

      </div>
    </main>
  )
}
