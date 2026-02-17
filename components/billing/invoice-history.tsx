ï»¿"use client"

/**
 * =========================================================
 * Invoice History (Billing Transactions List)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Billing Transparency Layer
 * =========================================================
 *
 * PURPOSE
 * Show user:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ past payments
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ invoices
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ dates
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ amounts
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ status
 *
 * WHY
 * ---------------------------------------------------------
 * Users expect:
 *   "Where are my receipts?"
 *
 * Reduces:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ support tickets
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ billing confusion
 *
 * DATA SOURCE
 *   profiles.billing_history (jsonb)
 *   OR future table: billing_invoices
 *
 * NOTE
 * Works even if empty.
 * Safe fallback included.
 *
 * =========================================================
 *
 * USAGE
 *
 * <InvoiceHistory />
 *
 * Place:
 *   billing page bottom
 *
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

/* =========================================================
   TYPES
========================================================= */

type Invoice = {
  id: string
  amount: number
  currency?: string
  status?: string
  created_at: string
}

/* =========================================================
   COMPONENT
========================================================= */

export default function InvoiceHistory() {
  const [rows, setRows] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  /* ======================================================
     LOAD HISTORY
  ====================================================== */

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase
      .from("profiles")
      .select("billing_history")
      .single()

    const history = data?.billing_history || []

    setRows(history)
    setLoading(false)
  }

  /* ======================================================
     HELPERS
  ====================================================== */

  function formatMoney(n: number) {
    return `ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ${Number(n / 100).toLocaleString()}`
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString()
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="border rounded-2xl bg-white p-6 space-y-4">
      <h3 className="font-semibold text-sm">
        Payment History
      </h3>

      {loading && (
        <p className="text-xs text-gray-500">
          Loading...
        </p>
      )}

      {!loading && rows.length === 0 && (
        <p className="text-xs text-gray-500">
          No invoices yet
        </p>
      )}

      {rows.length > 0 && (
        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.id}
              className="flex justify-between items-center text-xs border rounded-lg px-3 py-2"
            >
              <div>
                <p className="font-medium">
                  {formatMoney(r.amount)}
                </p>
                <p className="text-gray-500">
                  {formatDate(r.created_at)}
                </p>
              </div>

              <span
                className={`
                  px-2 py-1 rounded text-[10px]
                  ${
                    r.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                `}
              >
                {r.status || "paid"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
