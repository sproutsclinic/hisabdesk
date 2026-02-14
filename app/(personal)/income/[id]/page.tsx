"use client"

/* =========================================================
   HisabDesk — Income Edit Page
   ---------------------------------------------------------
   ✓ fetch single
   ✓ update
   ✓ delete
   ✓ thin client
   ✓ API only
========================================================= */

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

type Row = {
  id: string
  date: string
  amount: number
  category: string
  notes?: string
}

export default function IncomeEditPage() {
  const { id } = useParams()
  const router = useRouter()

  const [row, setRow] = useState<Row | null>(null)
  const [loading, setLoading] = useState(true)

  /* ======================================================== */
  /* LOAD SINGLE                                              */
  /* ======================================================== */

  async function load() {
    const res = await fetch(`/api/income?id=${id}`)
    const json = await res.json()

    setRow(json.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  /* ======================================================== */
  /* UPDATE                                                   */
  /* ======================================================== */

  async function save(formData: FormData) {
    await fetch("/api/income", {
      method: "PATCH",
      body: JSON.stringify({
        id,
        date: formData.get("date"),
        amount: Number(formData.get("amount")),
        category: formData.get("category"),
        notes: formData.get("notes"),
      }),
    })

    router.push("/personal/income")
  }

  /* ======================================================== */
  /* DELETE                                                   */
  /* ======================================================== */

  async function remove() {
    await fetch(`/api/income?id=${id}`, {
      method: "DELETE",
    })

    router.push("/personal/income")
  }

  /* ======================================================== */

  if (loading) return <p className="p-6">Loading...</p>

  if (!row) return <p className="p-6">Not found</p>

  /* ======================================================== */

  return (
    <main className="max-w-md mx-auto px-4 py-6 space-y-4">

      <h1 className="text-xl font-semibold">Edit Income</h1>

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
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          name="category"
          defaultValue={row.category}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          name="notes"
          defaultValue={row.notes}
          className="w-full border rounded-lg p-3"
        />

        <button className="w-full bg-black text-white rounded-lg p-3">
          Save Changes
        </button>

      </form>

      <button
        onClick={remove}
        className="w-full text-red-500 text-sm"
      >
        Delete income
      </button>

    </main>
  )
}
