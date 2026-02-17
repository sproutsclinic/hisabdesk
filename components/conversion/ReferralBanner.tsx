ï»¿"use client"

import { Gift, Copy } from "lucide-react"

/* =================================================
   REFERRAL BANNER ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â SSR SAFE VERSION

   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â no context hooks
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â no toast
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â zero crash risk
================================================= */

export default function ReferralBanner() {
  const copy = async () => {
    await navigator.clipboard.writeText(
      "https://hisabdesk.com?ref=invite"
    )

    // temporary safe feedback
    alert("Referral link copied")
  }

  return (
    <div
      className="
        bg-white dark:bg-zinc-900
        border rounded-2xl
        px-4 py-4
        flex items-center justify-between
        gap-4
      "
    >
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
