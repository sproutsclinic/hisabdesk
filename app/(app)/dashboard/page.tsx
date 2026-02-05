"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import {
  calculateOldRegimeTax,
  calculateNewRegimeTax,
  calculate44ADA,
  getBestTaxOption
} from "@/lib/tax"

import { generateTaxPDF } from "@/lib/pdf"
import { isProUser } from "@/lib/isPro"
import { track } from "@/lib/analytics"

import IncomeExpenseChart from "@/components/IncomeExpenseChart"
import EmptyState from "@/components/ui/EmptyState" // ✅ ONLY NEW IMPORT

import Checklist from "@/components/conversion/Checklist"
import UpgradePrompt from "@/components/conversion/UpgradePrompt"
import ReferralBanner from "@/components/conversion/ReferralBanner"
import Testimonials from "@/components/Testimonials"

import BurnMeter from "@/components/dashboard/BurnMeter"
import SavingsCounter from "@/components/dashboard/SavingsCounter"
import QuickActions from "@/components/dashboard/QuickActions"
import Timeline from "@/components/dashboard/Timeline"

export default function Dashboard() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [deductions, setDeductions] = useState(0)

  const [incomeRows, setIncomeRows] = useState<any[]>([])
  const [expenseRows, setExpenseRows] = useState<any[]>([])

  const [aiTips, setAiTips] = useState("")
  const [loadingAI, setLoadingAI] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  /* ================= INIT ================= */

  useEffect(() => {
    init()
    track("dashboard_view")
  }, [])

  const init = async () => {
    const user = await guardUser()
    if (!user) return

    await Promise.all([
      loadData(user.id),
      loadPro(user.id)
    ])

    setLoading(false)
  }

  /* ================= AUTH ================= */

  const guardUser = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      router.push("/login")
      return null
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_profile")
      .eq("id", data.user.id)
      .single()

    if (
      !profile?.onboarding_profile ||
      Object.keys(profile.onboarding_profile).length === 0
    ) {
      router.push("/onboarding")
      return null
    }

    return data.user
  }

  /* ================= DATA ================= */

  const loadData = async (userId: string) => {
    const [incomesRes, expensesRes, deductionsRes] = await Promise.all([
      supabase.from("incomes").select("amount,date").eq("user_id", userId),
      supabase.from("expenses").select("amount,date").eq("user_id", userId),
      supabase.from("deductions").select("total").eq("user_id", userId).single()
    ])

    const incomes = incomesRes.data || []
    const expenses = expensesRes.data || []
    const deductionRow = deductionsRes.data

    setIncomeRows(incomes)
    setExpenseRows(expenses)

    setIncome(incomes.reduce((s: number, i: any) => s + Number(i.amount), 0))
    setExpense(expenses.reduce((s: number, e: any) => s + Number(e.amount), 0))
    setDeductions(deductionRow?.total || 0)
  }

  const loadPro = async (userId: string) => {
    setIsPro(await isProUser(userId))
  }

  /* ================= SKELETON ================= */

  if (loading) {
    return (
      <div className="container-app py-8 space-y-6">
        <div className="skeleton h-6 w-40" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="skeleton h-40" />
          <div className="skeleton h-40" />
        </div>
        <div className="skeleton h-56" />
      </div>
    )
  }

  /* ================= EMPTY STATE (ONLY NEW ADDITION) ================= */

  const noData = incomeRows.length === 0 && expenseRows.length === 0

  if (noData) {
    return (
      <div className="container-app py-12">
        <EmptyState
          title="No transactions yet"
          description="Add your first income or expense to start tracking tax savings"
          actionHref="/income/add"
          actionLabel="Add Income"
        />
      </div>
    )
  }

  /* ================= CALC ================= */

  const profit = income - expense
  const taxable = profit - deductions

  const oldTax = calculateOldRegimeTax(taxable)
  const newTax = calculateNewRegimeTax(taxable)
  const adaTax = calculateOldRegimeTax(calculate44ADA(income))

  const best = getBestTaxOption(oldTax, newTax, adaTax)
  const savings = Math.max(profit - best.value, 0)

  const chartData = incomeRows.map((i: any, idx: number) => ({
    date: new Date(i.date).toLocaleDateString("en-IN", { month: "short" }),
    income: Number(i.amount),
    expense: Number(expenseRows[idx]?.amount || 0)
  }))

  /* ================= ACTIONS (UNCHANGED) ================= */

  const getAITips = async () => {
    if (!isPro || loadingAI) return router.push("/billing")

    setLoadingAI(true)

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ income, expense, deductions })
    })

    const data = await res.json()
    setAiTips(data.advice)
    setLoadingAI(false)
  }

  const downloadReport = () => {
    if (!isPro) return router.push("/billing")

    setDownloaded(true)

    generateTaxPDF({
      income,
      expense,
      deductions,
      profit,
      best: best.label
    })
  }

  /* ================= UI (100% YOUR ORIGINAL) ================= */

  return (
    <div className="container-app py-8 space-y-8">

      <h1 className="heading-lg">Tax Health</h1>

      <UpgradePrompt show={!isPro} />

      <Checklist
        hasIncome={income > 0}
        hasExpense={expense > 0}
        isPro={isPro}
      />

      <ReferralBanner />

      <div className="grid md:grid-cols-2 gap-6">
        <BurnMeter income={income} expense={expense} tax={best.value} />
        <SavingsCounter savings={savings} />
      </div>

      <QuickActions />

      <div className="card">
        <IncomeExpenseChart data={chartData} />
      </div>

      <Timeline />

      <div className="grid grid-cols-2 sm:flex gap-3">

        <button
          onClick={getAITips}
          disabled={!isPro}
          className={`btn ${!isPro ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loadingAI ? "Loading..." : isPro ? "AI Advisor" : "AI Advisor 🔒"}
        </button>

        <button
          onClick={downloadReport}
          disabled={!isPro}
          className={`btn ${!isPro ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isPro ? "Download PDF" : "Download PDF 🔒"}
        </button>

      </div>

      {aiTips && (
        <div className="card">
          <h2 className="font-bold mb-2">AI Suggestions</h2>
          <p>{aiTips}</p>
        </div>
      )}

      <Testimonials />

    </div>
  )
}
