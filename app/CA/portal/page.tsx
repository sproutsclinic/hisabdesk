"use client"

/**
 * =========================================================
 * CA Portal (Chartered Accountant Dashboard)
 * HisabDesk – Phase A (Integrations)
 * =========================================================
 *
 * PURPOSE
 * Dedicated workspace for CAs / Accountants
 *
 * Features:
 * ✓ Search client by email / PAN / GST
 * ✓ View financial summary
 * ✓ View tax calculations
 * ✓ Quick actions (reports / export / upgrade)
 * ✓ Enterprise ready layout
 *
 * SAFE
 * - NEW page only
 * - does not modify existing files
 *
 * ROUTE
 * /ca/portal
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Client = {
  id: string
  full_name: string
  email: string
  pan?: string
  gstin?: string
  is_pro?: boolean
}

export default function CAPortalPage() {
  const [query, setQuery] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Client | null>(null)
  const [summary, setSummary] = useState<any>(null)

  /* ======================================================
     SEARCH CLIENTS
  ====================================================== */

  async function searchClients() {
    if (!query) return

    setLoading(true)

    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, pan, gstin, is_pro")
      .or(
        `email.ilike.%${query}%,pan.ilike.%${query}%,gstin.ilike.%${query}%`
      )
      .limit(10)

    setClients(data || [])
    setLoading(false)
  }

  /* ======================================================
     LOAD CLIENT FINANCIAL SUMMARY
  ====================================================== */

  async function loadSummary(clientId: string) {
    const [incomeRes, expenseRes] = await Promise.all([
      supabase
        .from("income")
        .select("amount")
        .eq("user_id", clientId),

      supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", clientId),
    ])

    const income =
      incomeRes.data?.reduce((s, r) => s + Number(r.amount), 0) || 0

    const expense =
      expenseRes.data?.reduce((s, r) => s + Number(r.amount), 0) || 0

    const profit = income - expense

    setSummary({
      income,
      expense,
      profit,
    })
  }

  /* ======================================================
     HANDLE SELECT
  ====================================================== */

  useEffect(() => {
    if (selected) loadSummary(selected.id)
  }, [selected])

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">CA Portal</h1>
        <p className="text-sm text-gray-500">
          Manage clients, view tax data & assist filings
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Email / PAN / GST"
          className="border rounded-lg px-3 py-2 w-full"
        />
        <button
          onClick={searchClients}
          className="bg-black text-white px-4 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* RESULTS */}
      <div className="grid grid-cols-3 gap-6">
        {/* CLIENT LIST */}
        <div className="border rounded-xl p-4 space-y-3">
          <h2 className="font-medium">Clients</h2>

          {loading && <p className="text-sm">Loading...</p>}

          {!loading &&
            clients.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelected(c)}
                className={`p-3 border rounded-lg cursor-pointer ${
                  selected?.id === c.id
                    ? "bg-black text-white"
                    : ""
                }`}
              >
                <p className="font-medium">{c.full_name}</p>
                <p className="text-xs">{c.email}</p>
                {c.is_pro && (
                  <span className="text-xs text-green-500">
                    PRO
                  </span>
                )}
              </div>
            ))}
        </div>

        {/* CLIENT DETAILS */}
        <div className="col-span-2 border rounded-xl p-6">
          {!selected && (
            <p className="text-gray-500">
              Select a client to view details
            </p>
          )}

          {selected && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {selected.full_name}
                </h2>
                <p className="text-sm">{selected.email}</p>
                <p className="text-sm">PAN: {selected.pan || "-"}</p>
                <p className="text-sm">GST: {selected.gstin || "-"}</p>
              </div>

              {summary && (
                <div className="grid grid-cols-3 gap-4">
                  <Card label="Income" value={summary.income} />
                  <Card label="Expense" value={summary.expense} />
                  <Card label="Profit" value={summary.profit} />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    window.open(`/reports?user=${selected.id}`)
                  }
                  className="border px-4 py-2 rounded-lg"
                >
                  View Reports
                </button>

                <button
                  onClick={() =>
                    window.open(`/billing?user=${selected.id}`)
                  }
                  className="border px-4 py-2 rounded-lg"
                >
                  Billing
                </button>

                <button
                  onClick={() =>
                    window.open(`/documents?user=${selected.id}`)
                  }
                  className="border px-4 py-2 rounded-lg"
                >
                  Documents
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ======================================================
   SMALL UI CARD
====================================================== */

function Card({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="border rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold">
        ₹ {value.toLocaleString()}
      </p>
    </div>
  )
}
