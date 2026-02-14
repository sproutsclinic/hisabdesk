/**
 * =========================================================
 * Organization Workspace Layout (SERVER • Multi-Tenant Shell)
 * =========================================================
 */

import Link from "next/link"
import { redirect } from "next/navigation"
import { getSupabaseServer } from "@/lib/supabase"
import {
  getBranding,
  buildThemeVars,
  getDisplayName,
} from "@/lib/whitelabel/branding-service"
import { can } from "@/lib/orgs/role-permissions"

type Role =
  | "owner"
  | "admin"
  | "accountant"
  | "member"
  | "viewer"
  | null

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { orgId: string }
}) {
  const supabase = getSupabaseServer()
  const orgId = params.orgId

  /* ======================================================
     AUTH
  ====================================================== */

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  /* ======================================================
     MEMBER + ROLE
  ====================================================== */

  const { data: member } = await supabase
    .from("organization_members")
    .select("role, organizations(name)")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (!member) redirect("/dashboard")

  const role = member.role as Role

  /* ======================================================
     BRANDING (server safe)
  ====================================================== */

  const branding = await getBranding(orgId)

  const themeVars = buildThemeVars(branding)
  const name =
    getDisplayName(branding) ||
    member.organizations?.name ||
    "Organization"

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={themeVars}
    >
      {/* HEADER */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full"
            style={{ background: "var(--brand-accent)" }}
          />
          <h1 className="font-semibold text-lg">{name}</h1>
        </div>

        <nav className="flex gap-5 text-sm">

          <Nav href={`/org/${orgId}`}>Overview</Nav>

          {can(role, "view_finances") && (
            <Nav href={`/org/${orgId}/finances`}>
              Finances
            </Nav>
          )}

          {can(role, "manage_tax") && (
            <Nav href={`/org/${orgId}/tax`}>
              Tax
            </Nav>
          )}

          {can(role, "manage_members") && (
            <Nav href={`/org/${orgId}/members`}>
              Team
            </Nav>
          )}

          {can(role, "manage_billing") && (
            <Nav href={`/org/${orgId}/billing`}>
              Billing
            </Nav>
          )}
        </nav>
      </header>

      <main className="p-6">{children}</main>
    </div>
  )
}

/* ====================================================== */

function Nav({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className="hover:underline">
      {children}
    </Link>
  )
}
