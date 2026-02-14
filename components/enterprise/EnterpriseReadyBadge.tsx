"use client"

/*
  PHASE 18 — Enterprise Polish

  Small reusable badge to show:
  ✓ Backups enabled
  ✓ Audit logs enabled
  ✓ Security hardened

  Optional UI component for admin/settings pages
*/

export default function EnterpriseReadyBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-1.5 rounded-full">
      <span>🛡️</span>
      <span className="font-medium">Enterprise Ready</span>
    </div>
  )
}
