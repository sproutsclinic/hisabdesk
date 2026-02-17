ï»¿"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { getIncomeSummary } from "@/lib/api/income"
import { getExpenseSummary } from "@/lib/api/expenses"
import { loadDashboardData } from "@/lib/api/dashboard"
import { getSupabaseClient } from "@/lib/supabase"

export default function InsightsPage() {
  const supabase = getSupabaseClient()

  const [loading, setLoading] = useState(true)

  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [avgExpense, setAvgExpense] = useState(0)

  const [alerts, setAlerts] = useState<string[]>([])
  const [tips, setTips] = useState<string[]>([])
  const [positives, setPositives] = useState<string[]>([])

  /* ===============================
     AI STATE
  =============================== */

  const [aiSummary, setAiSummary] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  /* ===============================
     LOAD DATA (initial)
  =============================== */

  useEffect(() => {
    load()
  }, [])

  /* ===============================
     AUTO REFRESH AI SUMMARY
  =============================== */

  useEffect(() => {
    if (income === 0 && expense === 0) return
    fetchAISummary()
  }, [income, expense])

  /* =============================== */

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const [incomeSummary, expenseSummary, data] = await Promise.all([
      getIncomeSummary(user.id),
      getExpenseSummary(user.id),
      loadDashboardData(user.id),
    ])

    const incomes = data?.incomes || []
    const expenses = data?.expenses || []

    const totalIncome = Number(incomeSummary?.totalIncome || 0)
    const totalExpense = Number(expenseSummary?.totalExpense || 0)

    setIncome(totalIncome)
    setExpense(totalExpense)

    const avgExpLocal =
      expenses.length > 0
        ? Math.round(totalExpense / expenses.length)
        : 0

    setAvgExpense(avgExpLocal)

    /* ===============================
       LOCAL RULE ENGINE
    =============================== */

    const savings = totalIncome - totalExpense
    const savingsRate = totalIncome ? (savings / totalIncome) * 100 : 0
    const burnRate = totalIncome ? (totalExpense / totalIncome) * 100 : 0

    const a: string[] = []
    const t: string[] = []
    const p: string[] = []

    if (burnRate > 90) a.push("Your expenses are extremely high vs income.")
    if (savingsRate < 10) a.push("Savings rate is dangerously low.")

    if (savings > 20000)
      t.push("Invest surplus into SIP or index funds.")

    if (avgExpLocal > 2500)
      t.push("Reduce high-value discretionary spends.")

    if (savingsRate > 30) p.push("Excellent savings discipline.")
    if (burnRate < 60) p.push("Spending is well controlled.")

    if (!a.length && !p.length)
      p.push("Your finances look stable and balanced.")

    setAlerts(a)
    setTips(t)
    setPositives(p)

    setLoading(false)
  }

  /* ===============================
     AI API CALL (SECURE)
  =============================== */

  async function fetchAISummary() {
    try {
      setAiLoading(true)

      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()
      setAiSummary(data.text || "")
    } catch {
      setAiSummary("AI analysis temporarily unavailable.")
    }

    setAiLoading(false)
  }

  /* =============================== */

  const savings = income - expense
  const savingsRate = income ? Math.round((savings / income) * 100) : 0
  const burnRate = income ? Math.round((expense / income) * 100) : 0

  /* ===============================
     UI
  =============================== */

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-semibold">AI Insights</h1>
        <p className="text-sm text-gray-500">
          Your personal financial intelligence center
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric title="Savings Rate" value={`${savingsRate}%`} />
        <Metric title="Burn Rate" value={`${burnRate}%`} />
        <Metric title="Avg Expense" value={`ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ${avgExpense}`} />
        <Metric title="Net Savings" value={`ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ${savings.toLocaleString("en-IN")}`} />
      </div>

      {loading && (
        <Card className="p-6 text-sm text-gray-500">
          Analysing your finances...
        </Card>
      )}

      {alerts.length > 0 && (
        <Card className="p-5 bg-red-50 space-y-2 text-sm">
          {alerts.map((a, i) => <p key={i}>ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â {a}</p>)}
        </Card>
      )}

      {tips.length > 0 && (
        <Card className="p-5 bg-amber-50 space-y-2 text-sm">
          {tips.map((t, i) => <p key={i}>ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ {t}</p>)}
        </Card>
      )}

      <Card className="p-5 bg-green-50 space-y-2 text-sm">
        {positives.map((p, i) => <p key={i}>ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ {p}</p>)}
      </Card>

      {/* AI */}
      <Card className="p-5 space-y-3 bg-slate-50 border">
        <p className="font-medium text-sm">AI Financial Analysis</p>

        {aiLoading && (
          <p className="text-sm text-gray-500">Generating AI insights...</p>
        )}

        {!aiLoading && aiSummary && (
          <div className="text-sm whitespace-pre-wrap leading-relaxed">
            {aiSummary}
          </div>
        )}
      </Card>

    </div>
  )
}

/* =============================== */

function Metric({ title, value }: any) {
  return (
    <Card className="p-4">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
    </Card>
  )
}
