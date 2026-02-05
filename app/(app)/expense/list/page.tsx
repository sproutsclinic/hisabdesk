"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ExpenseList() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  /* ================= LOAD ================= */

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data } = await supabase
        .from("expenses")
        .select("*")
        .order("created_at", { ascending: false })

      setItems(data || [])
    } catch (err) {
      console.error(err)
      alert("Failed to load expenses")
    } finally {
      setLoading(false)
    }
  }

  /* ================= DELETE ================= */

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this expense?")) return

    await supabase.from("expenses").delete().eq("id", id)
    fetchData()
  }

  /* ================= UI ================= */

  return (
    <main className="container-app py-12 min-h-screen bg-gray-50 space-y-6">

      <h1 className="heading-lg">Expense List</h1>

      {/* Loading */}
      {loading && <p className="muted">Loading...</p>}

      {/* Empty */}
      {!loading && items.length === 0 && (
        <div className="card text-center muted">
          No expenses added yet
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {items.map((e) => (
          <div
            key={e.id}
            className="card flex items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <p className="font-semibold text-red-600">
                ₹ {Number(e.amount).toLocaleString()}
              </p>

              <p className="text-sm text-gray-600">
                {e.category}
              </p>

              {e.notes && (
                <p className="text-xs text-gray-400">
                  {e.notes}
                </p>
              )}
            </div>

            <button
              onClick={() => deleteItem(e.id)}
              className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </main>
  )
}
