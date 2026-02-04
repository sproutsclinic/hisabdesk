"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AddIncome() {
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")
  const router = useRouter()

  const saveIncome = async () => {
    await supabase.from("incomes").insert({
      amount: Number(amount),
      notes,
      date: new Date()
    })

    router.push("/income/list")
  }

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-xl font-bold">Add Income</h1>

      <input
        placeholder="Amount ₹"
        className="border p-2 w-full"
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Notes"
        className="border p-2 w-full"
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        onClick={saveIncome}
        className="bg-green-600 text-white px-4 py-2"
      >
        Save
      </button>
    </div>
  )
}
