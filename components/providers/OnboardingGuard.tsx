"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"
import { SkeletonList } from "@/components/ui/skeleton"

/* ========================================
   PRODUCTION SAFE ONBOARDING GUARD

   ✔ non-blocking render
   ✔ no blank screen
   ✔ stable auth
   ✔ deterministic redirect
======================================== */

const TOTAL_REQUIRED = 6

export default function OnboardingGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = getSupabaseClient()

    const run = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.replace("/login")
        return
      }

      if (pathname.startsWith("/onboarding")) {
        setReady(true)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_profile")
        .eq("id", data.user.id)
        .single()

      const answers = profile?.onboarding_profile ?? {}
      const count = Object.keys(answers).length

      if (count < TOTAL_REQUIRED) {
        router.replace("/onboarding")
        return
      }

      setReady(true)
    }

    run()
  }, [pathname, router])

  /* immediate skeleton (never blank) */
  if (!ready) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <SkeletonList count={6} />
      </div>
    )
  }

  return <>{children}</>
}
