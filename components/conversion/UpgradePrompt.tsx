ï»¿"use client"

// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AI Suggestions Panel (Dashboard Safe)
// PERSONAL ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ PRIVATE ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ NO marketing
// Phase 2.7 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â severity + CA-style intelligence UI
// ==========================================================

import { useMemo } from "react"

interface Props {
  income?: number
  expense?: number
}

type Tip = {
  text: string
  level: "critical" | "warning" | "good" | "info"
}

export default function UpgradePrompt({
  income = 0,
  expense = 0,
}: Props) {
  /* ==========================================================
     SMART RULE ENGINE
  ========================================================== */

  const suggestions = useMemo<Tip[]>(() => {
    const list: Tip[] = []

    if (income === 0 && expense === 0) {
      return [
        {
          text: "Start by adding your first income or expense to unlock insights.",
          level: "info",
        },
      ]
    }

    const savings = income - expense
    const spendRatio = income > 0 ? expense / income : 1
    const savingsRate =
      income > 0 ? Math.round((savings / income) * 100) : 0

    // ======================================================
    // CRITICAL
    // ======================================================

    if (savings < 0) {
      list.push({
        text: "You are spending more than you earn. Reduce high-cost categories immediately.",
        level: "critical",
      })
    }

    // ======================================================
    // WARNING
    // ======================================================

    if (spendRatio > 0.8) {
      list.push({
        text: "Expenses exceed 80% of income. Tighten budgeting to avoid cash stress.",
        level: "warning",
      })
    }

    if (savings >= 0 && savings < 2000) {
      list.push({
        text: "Monthly savings are low. Cutting small recurring expenses can help.",
        level: "warning",
      })
    }

    // ======================================================
    // GOOD
    // ======================================================

    if (savingsRate >= 30) {
      list.push({
        text: `Healthy savings rate (${savingsRate}%). You're financially disciplined.`,
        level: "good",
      })
    }

    if (spendRatio < 0.5 && savings > 10000) {
      list.push({
        text: `Great job! You saved ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ${savings.toLocaleString(
          "en-IN"
        )}. Consider investing surplus into SIP/FD/tax-saving funds.`,
        level: "good",
      })
    }

    // ======================================================
    // INFO / CA STYLE ADVICE
    // ======================================================

    if (income > 500000 && savings > 0) {
      list.push({
        text: "You may benefit from tax-saving investments (80C/80D). HisabDesk can automate this calculation.",
        level: "info",
      })
    }

    if (expense > 15 && income > 0) {
      list.push({
        text: "Tracking many transactions manually? Auto-categorisation can save time.",
        level: "info",
      })
    }

    if (list.length === 0) {
      list.push({
        text: "Your finances look balanced. Keep tracking regularly for better planning.",
        level: "good",
      })
    }

    // sort by priority
    const order = {
      critical: 0,
      warning: 1,
      good: 2,
      info: 3,
    }

    return list.sort(
      (a, b) => order[a.level] - order[b.level]
    )
  }, [income, expense])

  /* ==========================================================
     STYLE MAP
  ========================================================== */

  const styles = {
    critical: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    good: "bg-green-50 border-green-200 text-green-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  }

  const icons = {
    critical: "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â",
    warning: "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡",
    good: "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢",
    info: "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡",
  }

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <section
      className="
        rounded-2xl
        border border-gray-200
        bg-white
        p-5
        shadow-sm
        space-y-3
      "
    >
      <h3 className="text-sm font-semibold text-gray-900">
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ AI Financial Suggestions
      </h3>

      <div className="space-y-2 text-sm">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className={`
              flex items-start gap-2
              rounded-xl border px-3 py-2
              ${styles[s.level]}
            `}
          >
            <span>{icons[s.level]}</span>
            <span>{s.text}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
