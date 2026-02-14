/* =========================================================
   HisabDesk — Portfolio Layout
   ---------------------------------------------------------
   App Router Layout Wrapper

   PURPOSE
   - Shared structure for all /portfolio pages
   - Consistent spacing
   - Future ready for:
       ✓ tabs (overview / allocation / returns)
       ✓ filters
       ✓ sticky actions
       ✓ sub routes

   Next.js Behavior:
     layout.tsx wraps:
       page.tsx
       loading.tsx
       error.tsx

   RULES
   ✅ UI only
   ✅ no hooks
   ✅ no business logic
   ✅ no DB
   ✅ no AI

   ========================================================= */

import type { ReactNode } from "react"

/* =========================================================
   LAYOUT
   ========================================================= */

export default function PortfolioLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* -----------------------------------------------------
         CONTAINER
         ----------------------------------------------------- */}
      <div className="mx-auto max-w-7xl w-full">
        {children}
      </div>
    </div>
  )
}
