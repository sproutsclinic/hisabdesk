/* =========================================================
   HisabDesk — VaultHeader
   ---------------------------------------------------------
   UI ONLY
   Page title + description
   ❌ no logic
   ========================================================= */

"use client"

export default function VaultHeader() {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold">Vault</h1>

      <p className="text-sm text-muted-foreground">
        Secure personal locker for PAN, Aadhaar, bank
        statements, insurance policies, tax documents and
        other sensitive financial files.
      </p>
    </div>
  )
}
