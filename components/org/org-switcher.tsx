"use client"

/**
 * =========================================================
 * Organization Switcher (Global Workspace Selector)
 * HisabDesk – Enterprise UX Component
 * =========================================================
 *
 * PURPOSE
 * Quick switch between organizations from anywhere.
 *
 * Solves:
 *   ✓ CA handling many clients
 *   ✓ founders with multiple companies
 *   ✓ faster navigation
 *
 * FEATURES
 *   ✓ dropdown switcher
 *   ✓ shows all orgs for current user
 *   ✓ one-click jump to workspace
 *   ✓ reusable in header/sidebar
 *
 * USAGE
 *
 * import OrgSwitcher from "@/components/org/org-switcher"
 *
 * <OrgSwitcher />
 *
 * SAFE
 * - client only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type Org = {
  id: string
  name: string
}

export default function OrgSwitcher() {
  const router = useRouter()

  const [orgs, setOrgs] = useState<Org[]>([])
  const [current, setCurrent] = useState<string | null>(null)

  /* ======================================================
     LOAD USER ORGS
  ====================================================== */

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("organization_members")
        .select("organizations(id, name)")
        .eq("user_id", user.id)

      const list =
        data?.map((d: any) => d.organizations).filter(Boolean) || []

      setOrgs(list)

      /* auto detect current org from URL */
      const parts = window.location.pathname.split("/")
      const idx = parts.indexOf("org")
      if (idx >= 0 && parts[idx + 1]) {
        setCurrent(parts[idx + 1])
      }
    }

    load()
  }, [])

  /* ======================================================
     SWITCH
  ====================================================== */

  function change(orgId: string) {
    setCurrent(orgId)
    router.push(`/org/${orgId}`)
  }

  if (orgs.length === 0) return null

  /* ======================================================
     UI
  ====================================================== */

  return (
    <select
      value={current || ""}
      onChange={(e) => change(e.target.value)}
      className="border rounded-lg px-3 py-2 text-sm bg-white"
    >
      <option value="" disabled>
        Select Organization
      </option>

      {orgs.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
  )
}
