"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ExpenseList() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false })

    setItems(data || [])
  }

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Expense List</h1>

      {items.map((e) => (
        <div key={e.id} className="border p-3 mb-2 text-red-600">
          ₹ {e.amount} — {e.category}
        </div>
      ))}
    </div>
  )
}
