"use client"

/**
 * =========================================================
 * Checkout Button (Razorpay Upgrade Trigger)
 * HisabDesk – Billing Action Component
 * =========================================================
 *
 * PURPOSE
 * Calls:
 *   POST /api/billing/checkout
 *
 * Then:
 *   redirects user → Razorpay hosted checkout
 *
 * WHY
 * ---------------------------------------------------------
 * Keep payment logic OUT of UI pages.
 * Reusable button for:
 *   ✓ pricing table
 *   ✓ upgrade banner
 *   ✓ billing page
 *
 * =========================================================
 *
 * USAGE
 *
 * <CheckoutButton>
 *   Upgrade to Pro
 * </CheckoutButton>
 *
 * =========================================================
 */

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function CheckoutButton({
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

      /* get session token */
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        window.location.href = "/login"
        return
      }

      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      const json = await res.json()

      if (!res.ok || !json.url) {
        throw new Error("Checkout failed")
      }

      /* redirect to Razorpay */
      window.location.href = json.url
    } catch (err) {
      alert("Unable to start checkout. Try again.")
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
      {loading ? "Redirecting..." : children}
    </button>
  )
}
