"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import {
  calculateOldRegimeTax,
  calculateNewRegimeTax,
  calculate44ADA,
  getBestTaxOption,
} from "@/lib/tax"

import { isProUser } from "@/lib/isPro"
import { track } from "@/lib/analytics"

import IncomeExpenseChart from "@/components/IncomeExpenseChart"
import Checklist from "@/components/conversion/Checklist"
import UpgradePrompt from "@/components/conversion/UpgradePrompt"
import ReferralBanner from "@/components/conversion/ReferralBanner"
import Testimonials from "@/components/Testimonials"

import { Card } from "@/components/ui/card"
import { SkeletonList } from "@/components/ui/skeleton"

import {
  BellRing,
  Landmark,
  Sparkles,
  ShieldAlert,
} from "lucide-react"

/* =================================================
   DASHBOARD — PRO LOCKED + EXPIRY REMINDER

   ✅ Net worth
   ✅ Reminders
   ✅ Risk alerts
   ✅ Insights (PRO only)
   ✅ 🔥 Pro expiry banner (Phase 13)
================================================= */

type Reminder = {
  id: string
  reminder_date: string
  type: string
  vault_items?: { title: string }
}

type Insight = {
  type: string
  message: string
}

export default function Dashboard() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [incomeRows, setIncomeRows] = useState<any[]>([])
  const [expenseRows, setExpenseRows] = useState<any[]>([])

  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [deductions, setDeductions] = useState(0)

  const [isPro, setIsPro] = useState(false)

  const [reminders, setReminders] = useState<Reminder[]>([])
  const [risks, setRisks] = useState<Insight[]>([])
  const [insights, setInsights] = useState<Insight[]>([])

  const [assets, setAssets] = useState(0)
  const [liabilities, setLiabilities] = useState(0)

  /* 🔥 NEW */
  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  /* ================= INIT ================= */

  useEffect(() => {
    track("dashboard_view")
    init()
  }, [])

  const init = async () => {
    const user = await guardUser()
    if (!user) return

    const pro = await isProUser(user.id)
    setIsPro(pro)

    await Promise.all([
      loadData(user.id),
      loadReminders(user.id),
      loadNetWorth(user.id),

      fetch("/api/reminders/auto", { method: "POST" }),
      fetch("/api/vault/risk").then((r) => r.json()).then(setRisks),

      /* 🔒 PRO ONLY */
      pro
        ? Promise.all([
            fetch("/api/vault/insights").then((r) => r.json()).then(setInsights),
            loadExpiryReminder(),
          ])
        : Promise.resolve(),
    ])

    setLoading(false)
  }

  /* ================= EXPIRY REMINDER ================= */

  const loadExpiryReminder = async () => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) return

    const res = await fetch("/api/pro/reminders", {
      headers: { Authorization: `Bearer ${token}` },
    })

    const json = await res.json()

    if (json?.length > 0) {
      setDaysLeft(json[0].daysLeft)
    }
  }

  /* ================= AUTH ================= */

  const guardUser = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      router.push("/login")
      return null
    }

    return data.user
  }

  /* ================= DATA ================= */

  const loadData = async (userId: string) => {
    const [inc, exp, ded] = await Promise.all([
      supabase.from("incomes").select("amount,date").eq("user_id", userId),
      supabase.from("expenses").select("amount,date").eq("user_id", userId),
      supabase.from("deductions").select("total").eq("user_id", userId).single(),
    ])

    const incomes = inc.data || []
    const expenses = exp.data || []

    setIncomeRows(incomes)
    setExpenseRows(expenses)

    setIncome(incomes.reduce((s: number, i: any) => s + Number(i.amount), 0))
    setExpense(expenses.reduce((s: number, e: any) => s + Number(e.amount), 0))
    setDeductions(ded.data?.total || 0)
  }

  const loadReminders = async (userId: string) => {
    const today = new Date()
    const next7 = new Date()
    next7.setDate(today.getDate() + 7)

    const { data } = await supabase
      .from("reminders")
      .select("id, reminder_date, type, vault_items(title)")
      .eq("user_id", userId)
      .gte("reminder_date", today.toISOString())
      .lte("reminder_date", next7.toISOString())
      .eq("status", "pending")

    setReminders(data || [])
  }

  const loadNetWorth = async (userId: string) => {
    const { data } = await supabase
      .from("vault_items")
      .select("category, metadata")
      .eq("user_id", userId)

    let a = 0
    let l = 0

    ;(data || []).forEach((item: any) => {
      const m = item.metadata || {}

      if (["property", "tax", "insurance"].includes(item.category))
        a += Number(m.current_value || m.amount || 0)

      if (item.category === "loans") l += Number(m.outstanding || 0)
    })

    setAssets(a)
    setLiabilities(l)
  }

  /* ================= CALC ================= */

  const profit = useMemo(() => income - expense, [income, expense])
  const taxable = useMemo(() => profit - deductions, [profit, deductions])

  const oldTax = calculateOldRegimeTax(taxable)
  const newTax = calculateNewRegimeTax(taxable)
  const adaTax = calculateOldRegimeTax(calculate44ADA(income))

  const best = getBestTaxOption(oldTax, newTax, adaTax)

  const netWorth = assets - liabilities

  const chartData = incomeRows.map((i: any, idx: number) => ({
    date: new Date(i.date).toLocaleDateString("en-IN", { month: "short" }),
    income: Number(i.amount),
    expense: Number(expenseRows[idx]?.amount || 0),
  }))

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <SkeletonList count={6} />
      </div>
    )
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-8">

      {/* 🔥 PRO EXPIRY BANNER */}
      {isPro && daysLeft !== null && (
        <Card
          className="bg-amber-50 border-amber-300 cursor-pointer text-sm text-center"
          onClick={() => router.push("/billing")}
        >
          ⚠️ Your Pro plan expires in <b>{daysLeft}</b> day
          {daysLeft !== 1 && "s"} — Renew now
        </Card>
      )}

      {/* Net Worth */}
      <Card className="bg-indigo-50 border-indigo-200 space-y-2">
        <div className="flex items-center gap-2 text-indigo-700 text-sm font-medium">
          <Landmark size={14} />
          Family Net Worth
        </div>
        <p className="text-2xl font-bold">
          ₹ {netWorth.toLocaleString("en-IN")}
        </p>
      </Card>

      {/* Reminders */}
      {reminders.length > 0 && (
        <Card className="space-y-2">
          <BellRing size={14} />
          {reminders.map((r) => (
            <p key={r.id} className="text-xs">{r.vault_items?.title}</p>
          ))}
        </Card>
      )}

      {/* Risks */}
      {risks.length > 0 && (
        <Card className="space-y-2">
          <ShieldAlert size={14} />
          {risks.map((r, i) => (
            <p key={i} className="text-xs">{r.message}</p>
          ))}
        </Card>
      )}

      {/* Insights */}
      {isPro ? (
        insights.length > 0 && (
          <Card className="space-y-2">
            <Sparkles size={14} />
            {insights.map((i, idx) => (
              <p key={idx} className="text-xs">{i.message}</p>
            ))}
          </Card>
        )
      ) : (
        <Card
          className="cursor-pointer text-center text-sm opacity-80"
          onClick={() => router.push("/billing")}
        >
          🔒 Smart Insights (Upgrade to Pro)
        </Card>
      )}

      <UpgradePrompt show={!isPro} />
      <Checklist hasIncome={income > 0} hasExpense={expense > 0} isPro={isPro} />
      <ReferralBanner />

      <Card>
        <IncomeExpenseChart data={chartData} />
      </Card>

      <Testimonials />

    </div>
  )
}
