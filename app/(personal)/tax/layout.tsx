/* =========================================================
   HisabDesk — Tax Module Layout
   ---------------------------------------------------------
   PURPOSE
   - Dedicated layout wrapper for /tax route
   - Consistent spacing + structure
   - Future ready:
       ✓ tabs
       ✓ sub-navigation
       ✓ filters
       ✓ sticky actions
       ✓ breadcrumbs

   App Router:
     layout.tsx wraps:
       page.tsx
       loading.tsx
       error.tsx

   RULES
   ✅ UI only
   ✅ No hooks
   ✅ No business logic
   ✅ No DB
   ✅ No AI

   ========================================================= */

import type { ReactNode } from "react"

/* =========================================================
   LAYOUT
   ========================================================= */

export default function TaxLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* =====================================================
         CONTAINER
         ===================================================== */}
      <div className="mx-auto max-w-6xl w-full">
        {children}
      </div>
    </div>
  )
}
