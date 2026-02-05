"use client"

import { Gift, Copy } from "lucide-react"
import { useToast } from "@/components/ui/toast"

/* =================================================
   REFERRAL BANNER — Growth Loop

   Upgrades:
   ✅ premium look
   ✅ toast instead of alert
   ✅ better CTA
   ✅ mobile friendly
   ✅ zero breaking
================================================= */

export default function ReferralBanner() {
  const toast = useToast()

  const copy = async () => {
    await navigator.clipboard.writeText(
      "https://hisabdesk.com?ref=invite"
    )

    toast.success("Referral link copied")
  }

  return (
    <div
      className="
        card
        flex items-center justify-between
        gap-4
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div
          className="
            w-9 h-9
            rounded-lg
            bg-zinc-100 dark:bg-zinc-800
            flex items-center justify-center
          "
        >
          <Gift size={16} />
        </div>

        <div>
          <p className="text-sm font-semibold">
            Refer & earn 1 month FREE
          </p>
          <p className="text-xs text-zinc-500">
            Invite friends and unlock Pro benefits
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={copy}
        className="
          inline-flex items-center gap-2
          border border-zinc-300 dark:border-zinc-700
          px-3 py-1.5
          rounded-lg text-xs font-medium
          hover:bg-zinc-100 dark:hover:bg-zinc-800
          transition
        "
      >
        <Copy size={14} />
        Copy Link
      </button>
    </div>
  )
}
