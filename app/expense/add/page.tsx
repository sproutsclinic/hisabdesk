"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AddExpense() {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [notes, setNotes] = useState("")
  const router = useRouter()

  const saveExpense = async () => {
    await supabase.from("expenses").insert({
      category,
      amount: Number(amount),
      notes,
      date: new Date()
    })

    router.push("/expense/list")
  }

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-xl font-bold">Add Expense</h1>

      <input
        placeholder="Amount ₹"
        className="border p-2 w-full"
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Category (rent, salary, travel)"
        className="border p-2 w-full"
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        placeholder="Notes"
        className="border p-2 w-full"
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        onClick={saveExpense}
        className="bg-red-600 text-white px-4 py-2"
      >
        Save
      </button>
    </div>
  )
}
