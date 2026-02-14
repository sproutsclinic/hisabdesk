/**
 * =========================================================
 * Organization Finances Page (SERVER • PRODUCTION SAFE)
 * =========================================================
 */

import { getSupabaseServer } from "@/lib/supabase"
import OrgFinanceClient from "./OrgFinanceClient"

type Row = {
  id: string
  amount: number
  description?: string | null
  created_at: string
}

export const dynamic = "force-dynamic"

export default async function OrgFinancesPage({
  params,
}: {
  params: { orgId: string }
}) {
  const supabase = getSupabaseServer()
  const orgId = params.orgId

  /* ======================================================
     SERVER QUERIES (parallel + minimal fields only)
  ====================================================== */

  const [incomeRes, expenseRes] = await Promise.all([
    supabase
      .from("income")
      .select("id,amount,description,created_at")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(100),

    supabase
      .from("expenses")
      .select("id,amount,description,created_at")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(100),
  ])

  const income = (incomeRes.data ?? []) as Row[]
  const expenses = (expenseRes.data ?? []) as Row[]

  const totalIncome = income.reduce(
    (s, r) => s + Number(r.amount || 0),
    0
  )

  const totalExpense = expenses.reduce(
    (s, r) => s + Number(r.amount || 0),
    0
  )

  const profit = totalIncome - totalExpense

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-2xl font-semibold">Finances</h2>
        <p className="text-sm text-gray-500">
          Track organization income & expenses
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card label="Income" value={totalIncome} />
        <Card label="Expenses" value={totalExpense} />
        <Card label="Profit" value={profit} />
      </div>

      {/* client-only form + actions */}
      <OrgFinanceClient
        orgId={orgId}
        initialIncome={income}
        initialExpenses={expenses}
      />

    </div>
  )
}

/* ====================================================== */

function Card({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="border rounded-xl p-5 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold">
        ₹ {value.toLocaleString("en-IN")}
      </p>
    </div>
  )
}
