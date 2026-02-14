// ==========================================================
// HisabDesk — Insights Page
// Server Component
// Enterprise • Clean • Read-only analytics
// ==========================================================

import { Card } from "@/components/ui/card"
import { getIncomeSummary } from "@/lib/api/income"
import { getExpenseSummary } from "@/lib/api/expenses"

export const dynamic = "force-dynamic"

export default async function InsightsPage() {
  const userId = "00000000-0000-0000-0000-000000000000"

  const [incomeSummary, expenseSummary] = await Promise.all([
    getIncomeSummary(userId),
    getExpenseSummary(userId),
  ])

  const income = incomeSummary.totalIncome || 0
  const expense = expenseSummary.totalExpense || 0

  const profit = income - expense
  const savingsRate =
    income > 0 ? Math.round((profit / income) * 100) : 0

  const format = (n: number) =>
    `₹ ${Number(n || 0).toLocaleString("en-IN")}`

  return (
    <main className="container-app space-y-6">
      {/* Header */}
      <div>
        <h1 className="heading-lg">Insights</h1>
        <p className="muted">
          Financial performance summary & quick intelligence
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="muted">Total Income</p>
          <p className="text-lg font-semibold text-green-600">
            {format(income)}
          </p>
        </Card>

        <Card className="p-5">
          <p className="muted">Total Expense</p>
          <p className="text-lg font-semibold text-red-600">
            {format(expense)}
          </p>
        </Card>

        <Card className="p-5">
          <p className="muted">Net Profit</p>
          <p className="text-lg font-semibold">
            {format(profit)}
          </p>
        </Card>

        <Card className="p-5">
          <p className="muted">Savings Rate</p>
          <p className="text-lg font-semibold text-blue-600">
            {savingsRate}%
          </p>
        </Card>
      </div>

      {/* Simple Intelligence */}
      <Card className="p-5 space-y-2">
        <p className="text-sm font-medium">Smart Observations</p>

        {expense > income * 0.8 && (
          <p className="text-sm text-red-600">
            Expenses are very high. Consider reducing discretionary spending.
          </p>
        )}

        {savingsRate >= 30 && (
          <p className="text-sm text-green-600">
            Healthy savings rate. You are managing finances well.
          </p>
        )}

        {profit > 25000 && (
          <p className="text-sm text-blue-600">
            Surplus available. Consider investments or tax-saving instruments.
          </p>
        )}

        {income === 0 && expense === 0 && (
          <p className="text-sm text-gray-500">
            Add transactions to unlock insights.
          </p>
        )}
      </Card>
    </main>
  )
}
