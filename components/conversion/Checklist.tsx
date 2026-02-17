ï»¿"use client"

import Link from "next/link"
import { CheckCircle2, Circle } from "lucide-react"

/* =================================================
   CHECKLIST ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Conversion + Activation

   Phase 2.8 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â smarter onboarding psychology
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ % progress
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ progress bar
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ assistant message
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ completion state
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ fintech polish
================================================= */

export default function Checklist({
  hasIncome,
  hasExpense,
  isPro,
}: {
  hasIncome: boolean
  hasExpense: boolean
  isPro: boolean
}) {
  const items = [
    {
      done: hasIncome,
      label: "Add your first income",
      href: "/income/add",
    },
    {
      done: hasExpense,
      label: "Add your first expense",
      href: "/expense/add",
    },
    {
      done: isPro,
      label: "Unlock Pro automation",
      href: "/billing",
    },
  ]

  /* =================================================
     Progress calculation
  ================================================= */

  const completed = items.filter((i) => i.done).length
  const total = items.length
  const progress = Math.round((completed / total) * 100)

  /* =================================================
     Assistant message (NEW intelligence)
  ================================================= */

  let message = ""

  if (progress === 100) {
    message = "Great start! Your account is fully set up."
  } else if (progress >= 66) {
    message = "Almost there ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â one more step to unlock full insights."
  } else if (progress >= 33) {
    message = "Good progress ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â keep adding data for smarter insights."
  } else {
    message = "Complete setup to activate your AI finance assistant."
  }

  /* =================================================
     UI
  ================================================= */

  return (
    <div
      className="
        rounded-2xl
        border border-gray-200
        bg-white
        p-5
        shadow-sm
        space-y-4
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Setup checklist
        </h3>

        <span className="text-xs text-gray-500">
          {completed}/{total} ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ {progress}%
        </span>
      </div>

      {/* Assistant hint */}
      <p className="text-xs text-gray-500">
        {message}
      </p>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="
            h-full
            bg-gray-900
            transition-all duration-500
          "
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="
              flex items-center justify-between
              text-sm
              px-3 py-2.5
              rounded-xl
              hover:bg-gray-50
              transition
            "
          >
            <div className="flex items-center gap-3">
              {item.done ? (
                <CheckCircle2
                  size={16}
                  className="text-green-600"
                />
              ) : (
                <Circle
                  size={16}
                  className="text-gray-400"
                />
              )}

              <span
                className={
                  item.done
                    ? "line-through text-gray-400"
                    : "text-gray-700"
                }
              >
                {item.label}
              </span>
            </div>

            <span className="text-xs text-gray-400">
              {item.done ? "Done" : "Open"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
