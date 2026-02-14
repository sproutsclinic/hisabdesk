"use client"

/**
 * =========================================================
 * Upgrade Modal (High Conversion Paywall)
 * HisabDesk – Billing Growth Layer
 * =========================================================
 *
 * PURPOSE
 * Show a premium upgrade modal when:
 *   ✓ feature locked
 *   ✓ usage exceeded
 *   ✓ user clicks Pro feature
 *
 * WHY
 * ---------------------------------------------------------
 * Modal converts MUCH higher than banners.
 * Industry standard:
 *   Stripe / Notion / Canva style paywall
 *
 * =========================================================
 *
 * USAGE
 *
 * const [open, setOpen] = useState(false)
 *
 * <UpgradeModal
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   feature="GST Automation"
 * />
 *
 * =========================================================
 *
 * SAFE
 * - UI only
 * - no server logic
 * =========================================================
 */

import { ReactNode } from "react"

/* =========================================================
   COMPONENT
========================================================= */

export default function UpgradeModal({
  open,
  onClose,
  feature,
}: {
  open: boolean
  onClose: () => void
  feature?: string
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-[95%] max-w-md p-6 space-y-5">
        {/* title */}
        <div>
          <h2 className="text-lg font-semibold">
            Upgrade to Pro
          </h2>

          {feature && (
            <p className="text-sm text-gray-500 mt-1">
              {feature} is available only on Pro plan
            </p>
          )}
        </div>

        {/* benefits */}
        <ul className="text-sm space-y-2 text-gray-700">
          <li>✓ Unlimited invoices & expenses</li>
          <li>✓ GST automation & sync</li>
          <li>✓ CA multi-client tools</li>
          <li>✓ Priority support</li>
          <li>✓ Advanced reports</li>
        </ul>

        {/* pricing */}
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500">
            Starting at
          </p>
          <p className="text-xl font-semibold">
            ₹499 / month
          </p>
        </div>

        {/* actions */}
        <div className="flex gap-3">
          <a
            href="/billing"
            className="flex-1 bg-black text-white text-sm py-2 rounded-lg text-center"
          >
            Upgrade Now
          </a>

          <button
            onClick={onClose}
            className="flex-1 border text-sm py-2 rounded-lg"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}
