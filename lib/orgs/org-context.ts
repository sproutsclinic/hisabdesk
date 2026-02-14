"use client"

/**
 * =========================================================
 * Organization Context (Global Active Workspace State)
 * HisabDesk – Phase C Day 11
 * =========================================================
 *
 * PURPOSE
 * Single source of truth for current org across app.
 *
 * WITHOUT THIS
 *   ❌ every page reads URL manually
 *   ❌ duplicated logic
 *
 * WITH THIS
 *   ✓ useOrg() anywhere
 *   ✓ currentOrgId globally available
 *   ✓ auto-sync with URL
 *   ✓ clean architecture
 *
 * =========================================================
 *
 * USAGE
 *
 * 1) Wrap root layout:
 *
 * <OrgProvider>
 *   {children}
 * </OrgProvider>
 *
 *
 * 2) Use anywhere:
 *
 * const { orgId } = useOrg()
 *
 * =========================================================
 *
 * SAFE
 * - client only
 * - state only
 * - no DB writes
 * =========================================================
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { useParams } from "next/navigation"

/* =========================================================
   TYPES
========================================================= */

type OrgContextType = {
  orgId: string | null
  setOrgId: (id: string | null) => void
}

/* =========================================================
   CONTEXT
========================================================= */

const OrgContext = createContext<OrgContextType>({
  orgId: null,
  setOrgId: () => {},
})

/* =========================================================
   PROVIDER
========================================================= */

export function OrgProvider({
  children,
}: {
  children: ReactNode
}) {
  const params = useParams()

  const [orgId, setOrgId] = useState<string | null>(
    null
  )

  /* ======================================================
     SYNC WITH URL (/org/:orgId)
  ====================================================== */

  useEffect(() => {
    const id = params?.orgId as string | undefined

    if (id) {
      setOrgId(id)
      localStorage.setItem("active_org", id)
      return
    }

    /* fallback to saved */
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("active_org")
        : null

    if (saved) setOrgId(saved)
  }, [params])

  return (
    <OrgContext.Provider
      value={{ orgId, setOrgId }}
    >
      {children}
    </OrgContext.Provider>
  )
}

/* =========================================================
   HOOK
========================================================= */

export function useOrg() {
  return useContext(OrgContext)
}
