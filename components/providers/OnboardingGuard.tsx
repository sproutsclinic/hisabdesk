"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SkeletonList } from "@/components/ui/skeleton"

/* ========================================
   ONBOARDING GUARD

   Purpose:
   ✅ lock dashboard until onboarding done
   ✅ prevents empty dashboard confusion
   ✅ instant redirect
   ✅ mobile safe

   Logic:
   if onboarding_profile answers < required
      → redirect /onboarding
======================================== */

const TOTAL_REQUIRED = 6 // questions count

export default function OnboardingGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/login")
        return
      }

      // allow onboarding page itself
      if (pathname.startsWith("/onboarding")) {
        setChecking(false)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_profile")
        .eq("id", data.user.id)
        .single()

      const answers = profile?.onboarding_profile || {}
      const count = Object.keys(answers).length

      if (count < TOTAL_REQUIRED) {
        router.replace("/onboarding")
        return
      }

      setChecking(false)
    }

    check()
  }, [pathname, router])

  /* ===== loading state ===== */

  if (checking) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <SkeletonList count={6} />
      </div>
    )
  }

  return <>{children}</>
}
