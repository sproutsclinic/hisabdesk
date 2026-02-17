ï»¿"use client"

/**
 * =========================================================
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Onboarding Root (Stabilized)
 * Controls only first-time modal visibility.
 * =========================================================
 */

import { useEffect, useState } from "react"
import FirstTimeGuide from "./FirstTimeGuide"
import AutoStepTracker from "./AutoStepTracker"

export default function OnboardingRoot({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)

  // Detect first visit
  useEffect(() => {
    const seen = localStorage.getItem("hisabdesk_seen")

    if (!seen) {
      setOpen(true)
      localStorage.setItem("hisabdesk_seen", "1")
    }

    setReady(true)
  }, [])

  if (!ready) return null

  return (
    <>
      <AutoStepTracker />

      <FirstTimeGuide
        open={open}
        onClose={() => setOpen(false)}
      />

      {children}
    </>
  )
}
