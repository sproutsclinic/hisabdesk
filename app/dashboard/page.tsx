"use client"

import {
  calculateOldRegimeTax,
  calculateNewRegimeTax,
  calculate44ADA,
  getBestTaxOption
} from "@/lib/tax"

import { generateTaxPDF } from "@/lib/pdf"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()

  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
const [aiTips, setAiTips] = useState("")
const [loadingAI, setLoadingAI] = useState(false)

  // ======================
  // AUTH CHECK
  // ======================
  useEffect(() => {
    checkUser()
    loadData()
  }, [])

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) router.push("/login")
  }

  // ======================
  // LOAD DATA
  // ======================
  const loadData = async () => {
    const { data: incomes } = await supabase.from("incomes").select("amount")
    const { data: expenses } = await supabase.from("expenses").select("amount")

    const totalIncome =
      incomes?.reduce((sum, i) => sum + Number(i.amount), 0) || 0

    const totalExpense =
      expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0

    setIncome(totalIncome)
    setExpense(totalExpense)
  }

  // ======================
  // CALCULATIONS
  // ======================
  const profit = income - expense
  const taxable = profit

  const oldTax = calculateOldRegimeTax(taxable)
  const newTax = calculateNewRegimeTax(taxable)
  const adaTax = calculateOldRegimeTax(calculate44ADA(income))

  const best = getBestTaxOption(oldTax, newTax, adaTax)
const getAITips = async () => {
  setLoadingAI(true)

  const res = await fetch("/api/ai", {
    method: "POST",
    body: JSON.stringify({
      income,
      expense,
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

  // ======================
  // PDF DOWNLOAD FUNCTION (NEW)
  // ======================
  const downloadReport = () => {
    generateTaxPDF({
      income,
      expense,
      profit,
      oldTax,
      newTax,
      adaTax,
      best: best.label
    })
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">

        {/* INCOME */}
        <div className="bg-green-100 p-4 rounded">
          <p>Total Income</p>
          <h2 className="text-xl font-bold">₹ {income}</h2>
        </div>

        {/* EXPENSE */}
        <div className="bg-red-100 p-4 rounded">
          <p>Total Expense</p>
          <h2 className="text-xl font-bold">₹ {expense}</h2>
        </div>

        {/* PROFIT */}
        <div className="bg-blue-100 p-4 rounded col-span-2">
          <p>Net Profit</p>
          <h2 className="text-xl font-bold">₹ {profit}</h2>
        </div>

        {/* TAXABLE */}
        <div className="bg-yellow-100 p-4 rounded">
          <p>Taxable Income</p>
          <h2 className="text-xl font-bold">₹ {taxable}</h2>
        </div>

        {/* OLD REGIME */}
        <div className={`p-4 rounded ${best.label === "Old Regime" ? "bg-green-200" : "bg-purple-100"}`}>
          <p>Old Regime Tax</p>
          <h2 className="text-xl font-bold">₹ {oldTax}</h2>
          {best.label === "Old Regime" && <p>⭐ Best Option</p>}
        </div>

        {/* NEW REGIME */}
        <div className={`p-4 rounded ${best.label === "New Regime" ? "bg-green-200" : "bg-indigo-100"}`}>
          <p>New Regime Tax</p>
          <h2 className="text-xl font-bold">₹ {newTax}</h2>
          {best.label === "New Regime" && <p>⭐ Best Option</p>}
        </div>

        {/* 44ADA */}
        <div className={`p-4 rounded ${best.label === "44ADA" ? "bg-green-200" : "bg-pink-100"}`}>
          <p>44ADA (Professionals)</p>
          <h2 className="text-xl font-bold">₹ {adaTax}</h2>
          {best.label === "44ADA" && <p>⭐ Best Option</p>}
        </div>

        {/* BEST SUMMARY */}
        <div className="col-span-2 bg-green-50 p-4 rounded font-semibold text-lg">
          ✅ Best Choice: {best.label} — Pay ₹ {best.value}
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="space-x-3">
        <a
          href="/income/add"
          className="bg-green-600 text-white px-4 py-2 cursor-pointer"
        >
          Add Income
        </a>

        <a
          href="/expense/add"
          className="bg-red-600 text-white px-4 py-2 cursor-pointer"
        >
          Add Expense
        </a>

        {/* NEW DOWNLOAD BUTTON */}
        <button
          onClick={downloadReport}
          className="bg-blue-600 text-white px-4 py-2 cursor-pointer"
        >
          Download Report

          <button
  onClick={getAITips}
  className="bg-purple-600 text-white px-4 py-2 cursor-pointer"
>
  {loadingAI ? "Analyzing..." : "Get AI Tax Tips"}
</button>

        </button>
      </div>
    </div>
  )
}
{aiTips && (
  <div className="mt-6 bg-purple-50 p-4 rounded whitespace-pre-line">
    <h2 className="font-bold mb-2">🤖 AI Tax Advisor</h2>
    {aiTips}
  </div>
)}

<a
  href="/billing"
  className="bg-yellow-600 text-white px-4 py-2 cursor-pointer"
>
  Upgrade Plan
</a>
