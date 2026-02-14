// ==========================================================
// HisabDesk — GST Auto Tagger
// Deterministic • Offline • Indian GST presets
// Shared across whole app
// ==========================================================

export function detectGST(category: string): number {
  const c = category.toLowerCase()

  if (c.includes("food")) return 5
  if (c.includes("restaurant")) return 5

  if (c.includes("shopping")) return 18
  if (c.includes("utilities")) return 18
  if (c.includes("business")) return 18

  if (c.includes("medical")) return 12

  if (c.includes("fuel")) return 0
  if (c.includes("rent")) return 0
  if (c.includes("loan")) return 0

  return 0
}
