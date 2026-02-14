"use client"

/**
 * =========================================================
 * Organization Guard (Workspace Access Protection)
 * HisabDesk – Phase C Day 10
 * =========================================================
 *
 * PURPOSE
 * Protect all /org/* routes.
 *
 * Ensures:
 *   ✓ user is logged in
 *   ✓ orgId exists in URL
 *   ✓ user belongs to that org
 *   ✓ otherwise redirect safely
 *
 * WHY IMPORTANT
 * ---------------------------------------------------------
 * Prevents:
 *   ❌ accessing other client orgs manually
 *   ❌ URL tampering
 *   ❌ data leakage
 *
 * Required for:
 *   ✓ CA multi-tenant security
 *   ✓ enterprise compliance
 *
 * =========================================================
 *
 * USAGE
 *
 * In: app/org/[orgId]/layout.tsx
 *
 * import OrgGuard from "@/components/org/org-guard"
 *
 * export default function Layout({ children }) {
 *   return <OrgGuard>{children}</OrgGuard>
 * }
 *
 * =========================================================
 *
 * SAFE
 * - client wrapper only
 * - no DB writes
 * =========================================================
 */

import { useEffect, useState, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"

export default function OrgGuard({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const params = useParams()

  const [allowed, setAllowed] = useState(false)
  const [loading, setLoading] = useState(true)

  /* ======================================================
     VERIFY ACCESS
  ====================================================== */

  useEffect(() => {
    async function check() {
      const orgId = params?.orgId as string

      if (!orgId) {
        router.replace("/dashboard")
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      /* verify membership */
      const { data } = await supabase
        .from("organization_members")
        .select("id")
        .eq("user_id", user.id)
        .eq("org_id", orgId)
        .maybeSingle()

      if (!data) {
        router.replace("/ca/dashboard")
        return
      }

      setAllowed(true)
      setLoading(false)
    }

    check()
  }, [params, router])

  /* ======================================================
     UI STATES
  ====================================================== */

  if (loading) {
    return (
      <div className="p-10 text-sm text-gray-500">
        Verifying access...
      </div>
    )
  }

  if (!allowed) return null

  return <>{children}</>
}
