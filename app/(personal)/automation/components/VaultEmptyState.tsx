/* =========================================================
   HisabDesk — VaultEmptyState
   ---------------------------------------------------------
   UI ONLY
   Shown when no files uploaded
   ❌ no logic
   ========================================================= */

"use client"

export default function VaultEmptyState() {
  return (
    <div className="border rounded p-8 text-center text-sm text-muted-foreground">
      <div className="space-y-2">
        <p className="font-medium">
          Your Vault is empty
        </p>

        <p>
          Upload PAN, Aadhaar, tax documents, bank
          statements or policies to keep everything secure
          in one place.
        </p>
      </div>
    </div>
  )
}
