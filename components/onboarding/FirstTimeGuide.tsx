ï»¿"use client"

/**
 * =========================================================
 * HisabDesk ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â First Time User Guide (Modal)
 * Safe, UI-only helper
 * =========================================================
 */

interface Props {
  open: boolean
  onClose: () => void
}

export default function FirstTimeGuide({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-2">
          Welcome to HisabDesk ??
        </h2>

        <p className="text-sm text-muted-foreground mb-4">
          Track income, control expenses, and grow your wealth with clarity.
        </p>

        <ul className="text-sm space-y-2 mb-6 list-disc pl-5">
          <li>Add your first income entry</li>
          <li>Track expenses daily</li>
          <li>Visit Reports to see insights</li>
          <li>Use Wealth Planner to grow net worth</li>
        </ul>

        <button
          onClick={onClose}
          className="w-full bg-black text-white rounded-xl py-2 text-sm"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
