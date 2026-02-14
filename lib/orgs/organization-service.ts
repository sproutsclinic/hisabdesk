/**
 * =========================================================
 * Organization Service (Multi-Tenant Engine)
 * HisabDesk – Phase C (Scale)
 * =========================================================
 *
 * PURPOSE
 * Multi-tenant support for:
 *   ✓ firms
 *   ✓ CA practices
 *   ✓ startups
 *   ✓ teams
 *
 * Enables:
 *   ✓ one org → many users
 *   ✓ shared data
 *   ✓ role based access
 *   ✓ CA managing multiple clients
 *
 * DESIGN
 * Service layer only (no UI)
 * Reusable from:
 *   - dashboards
 *   - APIs
 *   - admin
 *
 * SAFE
 * - server only
 * - no existing file edits
 *
 * REQUIRED TABLES (run in Supabase)
 *
 * create table organizations (
 *   id uuid primary key default gen_random_uuid(),
 *   name text not null,
 *   owner_id uuid,
 *   created_at timestamp default now()
 * );
 *
 * create table organization_members (
 *   id uuid primary key default gen_random_uuid(),
 *   org_id uuid references organizations(id) on delete cascade,
 *   user_id uuid,
 *   role text,
 *   created_at timestamp default now()
 * );
 *
 * =========================================================
 */

"use server"

import { createClient } from "@supabase/supabase-js"

/* =========================================================
   ADMIN CLIENT
========================================================= */

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/* =========================================================
   TYPES
========================================================= */

export type OrgRole =
  | "owner"
  | "admin"
  | "accountant"
  | "member"
  | "viewer"

/* =========================================================
   CREATE ORGANIZATION
========================================================= */

export async function createOrganization(
  name: string,
  ownerId: string
) {
  const supabase = getAdminClient()

  const { data: org } = await supabase
    .from("organizations")
    .insert({
      name,
      owner_id: ownerId,
    })
    .select()
    .single()

  await supabase.from("organization_members").insert({
    org_id: org.id,
    user_id: ownerId,
    role: "owner",
  })

  return org
}

/* =========================================================
   ADD MEMBER
========================================================= */

export async function addMember(
  orgId: string,
  userId: string,
  role: OrgRole = "member"
) {
  const supabase = getAdminClient()

  await supabase.from("organization_members").insert({
    org_id: orgId,
    user_id: userId,
    role,
  })
}

/* =========================================================
   REMOVE MEMBER
========================================================= */

export async function removeMember(
  orgId: string,
  userId: string
) {
  const supabase = getAdminClient()

  await supabase
    .from("organization_members")
    .delete()
    .eq("org_id", orgId)
    .eq("user_id", userId)
}

/* =========================================================
   UPDATE ROLE
========================================================= */

export async function updateMemberRole(
  orgId: string,
  userId: string,
  role: OrgRole
) {
  const supabase = getAdminClient()

  await supabase
    .from("organization_members")
    .update({ role })
    .eq("org_id", orgId)
    .eq("user_id", userId)
}

/* =========================================================
   GET ORGANIZATION
========================================================= */

export async function getOrganization(orgId: string) {
  const supabase = getAdminClient()

  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .single()

  return data
}

/* =========================================================
   LIST USER ORGANIZATIONS
========================================================= */

export async function getUserOrganizations(userId: string) {
  const supabase = getAdminClient()

  const { data } = await supabase
    .from("organization_members")
    .select("role, organizations(*)")
    .eq("user_id", userId)

  return data
}

/* =========================================================
   LIST MEMBERS
========================================================= */

export async function getOrganizationMembers(orgId: string) {
  const supabase = getAdminClient()

  const { data } = await supabase
    .from("organization_members")
    .select("user_id, role")
    .eq("org_id", orgId)

  return data
}

/* =========================================================
   PERMISSION CHECK
========================================================= */

export async function hasOrgAccess(
  orgId: string,
  userId: string,
  allowed: OrgRole[] = ["owner", "admin"]
) {
  const supabase = getAdminClient()

  const { data } = await supabase
    .from("organization_members")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .single()

  if (!data) return false

  return allowed.includes(data.role as OrgRole)
}
