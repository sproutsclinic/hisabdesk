"use client"

import OnboardingProvider from "./OnboardingProvider"
import FirstTimeGuide from "./FirstTimeGuide"
import AutoStepTracker from "./AutoStepTracker"

/*
  Single plug-and-play wrapper

  Usage (inside AppShell or layout):
  <OnboardingRoot>
    {children}
  </OnboardingRoot>

  This automatically enables:
  ✓ first time modal
  ✓ checklist
  ✓ auto step tracking
*/

export default function OnboardingRoot({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OnboardingProvider>
      <AutoStepTracker />
      <FirstTimeGuide />
      {children}
    </OnboardingProvider>
  )
}
