"use client"

import {
  calculateOldRegimeTax,
  calculateNewRegimeTax,
  calculate44ADA,
  getBestTaxOption
} from "@/lib/tax"

import { generateTaxPDF } from "@/lib/pdf"
import { isProUser } from "@/lib/isPro"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

import IncomeExpenseChart from "@/components/IncomeExpenseChart"

export default function Dashboard() {
  const router = useRouter()

  // ======================
  // STATE
  // ======================
  const [income, setIncome] = useState<number>(0)
  const [expense, setExpense] = useState<number>(0)
  const [deductions, setDeductions] = useState<number>(0) // ✅ added

  const [incomeRows, setIncomeRows] = useState<any[]>([])
  const [expenseRows, setExpenseRows] = useState<any[]>([])

  const [aiTips, setAiTips] = useState("")
  const [loadingAI, setLoadingAI] = useState(false)
  const [isPro, setIsPro] = useState(false)

  // ======================
  // INIT
  // ======================
  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    await checkUser()
    await loadData()
    await checkPro()
  }

  // ======================
  // AUTH
  // ======================
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) router.push("/login")
  }

  // ======================
  // LOAD DATA
  // ======================
  const loadData = async () => {
    const { data: incomes } = await supabase
      .from("incomes")
      .select("amount,date")

    const { data: expenses } = await supabase
      .from("expenses")
      .select("amount,date")

    // ✅ load deductions (same as tax page)
    const { data: deductionRow } = await supabase
      .from("deductions")
      .select("total")
      .single()

    setIncomeRows(incomes || [])
    setExpenseRows(expenses || [])

    setIncome(incomes?.reduce((s, i) => s + Number(i.amount), 0) || 0)
    setExpense(expenses?.reduce((s, e) => s + Number(e.amount), 0) || 0)
    setDeductions(deductionRow?.total || 0) // ✅ set deductions
  }

  // ======================
  // PRO CHECK
  // ======================
  const checkPro = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) return

    const pro = await isProUser(data.user.id)
    setIsPro(pro)
  }

  // ======================
  // CALCULATIONS
  // ======================
  const profit = income - expense
  const taxable = profit - deductions // ✅ correct logic

  const oldTax = calculateOldRegimeTax(taxable)
  const newTax = calculateNewRegimeTax(taxable)
  const adaTax = calculateOldRegimeTax(calculate44ADA(income))

  const best = getBestTaxOption(oldTax, newTax, adaTax)

  // ======================
  // CHART DATA
  // ======================
  const monthMap: Record<string, { income: number; expense: number }> = {}

  incomeRows.forEach((r: any) => {
    const m = new Date(r.date).toLocaleDateString("en-IN", { month: "short" })
    if (!monthMap[m]) monthMap[m] = { income: 0, expense: 0 }
    monthMap[m].income += Number(r.amount)
  })

  expenseRows.forEach((r: any) => {
    const m = new Date(r.date).toLocaleDateString("en-IN", { month: "short" })
    if (!monthMap[m]) monthMap[m] = { income: 0, expense: 0 }
    monthMap[m].expense += Number(r.amount)
  })

  const chartData = Object.entries(monthMap).map(([date, v]) => ({
    date,
    income: v.income,
    expense: v.expense
  }))

  // ======================
  // AI
  // ======================
  const getAITips = async () => {
    if (!isPro) return router.push("/billing")

    setLoadingAI(true)

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        income,
        expense,
        deductions, // ✅ send deductions
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
  // PDF
  // ======================
  const downloadReport = () => {
    if (!isPro) return router.push("/billing")

    generateTaxPDF({
      income,
      expense,
      deductions, // ✅ now valid
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
    <div className="px-4 md:p-8 space-y-8 bg-gray-50 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card title="Income" value={`₹ ${income.toLocaleString()}`} />
        <Card title="Expense" value={`₹ ${expense.toLocaleString()}`} />
        <Card title="Profit" value={`₹ ${profit.toLocaleString()}`} />
        <Card title="Best Tax" value={`₹ ${best.value.toLocaleString()}`} />
      </div>

      <IncomeExpenseChart data={chartData} />

      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
        <Btn href="/tax">Tax Filing</Btn>
        <Btn href="/income/add">Add Income</Btn>
        <Btn href="/expense/add">Add Expense</Btn>
        <Btn onClick={getAITips}>{loadingAI ? "Loading..." : "AI Advisor"}</Btn>
        <Btn onClick={downloadReport}>Download PDF</Btn>
      </div>

      {aiTips && (
        <div className="bg-white p-6 rounded-2xl border">
          <h2 className="font-bold mb-2">AI Suggestions</h2>
          <p>{aiTips}</p>
        </div>
      )}
    </div>
  )
}

/* ====================== */

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  )
}

function Btn({
  children,
  href,
  onClick
}: {
  children: React.ReactNode
  href?: string
  onClick?: () => void
}) {
  const base =
    "text-center bg-black text-white px-4 py-3 rounded-xl text-sm font-medium w-full sm:w-auto hover:opacity-90 transition"

  if (href) return <a href={href} className={base}>{children}</a>
  return <button onClick={onClick} className={base}>{children}</button>
}
