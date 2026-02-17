ï»¿"use client"

/**
 * =========================================================
 * Limit Warning Toast (Soft Upgrade Prompt)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Monetization UX Layer
 * =========================================================
 *
 * PURPOSE
 * Show friendly warning when usage near limits.
 *
 * Instead of:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ suddenly blocking user
 *
 * We:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ warn early (80ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“90%)
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ suggest upgrade
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ improve conversions
 *
 * =========================================================
 *
 * USAGE
 *
 * <LimitWarningToast
 *   label="Expenses"
 *   used={85}
 *   limit={100}
 * />
 *
 * =========================================================
 *
 * SAFE
 * - UI only
 * - no DB calls
 * =========================================================
 */

import { useEffect, useState } from "react"

/* =========================================================
   COMPONENT
========================================================= */

export default function LimitWarningToast({
  label,
  used,
  limit,
}: {
  label: string
  used: number
  limit: number
}) {
  const [visible, setVisible] = useState(false)

  const percent =
    limit > 0 ? (used / limit) * 100 : 0

  /* ======================================================
     SHOW WHEN > 80%
  ====================================================== */

  useEffect(() => {
    if (percent >= 80 && percent < 100) {
      setVisible(true)
    }
  }, [percent])

  if (!visible) return null

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <div className="bg-black text-white rounded-xl shadow-xl p-4 space-y-2">
        <p className="text-sm font-medium">
          ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  {label} usage high
        </p>

        <p className="text-xs opacity-80">
          {used} of {limit} used ({percent.toFixed(0)}%).
          Upgrade soon to avoid limits.
        </p>

        <div className="flex justify-between items-center">
          <a
            href="/billing"
            className="text-xs underline"
          >
            Upgrade plan
          </a>

          <button
            onClick={() => setVisible(false)}
            className="text-xs opacity-60"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
