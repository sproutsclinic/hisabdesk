"use client"

/**
 * =========================================================
 * Feature Gate (Paywall Wrapper)
 * HisabDesk – Growth / Monetization Layer
 * =========================================================
 *
 * PURPOSE
 * Block premium features for free users.
 *
 * Shows:
 *   ✓ blurred content
 *   ✓ lock message
 *   ✓ upgrade CTA
 *
 * WHY
 * ---------------------------------------------------------
 * Soft paywall converts MUCH better than:
 *   ❌ hiding features completely
 *
 * Users see value → then upgrade.
 *
 * Similar to:
 *   Notion AI gate
 *   Canva Pro locks
 *   Stripe premium tools
 *
 * =========================================================
 *
 * USAGE
 *
 * <FeatureGate feature="GST Automation">
 *    <GSTDashboard />
 * </FeatureGate>
 *
 * =========================================================
 *
 * SAFE
 * - UI only
 * - read only
 * - security still enforced server-side
 * =========================================================
 */

import { useEffect, useState, ReactNode } from "react"
import { supabase } from "@/lib/supabase"

/* =========================================================
   COMPONENT
========================================================= */

export default function FeatureGate({
  feature,
  children,
}: {
  feature: string
  children: ReactNode
}) {
  const [isPro, setIsPro] = useState<boolean | null>(
    null
  )

  /* ======================================================
     CHECK PLAN
  ====================================================== */

  useEffect(() => {
    async function check() {
      const { data } = await supabase
        .from("profiles")
        .select("is_pro")
        .single()

      setIsPro(!!data?.is_pro)
    }

    check()
  }, [])

  /* loading */
  if (isPro === null) return null

  /* ======================================================
     PRO → show content
  ====================================================== */

  if (isPro) {
    return <>{children}</>
  }

  /* ======================================================
     FREE → gated UI
  ====================================================== */

  return (
    <div className="relative border rounded-xl overflow-hidden">
      {/* blurred content */}
      <div className="blur-sm pointer-events-none opacity-60">
        {children}
      </div>

      {/* overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80">
        <div className="text-center space-y-3">
          <p className="text-sm font-medium">
            🔒 {feature} is Pro only
          </p>

          <a
            href="/billing"
            className="bg-black text-white text-sm px-4 py-2 rounded-lg"
          >
            Upgrade to Pro
          </a>
        </div>
      </div>
    </div>
  )
}
