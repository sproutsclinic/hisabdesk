ï»¿/**
 * =========================================================
 * Permission Guard (Enterprise Route Protection)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Security Middleware Layer
 * =========================================================
 *
 * PURPOSE
 * Centralized authorization checks for:
 *
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Admin pages
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ CA portal
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Organization routes
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Billing actions
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Sensitive APIs
 *
 * WHY
 * Never scatter:
 *   if (user.role !== "admin")
 *
 * Instead:
 *   requireAdmin()
 *   requireOrgPermission()
 *
 * BENEFITS
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ secure
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ reusable
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ consistent
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ enterprise compliant
 *
 * SAFE
 * - server only
 * - no existing files modified
 *
 * =========================================================
 *
 * USAGE (API / Server Action)
 *
 * import { requireAdmin } from "@/lib/security/permission-guard"
 *
 * export async function POST() {
 *   const user = await requireAdmin()
 *   ...
 * }
 *
 * =========================================================
 */

"use server"

import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import { can, Permission, OrgRole } from "@/lib/orgs/role-permissions"

/* =========================================================
   ADMIN CLIENT
========================================================= */

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/* =========================================================
   GET USER FROM REQUEST (server context helper)
========================================================= */

export async function getUserOrThrow(userId?: string | null) {
  if (!userId) throw new Error("Unauthorized")
  return userId
}

/* =========================================================
   ADMIN CHECK
========================================================= */
/**
 * Assumes profiles.is_admin boolean exists
 */

export async function requireAdmin(userId?: string | null) {
  const id = await getUserOrThrow(userId)
  const supabase = getClient()

  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", id)
    .single()

  if (!data?.is_admin) {
    throw new Error("Admin access required")
  }

  return id
}

/* =========================================================
   ORG ROLE FETCH
========================================================= */

async function getOrgRole(
  orgId: string,
  userId: string
): Promise<OrgRole | null> {
  const supabase = getClient()

  const { data } = await supabase
    .from("organization_members")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .maybeSingle()

  return (data?.role as OrgRole) || null
}

/* =========================================================
   REQUIRE ORG PERMISSION
========================================================= */

export async function requireOrgPermission(
  orgId: string,
  userId: string | null | undefined,
  permission: Permission
) {
  const id = await getUserOrThrow(userId)

  const role = await getOrgRole(orgId, id)

  if (!can(role, permission)) {
    throw new Error("Forbidden")
  }

  return {
    userId: id,
    role,
  }
}

/* =========================================================
   REQUIRE ANY PERMISSION
========================================================= */

export async function requireAnyPermission(
  orgId: string,
  userId: string | null | undefined,
  permissions: Permission[]
) {
  const id = await getUserOrThrow(userId)

  const role = await getOrgRole(orgId, id)

  const allowed = permissions.some((p) => can(role, p))

  if (!allowed) {
    throw new Error("Forbidden")
  }

  return {
    userId: id,
    role,
  }
}
