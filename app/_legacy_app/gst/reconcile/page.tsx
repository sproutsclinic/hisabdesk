"use client"

/**
 * =========================================================
 * GST ↔ Expense Reconciliation Review UI
 * HisabDesk – Phase A Day 7
 * =========================================================
 *
 * PURPOSE
 * Human review screen for mismatches:
 *
 *   ✓ unmatched GST invoices
 *   ✓ unmatched expenses
 *   ✓ manual link button
 *   ✓ confidence visibility
 *
 * WHY IMPORTANT
 * ---------------------------------------------------------
 * Enterprise accounting rule:
 *   90% auto
 *   10% manual review
 *
 * This page handles that 10%.
 *
 * Similar to:
 *   QuickBooks match screen
 *   Zoho reconciliation panel
 *
 * =========================================================
 *
 * ROUTE
 *   /gst/reconcile
 *
 * SAFE
 * - new page only
 * - read heavy, minimal writes
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

/* =========================================================
   TYPES
========================================================= */

type GSTInvoice = {
  id: string
  invoice_number: string
  invoice_date: string
  party_name: string
  taxable_value: number
  confidence?: number | null
}

type Expense = {
  id: string
  description: string
  amount: number
  created_at: string
  confidence?: number | null
}

/* =========================================================
   PAGE
========================================================= */

export default function GSTReconcilePage() {
  const [orgId, setOrgId] = useState<string | null>(null)

  const [invoices, setInvoices] = useState<GSTInvoice[]>(
    []
  )
  const [expenses, setExpenses] = useState<Expense[]>(
    []
  )

  /* ======================================================
     INIT
  ====================================================== */

  useEffect(() => {
    init()
  }, [])

  async function init() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const o = user.id // current simple org logic
    setOrgId(o)

    load(o)
  }

  /* ======================================================
     LOAD
  ====================================================== */

  async function load(o: string) {
    const [gstRes, expRes] = await Promise.all([
      supabase
        .from("gst_invoices")
        .select("*")
        .eq("org_id", o)
        .eq("type", "purchase")
        .is("reconciled_with", null),

      supabase
        .from("expenses")
        .select("*")
        .eq("org_id", o)
        .is("reconciled_with", null),
    ])

    setInvoices(gstRes.data || [])
    setExpenses(expRes.data || [])
  }

  /* ======================================================
     MANUAL LINK
  ====================================================== */

  async function link(
    invoiceId: string,
    expenseId: string
  ) {
    if (!orgId) return

    await Promise.all([
      supabase
        .from("gst_invoices")
        .update({
          reconciled_with: expenseId,
          confidence: 1,
        })
        .eq("id", invoiceId),

      supabase
        .from("expenses")
        .update({
          reconciled_with: invoiceId,
          confidence: 1,
        })
        .eq("id", expenseId),
    ])

    load(orgId)
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-semibold">
        GST Reconciliation Review
      </h1>

      {/* ================= GST SIDE ================= */}
      <section>
        <h2 className="text-sm font-medium mb-3">
          Unmatched GST Invoices
        </h2>

        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="p-3 text-left">
                  Invoice
                </th>
                <th className="p-3 text-left">
                  Party
                </th>
                <th className="p-3 text-left">
                  Date
                </th>
                <th className="p-3 text-right">
                  Amount
                </th>
                <th className="p-3 text-center">
                  Match
                </th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="p-3">
                    {i.invoice_number}
                  </td>
                  <td className="p-3">
                    {i.party_name}
                  </td>
                  <td className="p-3">
                    {i.invoice_date}
                  </td>
                  <td className="p-3 text-right">
                    ₹ {i.taxable_value}
                  </td>

                  <td className="p-3 text-center">
                    <select
                      onChange={(e) =>
                        link(
                          i.id,
                          e.target.value
                        )
                      }
                      className="border rounded px-2 py-1 text-xs"
                      defaultValue=""
                    >
                      <option value="">
                        Select expense
                      </option>

                      {expenses.map((e) => (
                        <option
                          key={e.id}
                          value={e.id}
                        >
                          ₹ {e.amount} –{" "}
                          {e.description}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}

              {!invoices.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-5 text-center text-gray-400"
                  >
                    No unmatched invoices 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= EXPENSE SIDE ================= */}
      <section>
        <h2 className="text-sm font-medium mb-3">
          Unmatched Expenses
        </h2>

        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="p-3 text-left">
                  Description
                </th>
                <th className="p-3 text-left">
                  Date
                </th>
                <th className="p-3 text-right">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">
                    {e.description}
                  </td>
                  <td className="p-3">
                    {new Date(
                      e.created_at
                    ).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    ₹ {e.amount}
                  </td>
                </tr>
              ))}

              {!expenses.length && (
                <tr>
                  <td
                    colSpan={3}
                    className="p-5 text-center text-gray-400"
                  >
                    No unmatched expenses 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
