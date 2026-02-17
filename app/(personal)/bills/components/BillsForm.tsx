ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â BillsForm
   ---------------------------------------------------------
   UI ONLY
   Create bill form
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no business logic
   ========================================================= */

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

import type {
  BillCategory,
  BillFrequency,
  CreateBillRequest,
} from "@/lib/api/bills/types"

interface Props {
  loading?: boolean
  onSubmit: (payload: CreateBillRequest) => Promise<void>
}

const CATEGORIES: BillCategory[] = [
  "rent",
  "utilities",
  "internet",
  "insurance",
  "subscription",
  "emi",
  "other",
]

const FREQ: BillFrequency[] = [
  "monthly",
  "quarterly",
  "yearly",
]

export default function BillsForm({
  loading,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CreateBillRequest>({
    name: "",
    amount: 0,
    category: "other",
    frequency: "monthly",
    due_day: 1,
    auto_pay: false,
  })

  const set = (k: keyof CreateBillRequest, v: any) =>
    setForm((s) => ({ ...s, [k]: v }))

  const handle = async () => {
    await onSubmit(form)

    setForm({
      name: "",
      amount: 0,
      category: "other",
      frequency: "monthly",
      due_day: 1,
      auto_pay: false,
    })
  }

  return (
    <Card className="p-6 space-y-4">
      <h2 className="font-medium">Add Bill</h2>

      <div className="grid md:grid-cols-6 gap-3">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className="border rounded p-2"
        />

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            set("amount", Number(e.target.value))
          }
          className="border rounded p-2"
        />

        <select
          value={form.category}
          onChange={(e) =>
            set("category", e.target.value as BillCategory)
          }
          className="border rounded p-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={form.frequency}
          onChange={(e) =>
            set("frequency", e.target.value as BillFrequency)
          }
          className="border rounded p-2"
        >
          {FREQ.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          max={31}
          placeholder="Due Day"
          value={form.due_day}
          onChange={(e) =>
            set("due_day", Number(e.target.value))
          }
          className="border rounded p-2"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.auto_pay}
            onChange={(e) =>
              set("auto_pay", e.target.checked)
            }
          />
          Auto Pay
        </label>
      </div>

      <button
        onClick={handle}
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        Add Bill
      </button>
    </Card>
  )
}
