ï»¿"use client"

/**
 * =========================================================
 * Plan Badge (Subscription Status Chip)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Billing UX Polish
 * =========================================================
 *
 * PURPOSE
 * Small visual badge showing current plan:
 *
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Free
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Pro
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Expired
 *
 * WHY
 * ---------------------------------------------------------
 * Users should ALWAYS know their plan.
 * Reduces:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ confusion
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ support tickets
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ billing disputes
 *
 * Works great in:
 *   header
 *   sidebar
 *   billing page
 *
 * =========================================================
 *
 * USAGE
 *
 * <PlanBadge />
 *
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type State = "free" | "pro" | "expired" | null

export default function PlanBadge() {
  const [state, setState] = useState<State>(null)

  /* ======================================================
     LOAD PLAN
  ====================================================== */

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase
      .from("profiles")
      .select("is_pro, pro_expires_at")
      .single()

    if (!data) {
      setState("free")
      return
    }

    if (!data.is_pro) {
      setState("free")
      return
    }

    if (
      data.pro_expires_at &&
      new Date(data.pro_expires_at) < new Date()
    ) {
      setState("expired")
      return
    }

    setState("pro")
  }

  if (!state) return null

  /* ======================================================
     STYLES
  ====================================================== */

  const map = {
    free: {
      label: "Free",
      cls: "bg-gray-200 text-gray-700",
    },
    pro: {
      label: "Pro",
      cls: "bg-black text-white",
    },
    expired: {
      label: "Expired",
      cls: "bg-red-500 text-white",
    },
  }

  const s = map[state]

  /* ======================================================
     UI
  ====================================================== */

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${s.cls}`}
    >
      {s.label}
    </span>
  )
}
