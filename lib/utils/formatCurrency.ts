// ==========================================================
// HisabDesk — Currency Formatter (Single Source of Truth)
// Location: lib/utils/formatCurrency.ts
//
// PURPOSE
// Standardize ALL money display across app
//
// WHY
// Avoid:
// ❌ manual ₹ string concat
// ❌ toLocaleString everywhere
// ❌ inconsistent decimals
//
// Use everywhere:
// formatCurrency(25000)
//
// RULES
// ✅ pure function
// ✅ no business logic
// ✅ no side effects
// ==========================================================

/* =========================================================
Config
========================================================= */

const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

const INR_DECIMAL_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/* =========================================================
Public API
========================================================= */

/**
 * Default formatter (₹ 25,000)
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "₹ 0"
  }

  return INR_FORMATTER.format(value)
}

/**
 * Decimal formatter (₹ 25,000.50)
 */
export function formatCurrencyDecimal(
  value: number | null | undefined
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "₹ 0.00"
  }

  return INR_DECIMAL_FORMATTER.format(value)
}

/**
 * Compact formatter (₹ 1.2L / ₹ 3.4Cr)
 * Useful for charts & KPIs
 */
export function formatCurrencyCompact(
  value: number | null | undefined
): string {
  if (!value) return "₹ 0"

  const abs = Math.abs(value)

  if (abs >= 1_00_00_000) {
    return `₹ ${(value / 1_00_00_000).toFixed(1)}Cr`
  }

  if (abs >= 1_00_000) {
    return `₹ ${(value / 1_00_000).toFixed(1)}L`
  }

  if (abs >= 1_000) {
    return `₹ ${(value / 1_000).toFixed(1)}K`
  }

  return `₹ ${value}`
}
