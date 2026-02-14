"use client"

/**
 * =========================================================
 * Cancel Confirmation Modal (Churn Save UX)
 * HisabDesk – Billing Retention Layer
 * =========================================================
 *
 * PURPOSE
 * Ask confirmation BEFORE cancelling subscription.
 *
 * WHY (very important)
 * ---------------------------------------------------------
 * Direct cancel → high churn
 * Confirm modal → saves 20–40% users
 *
 * Gives:
 *   ✓ warning
 *   ✓ benefits reminder
 *   ✓ downgrade CTA
 *
 * =========================================================
 *
 * USAGE
 *
 * const [open, setOpen] = useState(false)
 *
 * <CancelConfirmModal
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   onConfirm={handleCancel}
 * />
 *
 * =========================================================
 */

import { ReactNode } from "react"

export default function CancelConfirmModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
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
        {/* header */}
        <div>
          <h2 className="text-lg font-semibold text-red-600">
            Cancel Pro Plan?
          </h2>

          <p className="text-sm text-gray-600 mt-2">
            You will lose access to:
          </p>
        </div>

        {/* benefits lost */}
        <ul className="text-sm space-y-1 text-gray-700">
          <li>✕ GST automation</li>
          <li>✕ CA dashboard</li>
          <li>✕ Unlimited invoices & expenses</li>
          <li>✕ Advanced reports & AI tools</li>
          <li>✕ Priority support</li>
        </ul>

        {/* suggestion */}
        <div className="bg-yellow-50 border rounded-lg p-3 text-xs text-yellow-700">
          Tip: You can keep Pro active and cancel anytime later.
        </div>

        {/* actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded-lg text-sm"
          >
            Keep Pro
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
