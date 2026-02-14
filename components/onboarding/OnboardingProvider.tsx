"use client"

import { useEffect, useState } from "react"
import OnboardingChecklist from "./OnboardingChecklist"

export default function OnboardingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem("hisabdesk_onboarding_seen")
    if (!seen) {
      setShow(true)
      localStorage.setItem("hisabdesk_onboarding_seen", "1")
    }
  }, [])

  return (
    <>
      {children}
      {show && <OnboardingChecklist />}
    </>
  )
}
