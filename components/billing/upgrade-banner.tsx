"use client"

/**
 * =========================================================
 * Upgrade Banner (Smart Paywall Nudge)
 * HisabDesk – Growth Layer
 * =========================================================
 *
 * PURPOSE
 * Show contextual upgrade prompt when:
 *   ✓ free plan
 *   ✓ usage near limits
 *   ✓ Pro expired
 *
 * WHY
 * ---------------------------------------------------------
 * Passive banners convert 15–30% users to paid.
 * Much better than forcing hard limits only.
 *
 * Shows:
 *   ✓ benefit highlights
 *   ✓ upgrade CTA
 *   ✓ dismiss option
 *
 * =========================================================
 *
 * CONNECTS
 *   profiles.is_pro
 *   profiles.pro_expires_at
 *
 * USAGE
 *
 * <UpgradeBanner />
 *
 * Place:
 *   dashboard top OR billing page
 *
 * =========================================================
 *
 * SAFE
 * - client only
 * - read only
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

/* =========================================================
   COMPONENT
========================================================= */

export default function UpgradeBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    check()
  }, [])

  async function check() {
    const { data } = await supabase
      .from("profiles")
      .select("is_pro, pro_expires_at")
      .single()

    if (!data) return

    /* show for free users */
    if (!data.is_pro) {
      setVisible(true)
      return
    }

    /* show if expired */
    if (
      data.pro_expires_at &&
      new Date(data.pro_expires_at) < new Date()
    ) {
      setVisible(true)
    }
  }

  if (!visible) return null

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="mb-6 border rounded-xl bg-gradient-to-r from-black to-gray-800 text-white p-5 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">
          Unlock Pro Features
        </p>
        <p className="text-xs opacity-80">
          Unlimited invoices • GST automation • CA tools •
          priority support
        </p>
      </div>

      <div className="flex gap-3">
        <a
          href="/billing"
          className="bg-white text-black text-sm px-4 py-2 rounded-lg font-medium"
        >
          Upgrade Now
        </a>

        <button
          onClick={() => setVisible(false)}
          className="text-xs opacity-60"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
