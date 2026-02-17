ï»¿"use client"

/**
 * =========================================================
 * Feature Gate (Paywall Wrapper)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Growth / Monetization Layer
 * =========================================================
 *
 * PURPOSE
 * Block premium features for free users.
 *
 * Shows:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ blurred content
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ lock message
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ upgrade CTA
 *
 * WHY
 * ---------------------------------------------------------
 * Soft paywall converts MUCH better than:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ hiding features completely
 *
 * Users see value ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ then upgrade.
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
     PRO ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ show content
  ====================================================== */

  if (isPro) {
    return <>{children}</>
  }

  /* ======================================================
     FREE ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ gated UI
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
            ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚ÂÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ {feature} is Pro only
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
