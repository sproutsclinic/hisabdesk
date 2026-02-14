"use client"

/* =========================================================
   HisabDesk — Expense Edit Page (ENTERPRISE FINAL)
   ---------------------------------------------------------
   ✓ load single expense
   ✓ update
   ✓ delete
   ✓ duplicate
   ✓ API only
   ✓ mobile first
   ✓ zero business logic
========================================================= */

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

/* ========================================================= */

type Expense = {
  id: string
  date: string
  amount: number
  category: string
  notes?: string
}

/* ========================================================= */

export default function ExpenseEditPage() {
  const router = useRouter()
  const params = useParams()

  const id = params.id as string

  const [row, setRow] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  /* ========================================================
     LOAD
  ======================================================== */

  async function load() {
    setLoading(true)

    const res = await fetch(`/api/expenses/${id}`)
    const json = await res.json()

    setRow(json.data)
    setLoading(false)
  }

  useEffect(() => {
    if (id) load()
  }, [id])

  /* ========================================================
     SAVE
  ======================================================== */

  async function save(formData: FormData) {
    setSaving(true)

    await fetch("/api/expenses", {
      method: "PATCH",
      body: JSON.stringify({
        id,
        date: formData.get("date"),
        amount: Number(formData.get("amount")),
        category: formData.get("category"),
        notes: formData.get("notes"),
      }),
      headers: { "Content-Type": "application/json" },
    })

    router.push("/personal/expense")
  }

  /* ========================================================
     DELETE
  ======================================================== */

  async function remove() {
    const ok = confirm("Delete this expense?")
    if (!ok) return

    await fetch(`/api/expenses?id=${id}`, {
      method: "DELETE",
    })

    router.push("/personal/expense")
  }

  /* ========================================================
     DUPLICATE (quick add same expense)
  ======================================================== */

  async function duplicate() {
    if (!row) return

    await fetch("/api/expenses", {
      method: "POST",
      body: JSON.stringify({
        date: new Date().toISOString().slice(0, 10),
        amount: row.amount,
        category: row.category,
        notes: row.notes,
      }),
      headers: { "Content-Type": "application/json" },
    })

    router.push("/personal/expense")
  }

  /* ========================================================
     UI
  ======================================================== */

  if (loading || !row) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading expense...
      </div>
    )
  }

  return (
    <main className="max-w-md mx-auto px-4 py-6 space-y-4">

      <h1 className="text-xl font-semibold">Edit Expense</h1>

      <form action={save} className="space-y-3">

        <input
          type="date"
          name="date"
          defaultValue={row.date}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="number"
          name="amount"
          defaultValue={row.amount}
          className="w-full border rounded-lg p-3 text-lg font-medium text-red-600"
        />

        <input
          type="text"
          name="category"
          defaultValue={row.category}
          className="w-full border rounded-lg p-3"
        />

        <textarea
          name="notes"
          defaultValue={row.notes}
          placeholder="Notes"
          className="w-full border rounded-lg p-3"
        />

        <button
          disabled={saving}
          className="w-full bg-black text-white rounded-lg p-3"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </form>



      {/* actions */}
      <div className="grid grid-cols-2 gap-3">

        <button
          onClick={duplicate}
          className="border rounded-lg p-3 text-sm"
        >
          Duplicate
        </button>

        <button
          onClick={remove}
          className="border rounded-lg p-3 text-sm text-red-600"
        >
          Delete
        </button>

      </div>

    </main>
  )
}
