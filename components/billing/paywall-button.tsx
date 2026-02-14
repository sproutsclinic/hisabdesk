"use client"

/**
 * =========================================================
 * Paywall Button (Smart Upgrade Trigger Button)
 * HisabDesk – Billing Conversion Component
 * =========================================================
 *
 * PURPOSE
 * Drop-in replacement for any button that:
 *
 *   ✓ works normally for Pro users
 *   ✓ opens upgrade modal for Free users
 *
 * WHY
 * ---------------------------------------------------------
 * Instead of:
 *   ❌ disabling buttons silently
 *
 * We:
 *   ✓ explain why locked
 *   ✓ show modal
 *   ✓ increase upgrade conversions
 *
 * =========================================================
 *
 * USAGE
 *
 * <PaywallButton
 *   isPro={isPro}
 *   onClick={handleCreate}
 *   feature="GST Sync"
 * >
 *   Sync GST
 * </PaywallButton>
 *
 * =========================================================
 */

import { ReactNode, useState } from "react"
import UpgradeModal from "@/components/billing/upgrade-modal"

/* =========================================================
   COMPONENT
========================================================= */

export default function PaywallButton({
  isPro,
  onClick,
  feature,
  children,
  className = "",
}: {
  isPro: boolean
  onClick?: () => void
  feature?: string
  children: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)

  function handle() {
    if (isPro) {
      onClick?.()
      return
    }

    setOpen(true)
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <>
      <button
        onClick={handle}
        className={className}
      >
        {children}
      </button>

      <UpgradeModal
        open={open}
        onClose={() => setOpen(false)}
        feature={feature}
      />
    </>
  )
}
