"use client"

/**
 * =========================================================
 * CA Portal Layout (Firm Workspace Shell)
 * HisabDesk – CA Mode UI Wrapper
 * =========================================================
 *
 * ROUTE PREFIX
 *   /ca/*
 *
 * PURPOSE
 * Dedicated layout for Chartered Accountants / Firms:
 *
 *   ✓ sidebar navigation
 *   ✓ quick switching between clients
 *   ✓ analytics access
 *   ✓ clean separation from normal user UI
 *
 * PAGES USING THIS
 *   /ca/dashboard
 *   /ca/clients
 *   (future: /ca/reports, /ca/tasks, /ca/billing)
 *
 * SAFE
 * - new layout only
 * - does not modify existing AppShell
 * =========================================================
 */

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Org = {
  id: string
  name: string
}

export default function CALayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [orgs, setOrgs] = useState<Org[]>([])

  /* ======================================================
     LOAD CLIENT ORGS FOR QUICK SWITCH
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
    }

    load()
  }, [])

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 border-r bg-white p-5 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">
            CA Portal
          </h2>
          <p className="text-xs text-gray-500">
            Firm Workspace
          </p>
        </div>

        <nav className="space-y-2 text-sm">
          <Nav href="/ca/dashboard">Dashboard</Nav>
          <Nav href="/ca/clients">Clients</Nav>
          <Nav href="/admin/analytics">Analytics</Nav>
          <Nav href="/admin/system">System</Nav>
        </nav>

        {/* CLIENT QUICK LINKS */}
        <div className="pt-6 border-t">
          <p className="text-xs text-gray-400 mb-2">
            Quick Client Access
          </p>

          <div className="space-y-1 max-h-64 overflow-auto text-sm">
            {orgs.map((o) => (
              <Link
                key={o.id}
                href={`/org/${o.id}`}
                className="block text-gray-600 hover:underline"
              >
                {o.name}
              </Link>
            ))}

            {orgs.length === 0 && (
              <p className="text-xs text-gray-400">
                No clients
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

/* ======================================================
   NAV LINK
====================================================== */

function Nav({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="block hover:underline"
    >
      {children}
    </Link>
  )
}
