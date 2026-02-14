/* =========================================================
   HisabDesk — LoansForm
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Add new loan form
   - Local state only
   - Calls onSubmit from parent
   - ZERO business logic
   - ZERO calculations

   ARCHITECTURE
     page → LoansForm → hook(create)

   RULES
   ✅ UI only
   ❌ no fetch
   ❌ no math
   ❌ no DB
   ❌ no AI

   ========================================================= */

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

import type {
  LoanType,
  CreateLoanRequest,
} from "@/lib/api/loans/types"

/* =========================================================
   CONSTANTS
   ========================================================= */

const LOAN_TYPES: LoanType[] = [
  "home",
  "car",
  "education",
  "personal",
  "credit_card",
  "business",
  "other",
]

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  loading?: boolean
  onSubmit: (payload: CreateLoanRequest) => Promise<void>
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function LoansForm({
  loading,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CreateLoanRequest>({
    name: "",
    type: "personal",
    principal: 0,
    interest_rate: 10,
    tenure_months: 12,
  })

  const set = (k: keyof CreateLoanRequest, v: any) =>
    setForm((s) => ({ ...s, [k]: v }))

  const handleSubmit = async () => {
    await onSubmit(form)

    setForm({
      name: "",
      type: "personal",
      principal: 0,
      interest_rate: 10,
      tenure_months: 12,
    })
  }

  return (
    <Card className="p-6 space-y-4">
      <h2 className="font-medium">Add Loan</h2>

      <div className="grid md:grid-cols-5 gap-3">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className="border rounded p-2"
        />

        <select
          value={form.type}
          onChange={(e) =>
            set("type", e.target.value as LoanType)
          }
          className="border rounded p-2"
        >
          {LOAN_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Principal"
          value={form.principal}
          onChange={(e) =>
            set("principal", Number(e.target.value))
          }
          className="border rounded p-2"
        />

        <input
          type="number"
          placeholder="Interest %"
          value={form.interest_rate}
          onChange={(e) =>
            set("interest_rate", Number(e.target.value))
          }
          className="border rounded p-2"
        />

        <input
          type="number"
          placeholder="Tenure (months)"
          value={form.tenure_months}
          onChange={(e) =>
            set("tenure_months", Number(e.target.value))
          }
          className="border rounded p-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Loan"}
      </button>
    </Card>
  )
}
