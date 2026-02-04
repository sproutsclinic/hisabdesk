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
  const [income, setIncome] = useState<number>(0)
  const [expense, setExpense] = useState<number>(0)
  const [deductions, setDeductions] = useState<number>(0)

  const [aiTips, setAiTips] = useState<string>("")
  const [loadingAI, setLoadingAI] = useState<boolean>(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: incomes } = await supabase.from("incomes").select("amount")
    const { data: expenses } = await supabase.from("expenses").select("amount")

    const { data: deductionRow } = await supabase
      .from("deductions")
      .select("total")
      .single()

    const totalIncome =
      incomes?.reduce((s, i) => s + Number(i.amount), 0) || 0

    const totalExpense =
      expenses?.reduce((s, e) => s + Number(e.amount), 0) || 0

    setIncome(totalIncome)
    setExpense(totalExpense)
    setDeductions(deductionRow?.total || 0)
  }

  // ======================
  // CALCULATIONS
  // ======================
  const profit = income - expense
  const taxable = profit - deductions

  const oldTax = calculateOldRegimeTax(taxable)
  const newTax = calculateNewRegimeTax(taxable)
  const adaTax = calculateOldRegimeTax(calculate44ADA(income))

  const best = getBestTaxOption(oldTax, newTax, adaTax)

  // ======================
  // PDF
  // ======================
  const downloadReport = () => {
    generateTaxPDF({
      income,
      expense,
      deductions, // ✅ now type-safe
      profit,
      oldTax,
      newTax,
      adaTax,
      best: best.label
    })
  }

  // ======================
  // AI
  // ======================
  const getAITips = async () => {
    setLoadingAI(true)

    const res = await fetch("/api/ai", {
      method: "POST",
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
    setLoadingAI(false)
  }

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">🧾 Tax Filing Cockpit</h1>

      <div className="grid grid-cols-2 gap-4">
        <Card title="Income" value={income} color="bg-green-100" />
        <Card title="Expenses" value={expense} color="bg-red-100" />
        <Card title="Profit" value={profit} color="bg-blue-100" />
        <Card title="Deductions" value={deductions} color="bg-yellow-100" />
        <Card title="Taxable Income" value={taxable} color="bg-orange-100" />
        <Card title="Old Regime Tax" value={oldTax} color="bg-purple-100" />
        <Card title="New Regime Tax" value={newTax} color="bg-indigo-100" />
        <Card title="44ADA Tax" value={adaTax} color="bg-pink-100" />

        <div className="col-span-2 bg-green-200 p-4 rounded font-bold text-lg">
          ⭐ Best Regime: {best.label} — Pay ₹ {best.value}
        </div>
      </div>
    </div>
  )
}

function Card({
  title,
  value,
  color
}: {
  title: string
  value: number
  color: string
}) {
  return (
    <div className={`${color} p-4 rounded`}>
      {title} ₹ {value}
    </div>
  )
}
