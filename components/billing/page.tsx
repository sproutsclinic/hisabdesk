"use client"

/**
 * =========================================================
 * Billing Page (Subscription Control Center)
 * HisabDesk – Monetization Hub
 * =========================================================
 *
 * ROUTE
 *   /billing
 *
 * PURPOSE
 * Central place for:
 *   ✓ plan status
 *   ✓ usage
 *   ✓ upgrade
 *   ✓ Razorpay subscription management
 *
 * CONNECTS
 *   components/billing/usage-dashboard
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import UsageDashboard from "@/components/billing/usage-dashboard"

/* =========================================================
   PAGE
========================================================= */

export default function BillingPage() {
  const [orgId, setOrgId] = useState<string | null>(
    null
  )
  const [loading, setLoading] = useState(true)

  /* ======================================================
     LOAD FIRST ORG (fallback safe)
     If you later add org switch context,
     replace this with context orgId.
  ====================================================== */

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from("organization_members")
      .select("org_id")
      .eq("user_id", user.id)
      .limit(1)
      .single()

    setOrgId(data?.org_id || null)
    setLoading(false)
  }

  /* ======================================================
     UI
  ====================================================== */

  if (loading) {
    return (
      <div className="p-10 text-sm text-gray-500">
        Loading billing...
      </div>
    )
  }

  if (!orgId) {
    return (
      <div className="p-10 text-sm text-gray-500">
        No organization found
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Billing & Plans
      </h1>

      <UsageDashboard orgId={orgId} />
    </div>
  )
}
