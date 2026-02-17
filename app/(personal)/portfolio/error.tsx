ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Portfolio Error Boundary
   ---------------------------------------------------------
   App Router error boundary for /portfolio

   PURPOSE
   - Prevent full app crash
   - Gracefully show failure state
   - Allow retry

   Automatically used by Next.js when:
     page throws error during render / fetch

   RULES
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ UI only
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ no business logic
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ no DB
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ no AI
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ client component required

   ========================================================= */

"use client"

import { useEffect } from "react"

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function Error({ error, reset }: Props) {
  /* log once for debugging */
  useEffect(() => {
    console.error("Portfolio page error:", error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="border rounded-2xl shadow-sm p-8 max-w-md w-full text-center space-y-4">
        {/* --------------------------------------------------
           TITLE
           -------------------------------------------------- */}
        <h2 className="text-lg font-semibold">
          Portfolio failed to load
        </h2>

        {/* --------------------------------------------------
           MESSAGE
           -------------------------------------------------- */}
        <p className="text-sm text-muted-foreground">
          Something went wrong while loading your assets.
          Please try again.
        </p>

        {/* --------------------------------------------------
           ACTIONS
           -------------------------------------------------- */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 rounded bg-black text-white text-sm"
          >
            Retry
          </button>

          <button
            onClick={() =>
              (window.location.href = "/dashboard")
            }
            className="px-4 py-2 rounded border text-sm"
          >
            Go Dashboard
          </button>
        </div>

        {/* --------------------------------------------------
           DEV DEBUG
           -------------------------------------------------- */}
        {process.env.NODE_ENV === "development" && (
          <pre className="text-xs text-left bg-muted p-3 rounded overflow-auto">
            {error.message}
          </pre>
        )}
      </div>
    </div>
  )
}
