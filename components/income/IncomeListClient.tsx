ï»¿"use client"

/* =========================================================
   HisabDesk ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Income List (Personal Mode)
   Pure UI component ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â no derived analytics
========================================================= */

import { useMemo, useState } from "react"

type Income = {
  id: string
  user_id: string
  amount: number
  notes: string | null
  date: string
  created_at: string
}

interface Props {
  data: Income[]
}

export default function IncomeListClient({ data }: Props) {
  const [search, setSearch] = useState("")

  /* ======================================================
     Filter (notes-based search only)
  ====================================================== */

  const filtered = useMemo(() => {
    if (!search) return data

    const s = search.toLowerCase()

    return data.filter((i) =>
      (i.notes ?? "").toLowerCase().includes(s)
    )
  }, [data, search])

  /* ======================================================
     UI
  ====================================================== */

  return (
    <section className="space-y-4">
      <input
        className="border rounded px-3 py-2 text-sm"
        placeholder="Search notesÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="border rounded-lg divide-y">
        {filtered.map((i) => (
          <div key={i.id} className="p-3 flex justify-between text-sm">
            <div>
              <p className="font-medium">? {i.amount.toLocaleString("en-IN")}</p>
              <p className="text-muted-foreground">{i.notes ?? "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â"}</p>
            </div>

            <div className="text-muted-foreground">
              {new Date(i.date).toLocaleDateString("en-IN")}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">
            No income entries found.
          </p>
        )}
      </div>
    </section>
  )
}
