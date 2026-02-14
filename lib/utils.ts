/* =================================================
   HisabDesk — utils.ts (Enterprise Shared Helpers)
   Single source of truth for:
   ✓ class merging
   ✓ ₹ currency formatting
   ✓ number formatting
   ✓ percent helpers
   ✓ dates
   ✓ safe math
   Used across dashboard / income / expense / charts
================================================= */


/* =================================================
   className merge (Tailwind safe)
================================================= */

export function cn(
  ...classes: (string | undefined | false | null)[]
) {
  return classes.filter(Boolean).join(" ")
}


/* =================================================
   CURRENCY (₹ India default)
================================================= */

export function formatCurrency(value: number | string = 0) {
  const n = Number(value || 0)

  return `₹ ${n.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`
}


/* compact version for charts (₹12k, ₹3L) */
export function formatCurrencyShort(value: number | string = 0) {
  const n = Number(value || 0)

  if (n >= 10000000) return `₹ ${(n / 10000000).toFixed(1)}Cr`
  if (n >= 100000) return `₹ ${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹ ${(n / 1000).toFixed(0)}k`

  return `₹ ${n}`
}


/* =================================================
   NUMBERS
================================================= */

export function formatNumber(value: number | string = 0) {
  return Number(value || 0).toLocaleString("en-IN")
}


/* =================================================
   PERCENT
================================================= */

export function percent(part: number, total: number) {
  if (!total) return 0
  return Math.round((part / total) * 100)
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`
}


/* =================================================
   SAFE MATH
================================================= */

export function safeSum(values: (number | null | undefined)[]) {
  return values.reduce((s, v) => s + Number(v || 0), 0)
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}


/* =================================================
   DATES
================================================= */

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatMonth(date: string | Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
  })
}

export function isSameMonth(date: string | Date, compare: Date = new Date()) {
  const d = new Date(date)
  return (
    d.getMonth() === compare.getMonth() &&
    d.getFullYear() === compare.getFullYear()
  )
}


/* =================================================
   ARRAYS
================================================= */

export function groupBy<T>(
  arr: T[],
  key: (item: T) => string
) {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item)
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {})
}


/* =================================================
   STRINGS
================================================= */

export function capitalize(text: string = "") {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
