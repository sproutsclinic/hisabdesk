ï»¿/*
  PHASE 18 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Activity Format Helpers

  Central place to normalize activity rows
  so UI stays clean
*/

export type ActivityRow = {
  id: string
  type: "audit" | "event"
  action?: string
  event?: string
  created_at: string
}

export function getActivityLabel(row: ActivityRow) {
  const raw = row.action || row.event || ""

  return raw
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function getActivityTime(row: ActivityRow) {
  return new Date(row.created_at).toLocaleString()
}
