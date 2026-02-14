"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { markStepCompleted } from "@/lib/onboarding/storage"

/*
  Auto completes onboarding steps
  based on user visiting certain routes
  No manual calls needed
*/

export default function AutoStepTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return

    if (pathname.startsWith("/income")) {
      markStepCompleted("income")
    }

    if (pathname.startsWith("/expense")) {
      markStepCompleted("expense")
    }

    if (pathname.startsWith("/dashboard")) {
      markStepCompleted("tax")
    }

    if (pathname.startsWith("/billing")) {
      markStepCompleted("upgrade")
    }

    if (pathname.startsWith("/settings")) {
      markStepCompleted("profile")
    }
  }, [pathname])

  return null
}
