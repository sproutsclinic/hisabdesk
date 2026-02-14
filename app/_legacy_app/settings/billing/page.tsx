"use client"

/**
 * =========================================================
 * BILLING & PLAN PAGE (Production)
 * Phase D — Day 24
 * Route: /settings/billing
 *
 * PURPOSE
 * Subscription + usage control center
 *
 * Shows:
 * ✓ current plan
 * ✓ renewal status
 * ✓ usage vs limits
 * ✓ upgrade
 * ✓ manage subscription (portal)
 * ✓ cancel
 *
 * Integrates:
 * ✓ Razorpay subscriptions (already built)
 * ✓ usage tracking table
 *
 * SAFE:
 * read only + existing APIs
 * no schema changes
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

/* ====================================================== */

type Billing = {
  plan: string
  status: string
  renewAt?: string
}

type Usage = {
  invoices: number
  transactions: number
  storage: number
}

/* ====================================================== */

export default function BillingPage() {
  const [loading, setLoading] = useState(true)
  const [billing, setBilling] = useState<Billing | null>(
    null
  )
  const [usage, setUsage] = useState<Usage>({
    invoices: 0,
    transactions: 0,
    storage: 0,
  })

  /* ======================================================
     INIT
  ====================================================== */

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    /* --------------------------------------------
       BILLING STATUS
    -------------------------------------------- */

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()

    setBilling({
      plan: sub?.plan || "free",
      status: sub?.status || "inactive",
      renewAt: sub?.current_period_end,
    })

    /* --------------------------------------------
       USAGE
    -------------------------------------------- */

    const { data: txRes, count: txCount } =
      await supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })

    const { data: invRes, count: invCount } =
      await supabase
        .from("gst_invoices")
        .select("id", { count: "exact", head: true })

    const { data: docs } = await supabase.storage
      .from("ca-docs")
      .list("", { limit: 1000 })

    setUsage({
      transactions: txCount || 0,
      invoices: invCount || 0,
      storage: docs?.length || 0,
    })

    setLoading(false)
  }

  /* ======================================================
     ACTIONS
  ====================================================== */

  async function openPortal() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const res = await fetch("/api/billing/portal", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })

    const { url } = await res.json()
    window.location.href = url
  }

  async function upgrade() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })

    const { url } = await res.json()
    window.location.href = url
  }

  /* ======================================================
     LIMITS
  ====================================================== */

  const limits =
    billing?.plan === "pro"
      ? { tx: 100000, inv: 20000, storage: 5000 }
      : { tx: 2000, inv: 500, storage: 200 }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-6 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="text-sm text-gray-500">
          Manage subscription and usage
        </p>
      </div>

      {loading && (
        <p className="text-sm text-gray-400">Loading…</p>
      )}

      {/* PLAN CARD */}
      {billing && (
        <div className="border rounded-2xl p-6 bg-white space-y-3">
          <p className="text-sm text-gray-500">Current Plan</p>

          <p className="text-xl font-semibold capitalize">
            {billing.plan}
          </p>

          <p className="text-xs text-gray-500">
            Status: {billing.status}
          </p>

          {billing.renewAt && (
            <p className="text-xs text-gray-500">
              Renews:{" "}
              {new Date(billing.renewAt).toLocaleDateString(
                "en-IN"
              )}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            {billing.plan === "free" && (
              <button
                onClick={upgrade}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm"
              >
                Upgrade to Pro
              </button>
            )}

            <button
              onClick={openPortal}
              className="border px-4 py-2 rounded-lg text-sm"
            >
              Manage Subscription
            </button>
          </div>
        </div>
      )}

      {/* USAGE */}
      <div className="grid gap-4 md:grid-cols-3">
        <UsageCard
          label="Transactions"
          value={usage.transactions}
          limit={limits.tx}
        />

        <UsageCard
          label="GST Invoices"
          value={usage.invoices}
          limit={limits.inv}
        />

        <UsageCard
          label="Documents"
          value={usage.storage}
          limit={limits.storage}
        />
      </div>
    </div>
  )
}

/* ====================================================== */

function UsageCard({
  label,
  value,
  limit,
}: {
  label: string
  value: number
  limit: number
}) {
  const percent = Math.min(100, (value / limit) * 100)

  return (
    <div className="border rounded-xl p-4 bg-white">
      <p className="text-xs text-gray-500">{label}</p>

      <p className="text-lg font-semibold">
        {value} / {limit}
      </p>

      <div className="h-2 bg-gray-100 rounded mt-2 overflow-hidden">
        <div
          className="h-full bg-black"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
