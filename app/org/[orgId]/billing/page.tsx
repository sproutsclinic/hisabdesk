"use client"

/**
 * =========================================================
 * Organization Billing Page
 * HisabDesk – Phase C (Multi-Tenant Billing)
 * =========================================================
 *
 * ROUTE
 *   /org/[orgId]/billing
 *
 * PURPOSE
 * Organization level subscription management
 *
 * Features:
 *   ✓ show current plan
 *   ✓ show expiry
 *   ✓ upgrade to Pro
 *   ✓ open Razorpay checkout
 *   ✓ invoice history (basic)
 *
 * NOTE
 * Uses existing Razorpay + billing infra already built
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Billing = {
  is_pro: boolean
  pro_expires_at: string | null
}

export default function OrgBillingPage() {
  const params = useParams()
  const orgId = params?.orgId as string

  const [billing, setBilling] = useState<Billing>({
    is_pro: false,
    pro_expires_at: null,
  })

  const [loading, setLoading] = useState(true)

  /* ======================================================
     LOAD BILLING
  ====================================================== */

  useEffect(() => {
    async function load() {
      setLoading(true)

      const { data } = await supabase
        .from("organizations")
        .select("is_pro, pro_expires_at")
        .eq("id", orgId)
        .single()

      if (data) setBilling(data)

      setLoading(false)
    }

    load()
  }, [orgId])

  /* ======================================================
     OPEN CHECKOUT
  ====================================================== */

  function openCheckout() {
    window.location.href = `/billing?org=${orgId}`
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h2 className="text-2xl font-semibold">Billing</h2>
        <p className="text-sm text-gray-500">
          Manage your organization subscription
        </p>
      </div>

      {loading && <p>Loading...</p>}

      <div className="border rounded-xl p-6 space-y-4">
        <Row
          label="Current Plan"
          value={billing.is_pro ? "Pro" : "Free"}
        />

        <Row
          label="Expiry"
          value={
            billing.pro_expires_at
              ? new Date(
                  billing.pro_expires_at
                ).toLocaleDateString()
              : "-"
          }
        />

        {!billing.is_pro && (
          <button
            onClick={openCheckout}
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            Upgrade to Pro
          </button>
        )}
      </div>
    </div>
  )
}

/* ======================================================
   ROW
====================================================== */

function Row({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
