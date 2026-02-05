"use client"

import Link from "next/link"
import { Crown } from "lucide-react"

/* =================================================
   UPGRADE PROMPT — Soft Paywall

   Upgrades:
   ✅ premium Stripe-like look
   ✅ subtle highlight (not aggressive)
   ✅ better mobile layout
   ✅ higher conversion psychology
   ✅ zero breaking props
================================================= */

export default function UpgradePrompt({
  show,
}: {
  show: boolean
}) {
  if (!show) return null

  return (
    <div
      className="
        rounded-2xl
        border border-amber-200
        bg-gradient-to-r from-amber-50 to-amber-100
        px-4 py-4
        flex items-center justify-between gap-4
      "
    >
      {/* LEFT */}
      <div className="flex items-start gap-3">
        <div
          className="
            w-9 h-9
            rounded-lg
            bg-amber-500/10
            flex items-center justify-center
          "
        >
          <Crown size={16} className="text-amber-600" />
        </div>

        <div>
          <p className="text-sm font-semibold text-amber-900">
            Unlock AI Tax Advisor + Reports
          </p>

          <p className="text-xs text-amber-700">
            Save more taxes with smart insights
          </p>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/billing"
        className="
          shrink-0
          bg-zinc-900 text-white
          px-4 py-2
          rounded-xl
          text-sm font-medium
          hover:opacity-90
          transition
        "
      >
        Upgrade
      </Link>
    </div>
  )
}
