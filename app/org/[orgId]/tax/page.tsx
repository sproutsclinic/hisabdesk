"use client"

/**
 * =========================================================
 * Organization Tax Center
 * HisabDesk – Phase C (Multi-Tenant Tax Workspace)
 * =========================================================
 *
 * ROUTE
 *   /org/[orgId]/tax
 *
 * PURPOSE
 * Tax control center for each organization:
 *
 *   ✓ profit calculation
 *   ✓ Old vs New regime tax
 *   ✓ 44ADA presumptive tax
 *   ✓ tax saving suggestions (AI engine)
 *   ✓ export reports
 *
 * CONNECTS TO
 *   lib/tax (existing tax engine)
 *   lib/ai/tax-savings-suggester.ts
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

import {
  calculateOldRegimeTax,
  calculateNewRegimeTax,
  calculate44ADA,
} from "@/lib/tax"

import {
  suggestTaxSavings,
  estimateTotalSavings,
} from "@/lib/ai/tax-savings-suggester"

export default function OrgTaxCenterPage() {
  const params = useParams()
  const orgId = params?.orgId as string

  const [loading, setLoading] = useState(true)

  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)

  const [oldTax, setOldTax] = useState(0)
  const [newTax, setNewTax] = useState(0)
  const [adaTax, setAdaTax] = useState(0)

  const [suggestions, setSuggestions] = useState<any[]>([])

  /* ======================================================
     LOAD FINANCIALS
  ====================================================== */

  useEffect(() => {
    async function load() {
      setLoading(true)

      const [i, e] = await Promise.all([
        supabase
          .from("income")
          .select("amount")
          .eq("org_id", orgId),

        supabase
          .from("expenses")
          .select("amount")
          .eq("org_id", orgId),
      ])

      const totalIncome =
        i.data?.reduce((s, r) => s + Number(r.amount), 0) || 0

      const totalExpense =
        e.data?.reduce((s, r) => s + Number(r.amount), 0) || 0

      const profit = totalIncome - totalExpense

      setIncome(totalIncome)
      setExpense(totalExpense)

      /* tax engine */
      setOldTax(calculateOldRegimeTax(profit))
      setNewTax(calculateNewRegimeTax(profit))
      setAdaTax(calculate44ADA(profit))

      /* suggestions */
      const tips = suggestTaxSavings({
        regime: "old",
        income: profit,
        expenses: totalExpense,
      })

      setSuggestions(tips)

      setLoading(false)
    }

    load()
  }, [orgId])

  const profit = income - expense
  const savings = estimateTotalSavings(suggestions)

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Tax Center</h2>
        <p className="text-sm text-gray-500">
          Tax calculations & optimization
        </p>
      </div>

      {loading && <p>Loading...</p>}

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <Card label="Income" value={income} />
        <Card label="Expense" value={expense} />
        <Card label="Profit" value={profit} />
      </div>

      {/* TAX OPTIONS */}
      <div className="grid grid-cols-3 gap-4">
        <Card label="Old Regime Tax" value={oldTax} />
        <Card label="New Regime Tax" value={newTax} />
        <Card label="44ADA Tax" value={adaTax} />
      </div>

      {/* SUGGESTIONS */}
      <div className="border rounded-xl p-5 space-y-3">
        <h3 className="font-medium">
          Tax Saving Suggestions (₹ {savings.toLocaleString()})
        </h3>

        {suggestions.map((s, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-3 text-sm"
          >
            <p className="font-medium">{s.title}</p>
            <p className="text-gray-500">{s.description}</p>
            <p className="text-green-600 mt-1">
              Potential Saving: ₹ {s.potentialSavings}
            </p>
          </div>
        ))}

        {suggestions.length === 0 && (
          <p className="text-gray-500 text-sm">
            No suggestions available
          </p>
        )}
      </div>

      {/* EXPORT */}
      <button
        onClick={() =>
          window.open(`/reports?org=${orgId}`)
        }
        className="bg-black text-white px-5 py-2 rounded-lg"
      >
        Export Tax Report
      </button>
    </div>
  )
}

/* ======================================================
   COMPONENT
====================================================== */

function Card({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="border rounded-xl p-5 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold">
        ₹ {value.toLocaleString()}
      </p>
    </div>
  )
}
