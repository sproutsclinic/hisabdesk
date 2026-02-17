ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Personal Dashboard (FINAL ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Server Safe)
// ==========================================================

import Link from "next/link"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"

import { getSupabaseAdmin } from "@/lib/supabase/server"

import { getIncomeSummary } from "@/lib/api/income"
import { getExpenseSummary } from "@/lib/api/expenses"
import { loadDashboardData } from "@/lib/api/dashboard"

import AIInsightsCard from "./AIInsightsCard"

import {
  DashboardAISection,
  DashboardWidgetsSection,
} from "./sections"

import AreaTrendChart from "@/components/charts/AreaTrendChart"
import { formatCurrency } from "@/lib/utils/formatCurrency"

export const dynamic = "force-dynamic"

// ==========================================================

export default async function DashboardPage() {
  // --------------------------------------------------------
  // AUTH (Server-Side)
  // --------------------------------------------------------

  const supabase = getSupabaseAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/")

  const userId = user.id

  // --------------------------------------------------------
  // Safe wrapper (prevents dashboard crash)
  // --------------------------------------------------------

  async function safe(promise: Promise<any>, fallback: any) {
    try {
      return await promise
    } catch {
      return fallback
    }
  }

  // --------------------------------------------------------
  // Load Data WITH USER ID (FIX)
  // --------------------------------------------------------

  const incomeSummary = await safe(getIncomeSummary(userId), {
    totalIncome: 0,
  })

  const expenseSummary = await safe(getExpenseSummary(userId), {
    totalExpense: 0,
  })

  const data = await safe(loadDashboardData(userId), {})

  // --------------------------------------------------------
  // Compute
  // --------------------------------------------------------

  const income = Number(incomeSummary?.totalIncome || 0)
  const expense = Number(expenseSummary?.totalExpense || 0)

  const { profile, monthlySeries } = data || {}

  const name = profile?.full_name || "there"

  const savings = income - expense
  const savingsRate =
    income > 0 ? Math.round((savings / income) * 100) : 0

  const burnRate =
    income > 0 ? Math.round((expense / income) * 100) : 0

  const insights: string[] = []

  if (burnRate > 80)
    insights.push("Expenses are too high compared to income")

  if (savingsRate < 20)
    insights.push("Try saving at least 20% of your income")

  if (savings > 30000)
    insights.push("You have surplus money. Consider investing")

  if (insights.length === 0)
    insights.push("Your finances look stable ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¹Ã…â€œÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â")

  // ======================================================
  // UI
  // ======================================================

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Hello {name} ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¹Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¹
        </h1>
        <p className="text-sm text-gray-500">
          Your financial command center
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/expense/add">
          <Card className="p-4 text-center font-medium">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ Add Expense</Card>
        </Link>

        <Link href="/income/add">
          <Card className="p-4 text-center font-medium">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ Add Income</Card>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat title="Income" value={income} color="text-green-600" />
        <Stat title="Expense" value={expense} color="text-red-600" />
        <Stat title="Savings" value={savings} color="text-blue-600" />
        <Stat title="Savings %" value={`${savingsRate}%`} />
      </div>

      {Array.isArray(monthlySeries) && monthlySeries.length > 0 && (
        <AreaTrendChart title="Monthly Cashflow Trend" data={monthlySeries} />
      )}

      <Card className="p-4 bg-blue-50 border-blue-200 text-sm space-y-1">
        {insights.map((i, idx) => (
          <p key={idx}>ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ {i}</p>
        ))}
      </Card>

      <AIInsightsCard
        income={income}
        expense={expense}
        networth={savings}
        savingsRate={savingsRate}
      />

      <DashboardWidgetsSection />

      <DashboardAISection
        income={income}
        expense={expense}
        networth={savings}
        savingsRate={savingsRate}
      />
    </main>
  )
}

// ==========================================================
// STAT CARD
// ==========================================================

type StatProps = {
  title: string
  value: number | string
  color?: string
}

function Stat({ title, value, color = "" }: StatProps) {
  const display =
    typeof value === "number"
      ? formatCurrency(value)
      : value

  return (
    <Card className="p-4">
      <p className="text-xs text-gray-500">{title}</p>
      <p className={`text-lg font-semibold ${color}`}>{display}</p>
    </Card>
  )
}


