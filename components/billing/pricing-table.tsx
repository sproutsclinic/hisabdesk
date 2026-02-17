ï»¿"use client"

/**
 * =========================================================
 * Pricing Table (Plans Comparison UI)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Billing Conversion Page
 * =========================================================
 *
 * PURPOSE
 * Clean pricing comparison to drive upgrades.
 *
 * Shows:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Free vs Pro
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ features
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ limits
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ CTA buttons
 *
 * WHY
 * ---------------------------------------------------------
 * A clear pricing table improves upgrades massively.
 * Industry standard:
 *   Stripe / Notion / Vercel style
 *
 * =========================================================
 *
 * USAGE
 *
 * Add inside:
 *   /billing page
 *
 * <PricingTable />
 *
 * =========================================================
 */

import PlanBadge from "@/components/billing/plan-badge"

/* =========================================================
   DATA
========================================================= */

const FEATURES = [
  "Expenses tracking",
  "Invoices",
  "Documents storage",
  "GST Sync",
  "CA Dashboard",
  "AI Categorization",
  "Advanced Reports",
  "Priority Support",
]

/* =========================================================
   COMPONENT
========================================================= */

export default function PricingTable() {
  return (
    <div className="space-y-8">
      {/* header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">
          Simple Pricing
        </h2>
        <p className="text-sm text-gray-500">
          Start free. Upgrade when you grow.
        </p>

        <div className="flex justify-center">
          <PlanBadge />
        </div>
      </div>

      {/* table */}
      <div className="grid md:grid-cols-2 gap-6">
        <PlanCard
          title="Free"
          price="ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹0"
          subtitle="Perfect to start"
          limits={[
            "100 expenses",
            "50 invoices",
            "20 documents",
          ]}
          features={FEATURES.map((_, i) => i < 3)}
          cta="Current Plan"
          disabled
        />

        <PlanCard
          title="Pro"
          price="ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹499/mo"
          subtitle="For professionals & CAs"
          highlight
          limits={[
            "Unlimited expenses",
            "Unlimited invoices",
            "Unlimited documents",
          ]}
          features={FEATURES.map(() => true)}
          cta="Upgrade Now"
          href="/billing"
        />
      </div>
    </div>
  )
}

/* =========================================================
   CARD
========================================================= */

function PlanCard({
  title,
  price,
  subtitle,
  limits,
  features,
  highlight,
  cta,
  href,
  disabled,
}: {
  title: string
  price: string
  subtitle: string
  limits: string[]
  features: boolean[]
  highlight?: boolean
  cta: string
  href?: string
  disabled?: boolean
}) {
  return (
    <div
      className={`
        border rounded-2xl p-6 flex flex-col space-y-5
        ${highlight ? "border-black shadow-lg" : ""}
      `}
    >
      <div>
        <h3 className="text-lg font-semibold">
          {title}
        </h3>
        <p className="text-2xl font-bold mt-1">
          {price}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {subtitle}
        </p>
      </div>

      {/* limits */}
      <ul className="text-sm space-y-1">
        {limits.map((l) => (
          <li key={l}>ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ {l}</li>
        ))}
      </ul>

      {/* features */}
      <ul className="text-xs space-y-1 text-gray-600">
        {FEATURES.map((f, i) => (
          <li key={f}>
            {features[i] ? "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“" : "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢"} {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {disabled ? (
        <button
          disabled
          className="mt-auto bg-gray-200 text-gray-500 py-2 rounded-lg text-sm"
        >
          {cta}
        </button>
      ) : (
        <a
          href={href}
          className="mt-auto bg-black text-white py-2 rounded-lg text-sm text-center"
        >
          {cta}
        </a>
      )}
    </div>
  )
}
