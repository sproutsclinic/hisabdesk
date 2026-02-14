"use client"

/**
 * =========================================================
 * Manage Subscription Button (Customer Portal Launcher)
 * HisabDesk – Billing Self-Serve UX
 * =========================================================
 *
 * PURPOSE
 * Calls:
 *   POST /api/billing/portal
 *
 * Then:
 *   redirects → Razorpay subscription management page
 *
 * Allows users to:
 *   ✓ cancel
 *   ✓ update card
 *   ✓ view invoices
 *
 * =========================================================
 *
 * USAGE
 *
 * <ManageSubscriptionButton>
 *   Manage Subscription
 * </ManageSubscriptionButton>
 *
 * =========================================================
 */

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ManageSubscriptionButton({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const [loading, setLoading] = useState(false)

  async function handle() {
    try {
      setLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        window.location.href = "/login"
        return
      }

      const res = await fetch("/api/billing/portal", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      const json = await res.json()

      if (!res.ok || !json.url) {
        throw new Error("Portal failed")
      }

      window.location.href = json.url
    } catch {
      alert("Unable to open subscription portal.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className={className}
    >
      {loading ? "Opening..." : children}
    </button>
  )
}
