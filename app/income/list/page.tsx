"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function IncomeList() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await supabase
      .from("incomes")
      .select("*")
      .order("created_at", { ascending: false })

    setItems(data || [])
  }

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Income List</h1>

      {items.map((i) => (
        <div key={i.id} className="border p-3 mb-2">
          ₹ {i.amount} — {i.notes}
        </div>
      ))}
    </div>
  )
}
