"use client"

/**
 * =========================================================
 * Cancel Subscription Button (Action Layer)
 * HisabDesk – Billing Cancellation Trigger
 * =========================================================
 *
 * PURPOSE
 * Executes REAL cancellation:
 *   ✓ calls /api/billing/cancel
 *   ✓ handles loading
 *   ✓ refreshes UI
 *
 * Works WITH:
 *   cancel-confirm-modal.tsx (UX only)
 *
 * FLOW
 *   button → modal → confirm → this → API → Razorpay cancel
 *
 * =========================================================
 *
 * USAGE
 *
 * const [open, setOpen] = useState(false)
 *
 * <>
 *   <button onClick={() => setOpen(true)}>Cancel Plan</button>
 *
 *   <CancelConfirmModal
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     onConfirm={cancel}
 *   />
 * </>
 *
 * =========================================================
 */

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import CancelConfirmModal from "@/components/billing/cancel-confirm-modal"

export default function CancelSubscriptionButton({
  className = "",
}: {
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function cancel() {
    try {
      setLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        window.location.href = "/login"
        return
      }

      const res = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Cancel failed")
      }

      /* refresh page to reflect downgrade */
      window.location.reload()
    } catch {
      alert("Unable to cancel subscription.")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={loading}
        className={className}
      >
        {loading ? "Cancelling..." : "Cancel Plan"}
      </button>

      <CancelConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={cancel}
      />
    </>
  )
}
