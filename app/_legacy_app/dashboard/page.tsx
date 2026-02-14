// ==========================================================
// HisabDesk — Dashboard (PERSONAL • PRIVATE • NO MARKETING)
// Phase 2.6 — Intelligence polish + Tax + Automation insights
// ==========================================================

import {
  calculateOldRegimeTax,
  calculateNewRegimeTax,
  calculate44ADA,
  getBestTaxOption,
} from "@/lib/tax"

import { getIncomeSummary } from "@/lib/api/income"
import { getExpenseSummary } from "@/lib/api/expenses"
import { loadDashboardData } from "@/lib/api/dashboard"

import IncomeExpenseChart from "@/components/IncomeExpenseChart"
import Checklist from "@/components/conversion/Checklist"
import UpgradePrompt from "@/components/conversion/UpgradePrompt"

import { Card } from "@/components/ui/card"

export const revalidate = 60

export default async function Dashboard() {
  const userId = "00000000-0000-0000-0000-000000000000"

  const [incomeSummary, expenseSummary, otherData] = await Promise.all([
    getIncomeSummary(userId),
    getExpenseSummary(userId),
    loadDashboardData(userId),
  ])

  const income = incomeSummary.totalIncome
  const expense = expenseSummary.totalExpense

  const {
    profile,
    incomes = [],
    expenses = [],
    deduction = 0,
    reminders = [],
    vault = [],
  } = otherData

  const name = profile?.full_name || "there"
  const onboardingDone = profile?.onboarding_completed

  // ========================================================
  // CALCULATIONS
  // ========================================================

  const profit = income - expense
  const taxable = Math.max(0, profit - deduction)

  const oldTax = calculateOldRegimeTax(taxable)
  const newTax = calculateNewRegimeTax(taxable)
  const adaTax = calculateOldRegimeTax(calculate44ADA(income))

  const bestTax = getBestTaxOption(oldTax, newTax, adaTax)

  const savingsRate =
    income > 0 ? Math.round((profit / income) * 100) : 0

  // ========================================================
  // GST PAYABLE
  // ========================================================

  const gstPayable = expenses.reduce((sum: number, e: any) => {
    const gst = Number(e.gst_percent || 0)
    return sum + (Number(e.amount || 0) * gst) / 100
  }, 0)

  // ========================================================
  // BURN RATE
  // ========================================================

  const burnRate =
    income > 0 ? Math.round((expense / income) * 100) : 0

  // ========================================================
  // NET WORTH
  // ========================================================

  let assets = 0
  let liabilities = 0

  vault.forEach((item: any) => {
    const m = item.metadata || {}

    if (["property", "tax", "insurance"].includes(item.category)) {
      assets += Number(m.current_value || m.amount || 0)
    }

    if (item.category === "loans") {
      liabilities += Number(m.outstanding || 0)
    }
  })

  const netWorth = assets - liabilities

  // ========================================================
  // ATTACHMENT / AUTOMATION INSIGHT
  // ========================================================

  const attachmentCount =
    [...incomes, ...expenses].filter((r: any) =>
      r.notes?.includes("http")
    ).length

  // ========================================================
  // CHART DATA
  // ========================================================

  const chartData = incomes.map((i: any, idx: number) => ({
    date: new Date(i.date).toLocaleDateString("en-IN", {
      month: "short",
    }),
    income: Number(i.amount || 0),
    expense: Number(expenses[idx]?.amount || 0),
  }))

  // ========================================================
  // TOP CATEGORY
  // ========================================================

  const categoryMap: Record<string, number> = {}

  expenses.forEach((e: any) => {
    const cat = e.category || "Misc"
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount || 0)
  })

  const topCategory =
    Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]

  // ========================================================
  // MONTHLY BUDGET ALERT ENGINE
  // ========================================================

  const budgetAlerts: string[] = []

  const DEFAULT_BUDGET_RATIO: Record<string, number> = {
    rent: 40,
    food: 20,
    shopping: 15,
    utilities: 15,
    medical: 10,
  }

  Object.entries(categoryMap).forEach(([cat, amt]) => {
    const ratio = DEFAULT_BUDGET_RATIO[cat.toLowerCase()]
    if (!ratio || income === 0) return

    const percent = (amt / income) * 100

    if (percent > ratio) {
      budgetAlerts.push(
        `${cat} spending is ${Math.round(percent)}% of income (limit ${ratio}%).`
      )
    }
  })

  if (expense > income * 0.9) {
    budgetAlerts.push(
      "Total expenses crossed 90% of income this period."
    )
  }

  // ========================================================
  // 🧠 AI INSIGHTS ENGINE
  // ========================================================

  const insights: string[] = []

  if (expense > income * 0.7) {
    insights.push(
      "You are spending more than 70% of income. Consider reducing discretionary costs."
    )
  }

  if (profit > 0) {
    insights.push(
      `You saved ₹ ${profit.toLocaleString("en-IN")} this period.`
    )
  }

  if (profit > 25000) {
    insights.push(
      "You have surplus cash. Consider investing or tax-saving instruments."
    )
  }

  if (bestTax === newTax) {
    insights.push(
      "New tax regime may save you more tax this year."
    )
  }

  insights.push(
    `Estimated annual tax: ₹ ${bestTax.toLocaleString("en-IN")}`
  )

  if (attachmentCount > 0) {
    insights.push(
      `${attachmentCount} bills uploaded. Automation ready for smart processing.`
    )
  }

  if (gstPayable > 10000) {
    insights.push(
      `GST payable this month is ₹ ${gstPayable.toLocaleString("en-IN")}.`
    )
  }

  if (burnRate > 80) {
    insights.push(
      "Your burn rate is very high. Expenses may be unsustainable."
    )
  }

  if (topCategory) {
    insights.push(
      `Highest expense category: ${topCategory[0]} (₹ ${topCategory[1].toLocaleString("en-IN")})`
    )
  }

  insights.push(...budgetAlerts)

  // ========================================================
  // ========================================================
  // ✅ NEW — CASHFLOW FORECAST (ADDED ONLY — NO CHANGES ABOVE)
  // ========================================================
  // ========================================================

  const monthIncomeMap: Record<string, number> = {}
  const monthExpenseMap: Record<string, number> = {}

  incomes.forEach((i: any) => {
    const d = new Date(i.date)
    const k = `${d.getFullYear()}-${d.getMonth()}`
    monthIncomeMap[k] = (monthIncomeMap[k] || 0) + Number(i.amount || 0)
  })

  expenses.forEach((e: any) => {
    const d = new Date(e.date)
    const k = `${d.getFullYear()}-${d.getMonth()}`
    monthExpenseMap[k] = (monthExpenseMap[k] || 0) + Number(e.amount || 0)
  })

  const avgMonthlyIncome =
    Object.values(monthIncomeMap).reduce((a, b) => a + b, 0) /
    Math.max(1, Object.keys(monthIncomeMap).length)

  const avgMonthlyExpense =
    Object.values(monthExpenseMap).reduce((a, b) => a + b, 0) /
    Math.max(1, Object.keys(monthExpenseMap).length)

  const monthlySurplus = avgMonthlyIncome - avgMonthlyExpense
  const forecast3MonthBalance = monthlySurplus * 3
  const safeToInvest = monthlySurplus > 0 ? monthlySurplus * 0.6 : 0

  insights.push(
    `Projected 3-month surplus: ₹ ${Math.round(forecast3MonthBalance).toLocaleString("en-IN")}`
  )

  if (safeToInvest > 0) {
    insights.push(
      `Safe to invest approx ₹ ${Math.round(safeToInvest).toLocaleString("en-IN")} per month`
    )
  }

  if (insights.length === 0) {
    insights.push("Your finances look stable. Keep tracking consistently.")
  }

  // ========================================================
  // UI (100% YOUR ORIGINAL — ONLY EXTRA CARDS ADDED BELOW)
  // ========================================================

  return (
    <main className="min-h-screen bg-white">
      <div className="container-app py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome, {name} 👋
          </h1>
          <p className="text-sm text-gray-500">
            Your personal finance manager
          </p>
        </div>

        {!onboardingDone && (
          <Card className="p-5 border border-blue-200 bg-blue-50">
            <p className="text-sm font-medium mb-2">
              Complete your profile to unlock tax insights
            </p>
            <a href="/profile/setup" className="btn">
              Start Questionnaire
            </a>
          </Card>
        )}

        {/* KPI GRID */}
        <div className="grid md:grid-cols-6 gap-4">

          <Card className="p-5">
            <p className="text-xs text-gray-500">Income</p>
            <p className="text-xl font-semibold text-green-600">
              ₹ {income.toLocaleString("en-IN")}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-gray-500">Expense</p>
            <p className="text-xl font-semibold text-red-600">
              ₹ {expense.toLocaleString("en-IN")}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-gray-500">Profit</p>
            <p className="text-xl font-semibold">
              ₹ {profit.toLocaleString("en-IN")}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-gray-500">Savings Rate</p>
            <p className="text-xl font-semibold text-blue-600">
              {savingsRate}%
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-gray-500">GST Payable</p>
            <p className="text-xl font-semibold text-orange-600">
              ₹ {gstPayable.toLocaleString("en-IN")}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-gray-500">Burn Rate</p>
            <p className="text-xl font-semibold text-purple-600">
              {burnRate}%
            </p>
          </Card>

        </div>

        {/* ============================= */}
        {/* ✅ NEW FORECAST CARDS ADDED */}
        {/* ============================= */}

        <div className="grid md:grid-cols-4 gap-4">

          <Card className="p-5">
            <p className="text-xs text-gray-500">Avg Monthly Income</p>
            <p className="text-lg font-semibold">
              ₹ {Math.round(avgMonthlyIncome).toLocaleString("en-IN")}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-gray-500">Avg Monthly Expense</p>
            <p className="text-lg font-semibold">
              ₹ {Math.round(avgMonthlyExpense).toLocaleString("en-IN")}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-gray-500">Monthly Surplus</p>
            <p className="text-lg font-semibold text-green-600">
              ₹ {Math.round(monthlySurplus).toLocaleString("en-IN")}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-gray-500">3M Forecast</p>
            <p className="text-lg font-semibold text-indigo-600">
              ₹ {Math.round(forecast3MonthBalance).toLocaleString("en-IN")}
            </p>
          </Card>

        </div>

      </div>
    </main>
  )
}
