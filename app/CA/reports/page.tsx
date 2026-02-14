"use client"

/**
 * =========================================================
 * CA Consolidated Reports (Firm Level Analytics)
 * HisabDesk – CA Portal (Multi-Client Reporting)
 * =========================================================
 *
 * ROUTE
 *   /ca/reports
 *
 * PURPOSE
 * Firm-wide consolidated insights:
 *
 *   ✓ total clients
 *   ✓ combined income
 *   ✓ combined expenses
 *   ✓ combined profit
 *   ✓ export CSV for ALL clients
 *
 * WHY IMPORTANT
 * CAs want:
 *   "Show me numbers across all clients"
 *
 * This page gives:
 *   Portfolio view (not single org)
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Org = {
  id: string
  name: string
}

export default function CAReportsPage() {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    profit: 0,
  })

  /* ======================================================
     LOAD ALL CLIENT DATA
  ====================================================== */

  useEffect(() => {
    async function load() {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      /* get all orgs */
      const { data: memberships } = await supabase
        .from("organization_members")
        .select("organizations(id, name)")
        .eq("user_id", user.id)

      const list =
        memberships
          ?.map((m: any) => m.organizations)
          .filter(Boolean) || []

      setOrgs(list)

      let totalIncome = 0
      let totalExpense = 0

      /* aggregate each org */
      for (const o of list) {
        const [i, e] = await Promise.all([
          supabase
            .from("income")
            .select("amount")
            .eq("org_id", o.id),

          supabase
            .from("expenses")
            .select("amount")
            .eq("org_id", o.id),
        ])

        totalIncome +=
          i.data?.reduce(
            (s: number, r: any) => s + Number(r.amount),
            0
          ) || 0

        totalExpense +=
          e.data?.reduce(
            (s: number, r: any) => s + Number(r.amount),
            0
          ) || 0
      }

      setStats({
        income: totalIncome,
        expenses: totalExpense,
        profit: totalIncome - totalExpense,
      })

      setLoading(false)
    }

    load()
  }, [])

  /* ======================================================
     EXPORT ALL CSV
  ====================================================== */

  async function exportAll() {
    const rows: string[] = []

    for (const o of orgs) {
      const { data } = await supabase
        .from("income")
        .select("amount")
        .eq("org_id", o.id)

      const total =
        data?.reduce(
          (s: number, r: any) => s + Number(r.amount),
          0
        ) || 0

      rows.push(`${o.name},${total}`)
    }

    const csv =
      "Client,Income\n" + rows.join("\n")

    const blob = new Blob([csv], {
      type: "text/csv",
    })

    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "clients-income.csv"
    a.click()

    URL.revokeObjectURL(url)
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Firm Reports
        </h1>
        <p className="text-sm text-gray-500">
          Consolidated view across all clients
        </p>
      </div>

      {loading && <p>Loading...</p>}

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <Card label="Total Income" value={stats.income} />
        <Card label="Total Expense" value={stats.expenses} />
        <Card label="Total Profit" value={stats.profit} />
      </div>

      <button
        onClick={exportAll}
        className="bg-black text-white px-5 py-2 rounded-lg"
      >
        Export Client Income CSV
      </button>
    </div>
  )
}

/* ======================================================
   CARD
====================================================== */

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
        ₹ {value.toLocaleString()}
      </p>
    </div>
  )
}
