ï»¿"use client"

import { useEffect, useState } from "react"

type Row = {
  id: string
  title: string
  amount: number
  frequency: string
  next_run: string
}

export default function RecurringIncomePage() {
  const [rows, setRows] = useState<Row[]>([])

  async function load() {
    const res = await fetch("/api/income/recurring")
    const json = await res.json()
    setRows(json.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function add(formData: FormData) {
    await fetch("/api/income/recurring", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        amount: Number(formData.get("amount")),
        category: "Salary",
        next_run: formData.get("next_run"),
      }),
    })

    load()
  }

  return (
    <main className="max-w-md mx-auto px-4 py-6 space-y-6">

      <h1 className="text-xl font-semibold">Recurring Income</h1>

      <form action={add} className="space-y-2 border p-4 rounded-xl">

        <input name="title" placeholder="Salary" className="border p-2 w-full" />
        <input name="amount" type="number" placeholder="Amount" className="border p-2 w-full" />
        <input name="next_run" type="date" className="border p-2 w-full" />

        <button className="bg-black text-white p-2 rounded-lg w-full">
          Add recurring
        </button>

      </form>

      <div className="space-y-2">

        {rows.map((r) => (
          <div key={r.id} className="border p-3 rounded-lg">

            <p className="font-medium">{r.title}</p>
            <p className="text-sm text-gray-500">Next: {r.next_run}</p>
            <p className="text-green-600">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {r.amount}</p>

          </div>
        ))}

      </div>

    </main>
  )
}
