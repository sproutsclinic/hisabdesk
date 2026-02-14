"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import {
  calculateOldRegimeTax,
  calculateNewRegimeTax,
  calculate44ADA,
  getBestTaxOption
} from "@/lib/tax"

import { generateTaxPDF } from "@/lib/pdf"

export default function TaxPage() {
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [deductions, setDeductions] = useState(0)

  const [aiTips, setAiTips] = useState("")
  const [loadingAI, setLoadingAI] = useState(false)
  const [loading, setLoading] = useState(true)

  /* ================= LOAD ================= */

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: incomes } = await supabase.from("incomes").select("amount")
      const { data: expenses } = await supabase.from("expenses").select("amount")
      const { data: deductionRow } = await supabase.from("deductions").select("total").single()

      const totalIncome =
        incomes?.reduce((s, i) => s + Number(i.amount), 0) || 0

      const totalExpense =
        expenses?.reduce((s, e) => s + Number(e.amount), 0) || 0

      setIncome(totalIncome)
      setExpense(totalExpense)
      setDeductions(deductionRow?.total || 0)

    } catch (err) {
      console.error(err)
      alert("Failed to load tax data")
    } finally {
      setLoading(false)
    }
  }

  /* ================= CALCULATIONS ================= */

  const profit = income - expense
  const taxable = profit - deductions

  const oldTax = calculateOldRegimeTax(taxable)
  const newTax = calculateNewRegimeTax(taxable)
  const adaTax = calculateOldRegimeTax(calculate44ADA(income))

  const best = getBestTaxOption(oldTax, newTax, adaTax)

  /* ================= ACTIONS ================= */

  const downloadReport = () => {
    generateTaxPDF({
      income,
      expense,
      deductions,
      profit,
      oldTax,
      newTax,
      adaTax,
      best: best.label
    })
  }

  const getAITips = async () => {
    try {
      setLoadingAI(true)

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          income,
          expense,
          deductions,
          profit,
          oldTax,
          newTax,
          adaTax
        })
      })

      const data = await res.json()
      setAiTips(data.advice)

    } catch (err) {
      console.error(err)
      alert("Failed to get AI tips")
    } finally {
      setLoadingAI(false)
    }
  }

  /* ================= UI ================= */

  return (
    <main className="container-app py-10 space-y-8 bg-gray-50 min-h-screen">

      <h1 className="heading-lg">🧾 Tax Filing Cockpit</h1>

      {loading && <p className="muted">Loading...</p>}

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card title="Income" value={income} />
        <Card title="Expenses" value={expense} />
        <Card title="Profit" value={profit} />
        <Card title="Deductions" value={deductions} />
        <Card title="Taxable Income" value={taxable} />
        <Card title="Old Regime Tax" value={oldTax} />
        <Card title="New Regime Tax" value={newTax} />
        <Card title="44ADA Tax" value={adaTax} />

      </div>

      {/* BEST RESULT */}
      <div className="card text-center font-semibold text-lg">
        ⭐ Best Regime: {best.label} — Pay ₹ {best.value.toLocaleString()}
      </div>

      {/* ACTIONS */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
        <button onClick={downloadReport} className="btn">
          Download Report
        </button>

        <button onClick={getAITips} className="btn">
          {loadingAI ? "Analyzing..." : "AI Suggestions"}
        </button>
      </div>

      {/* AI RESULT */}
      {aiTips && (
        <div className="card">
          <h2 className="font-bold mb-2">AI Suggestions</h2>
          <p>{aiTips}</p>
        </div>
      )}

    </main>
  )
}

/* ================= COMPONENT ================= */

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="card">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold mt-1">
        ₹ {Number(value).toLocaleString()}
      </p>
    </div>
  )
}
