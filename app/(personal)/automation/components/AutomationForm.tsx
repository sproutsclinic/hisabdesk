/* =========================================================
   HisabDesk — AutomationForm
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Create recurring rule
   - Local state only
   - Calls onSubmit from parent
   - ZERO business logic
   - ZERO calculations

   ARCHITECTURE
     page → AutomationForm → hook(create)

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
  AutomationType,
  AutomationFrequency,
  CreateAutomationRuleRequest,
} from "@/lib/api/automation/types"

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  loading?: boolean
  onSubmit: (payload: CreateAutomationRuleRequest) => Promise<void>
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function AutomationForm({
  loading,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CreateAutomationRuleRequest>({
    name: "",
    type: "expense",
    amount: 0,
    category: "",
    frequency: "monthly",
    start_date: "",
  })

  const set = (k: keyof CreateAutomationRuleRequest, v: any) =>
    setForm((s) => ({ ...s, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name) return

    await onSubmit(form)

    setForm({
      name: "",
      type: "expense",
      amount: 0,
      category: "",
      frequency: "monthly",
      start_date: "",
    })
  }

  /* ======================================================= */

  return (
    <Card className="p-6 space-y-4">
      <h2 className="font-medium">Create Rule</h2>

      <div className="grid md:grid-cols-6 gap-3">
        <input
          placeholder="Name (Salary, Rent, SIP)"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className="border rounded p-2"
        />

        <select
          value={form.type}
          onChange={(e) =>
            set("type", e.target.value as AutomationType)
          }
          className="border rounded p-2"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            set("amount", Number(e.target.value))
          }
          className="border rounded p-2"
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            set("category", e.target.value)
          }
          className="border rounded p-2"
        />

        <select
          value={form.frequency}
          onChange={(e) =>
            set(
              "frequency",
              e.target.value as AutomationFrequency,
            )
          }
          className="border rounded p-2"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <input
          type="date"
          value={form.start_date}
          onChange={(e) =>
            set("start_date", e.target.value)
          }
          className="border rounded p-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Rule"}
      </button>
    </Card>
  )
}
