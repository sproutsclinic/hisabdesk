"use client"

// ==========================================================
// HisabDesk — AI Suggestions Engine
// Personal finance advisor block
// Drop inside Dashboard / Income / Expense pages
// ==========================================================

import { useMemo } from "react"
import type { Database } from "@/types/db"

type Expense =
  Database["public"]["Tables"]["expenses"]["Row"]

type Income =
  Database["public"]["Tables"]["incomes"]["Row"]

interface Props {
  income?: Income[]
  expenses?: Expense[]
  profile?: Record<string, any>
}

export default function AISuggestions({
  income = [],
  expenses = [],
  profile = {},
}: Props) {

  /* ==========================================================
     CALCULATIONS
  ========================================================== */

  const totalIncome = useMemo(
    () =>
      income.reduce(
        (sum, i) => sum + Number(i.amount || 0),
        0
      ),
    [income]
  )

  const totalExpense = useMemo(
    () =>
      expenses.reduce(
        (sum, e) => sum + Number(e.amount || 0),
        0
      ),
    [expenses]
  )

  const savings = totalIncome - totalExpense

  const categorySpend = useMemo(() => {
    const map: Record<string, number> = {}

    expenses.forEach((e) => {
      const cat = e.category || "Other"
      map[cat] = (map[cat] || 0) + Number(e.amount || 0)
    })

    return map
  }, [expenses])

  const topCategory = Object.entries(categorySpend).sort(
    (a, b) => b[1] - a[1]
  )[0]

  /* ==========================================================
     AI RULE ENGINE (simple now → AI later)
  ========================================================== */

  const suggestions = useMemo(() => {
    const tips: string[] = []

    /* ---------- spending high ---------- */
    if (totalExpense > totalIncome * 0.8) {
      tips.push(
        "Your expenses are close to your income. Consider reducing non-essential spending."
      )
    }

    /* ---------- top category ---------- */
    if (topCategory && topCategory[1] > totalExpense * 0.3) {
      tips.push(
        `${topCategory[0]} forms a large part of your spending. Cutting 10% can save ₹ ${Math.round(
          topCategory[1] * 0.1
        ).toLocaleString()}`
      )
    }

    /* ---------- low savings ---------- */
    if (savings < totalIncome * 0.2 && totalIncome > 0) {
      tips.push(
        "Your savings rate is low. Start SIP or recurring investments for better wealth growth."
      )
    }

    /* ---------- no investments ---------- */
    if (profile?.investments === "None") {
      tips.push(
        "No tax-saving investments detected. Consider ELSS/PPF to reduce taxes."
      )
    }

    /* ---------- CA dependency ---------- */
    if (
      profile?.filing_method?.toLowerCase()?.includes("ca")
    ) {
      tips.push(
        "Heavy CA dependency detected. Automating GST & tax filing can reduce cost and delays."
      )
    }

    /* ---------- fallback ---------- */
    if (tips.length === 0) {
      tips.push(
        "Great job! Your finances look healthy. Keep tracking regularly."
      )
    }

    return tips
  }, [
    totalIncome,
    totalExpense,
    savings,
    topCategory,
    profile,
  ])

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <div className="bg-white rounded-2xl border p-5 shadow-sm space-y-3">

      <h3 className="font-semibold">
        AI Financial Insights
      </h3>

      <ul className="space-y-2 text-sm text-gray-700">
        {suggestions.map((tip, i) => (
          <li key={i} className="flex gap-2">
            <span>•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>

    </div>
  )
}
