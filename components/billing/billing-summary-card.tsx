"use client"

/**
 * =========================================================
 * Billing Summary Card (Subscription Snapshot)
 * HisabDesk – Billing UX Polish
 * =========================================================
 *
 * PURPOSE
 * Quick subscription overview:
 *
 *   ✓ current plan
 *   ✓ renewal / expiry date
 *   ✓ status
 *   ✓ manage billing CTA
 *
 * WHY
 * ---------------------------------------------------------
 * Users should instantly know:
 *   "What plan am I on?"
 *   "When will I be charged?"
 *
 * Reduces support tickets massively.
 *
 * =========================================================
 *
 * USAGE
 *
 * <BillingSummaryCard />
 *
 * Place:
 *   /billing page top
 *
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import PlanBadge from "@/components/billing/plan-badge"

/* =========================================================
   TYPES
========================================================= */

type State = {
  isPro: boolean
  expires: string | null
}

/* =========================================================
   COMPONENT
========================================================= */

export default function BillingSummaryCard() {
  const [data, setData] = useState<State>({
    isPro: false,
    expires: null,
  })

  /* ======================================================
     LOAD PROFILE
  ====================================================== */

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase
      .from("profiles")
      .select("is_pro, pro_expires_at")
      .single()

    if (!data) return

    setData({
      isPro: !!data.is_pro,
      expires: data.pro_expires_at,
    })
  }

  /* ======================================================
     HELPERS
  ====================================================== */

  function format(date?: string | null) {
    if (!date) return "—"
    return new Date(date).toLocaleDateString()
  }

  const expired =
    data.expires &&
    new Date(data.expires) < new Date()

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="border rounded-2xl bg-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      {/* left */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-lg">
            Subscription
          </h3>
          <PlanBadge />
        </div>

        <p className="text-sm text-gray-500">
          {data.isPro
            ? expired
              ? "Plan expired"
              : `Renews on ${format(data.expires)}`
            : "You are on the Free plan"}
        </p>
      </div>

      {/* right */}
      <div className="flex gap-3">
        <a
          href="/billing"
          className="border px-4 py-2 rounded-lg text-sm"
        >
          Manage Billing
        </a>

        {!data.isPro && (
          <a
            href="/billing"
            className="bg-black text-white px-4 py-2 rounded-lg text-sm"
          >
            Upgrade
          </a>
        )}
      </div>
    </div>
  )
}
