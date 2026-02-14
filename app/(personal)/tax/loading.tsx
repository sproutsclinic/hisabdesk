/* =========================================================
   HisabDesk — Tax Page Loading UI
   ---------------------------------------------------------
   PURPOSE
   - App Router loading state
   - Shows instantly while:
       ✓ route loads
       ✓ server fetch happens
       ✓ suspense boundaries resolve

   RULES
   ✅ UI only
   ✅ No hooks
   ✅ No logic
   ✅ No API
   ✅ No calculations

   Automatically used by Next.js when:
     /tax page is loading

   ========================================================= */

export default function Loading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      {/* -----------------------------------------------------
         HEADER
         ----------------------------------------------------- */}
      <div className="space-y-2">
        <div className="h-7 w-40 bg-muted rounded" />
        <div className="h-4 w-72 bg-muted rounded" />
      </div>

      {/* -----------------------------------------------------
         PROFILE CARD
         ----------------------------------------------------- */}
      <SkeletonCard />

      {/* -----------------------------------------------------
         INCOME CARD
         ----------------------------------------------------- */}
      <SkeletonCard />

      {/* -----------------------------------------------------
         DEDUCTIONS CARD
         ----------------------------------------------------- */}
      <SkeletonCard />

      {/* -----------------------------------------------------
         BUTTON
         ----------------------------------------------------- */}
      <div className="h-10 w-40 bg-muted rounded" />

      {/* -----------------------------------------------------
         RESULT CARDS
         ----------------------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

/* =========================================================
   INTERNAL
   ========================================================= */

function SkeletonCard() {
  return (
    <div className="border rounded-xl p-6 space-y-4">
      <div className="h-5 w-32 bg-muted rounded" />

      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-4/6 bg-muted rounded" />
      </div>
    </div>
  )
}
