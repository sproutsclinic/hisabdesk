/**
 * =========================================================
 * Organization Overview Dashboard (SERVER • PRODUCTION SAFE)
 * =========================================================
 */

import Link from "next/link"
import { getSupabaseServer } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default async function OrgOverviewPage({
  params,
}: {
  params: { orgId: string }
}) {
  const supabase = getSupabaseServer()
  const orgId = params.orgId

  /* ======================================================
     PARALLEL SERVER QUERIES (FAST)
  ====================================================== */

  const [memberRes, incomeRes, expenseRes] = await Promise.all([
    supabase
      .from("organization_members")
      .select("*", { count: "exact", head: true })
      .eq("org_id", orgId),

    supabase
      .from("income")
      .select("amount")
      .eq("org_id", orgId),

    supabase
      .from("expenses")
      .select("amount")
      .eq("org_id", orgId),
  ])

  const income =
    incomeRes.data?.reduce(
      (s, r) => s + Number(r.amount || 0),
      0
    ) || 0

  const expenses =
    expenseRes.data?.reduce(
      (s, r) => s + Number(r.amount || 0),
      0
    ) || 0

  const members = memberRes.count || 0
  const profit = income - expenses

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-sm text-gray-500">
          Organization financial snapshot
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <Card label="Income" value={income} />
        <Card label="Expenses" value={expenses} />
        <Card label="Profit" value={profit} />
        <Card label="Members" value={members} />
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex gap-4">
        <Action href={`/org/${orgId}/finances`} label="Manage Finances" />
        <Action href={`/org/${orgId}/tax`} label="Tax Center" />
        <Action href={`/org/${orgId}/members`} label="Team" />
        <Action href={`/org/${orgId}/billing`} label="Billing" />
      </div>

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
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  )
}

function Action({
  href,
  label,
}: {
  href: string
  label: string
}) {
  return (
    <Link
      href={href}
      className="border px-4 py-2 rounded-lg hover:bg-gray-100"
    >
      {label}
    </Link>
  )
}
