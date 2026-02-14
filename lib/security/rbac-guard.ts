/**
 * =========================================================
 * RBAC Guard (Server Middleware Helper)
 * HisabDesk – Enterprise Access Enforcement
 * =========================================================
 *
 * PURPOSE
 * Enforce organization permissions INSIDE:
 *
 *   ✓ API routes
 *   ✓ server actions
 *   ✓ admin endpoints
 *
 * This prevents:
 *   ❌ trusting frontend checks
 *   ❌ scattered permission logic
 *
 * ALWAYS validate on server.
 *
 * CONNECTS TO
 *   lib/orgs/role-permissions.ts   (your existing RBAC)
 *
 * SAFE
 * - server only
 * - pure helper
 * - no existing file modifications
 *
 * =========================================================
 *
 * ========================
 * HOW TO USE (API route)
 * ========================
 *
 * import { guard } from "@/lib/security/rbac-guard"
 *
 * export async function POST(req: Request) {
 *   const { user, role } = await guard(req, {
 *     orgId: "org_id",
 *     permission: "manage_billing",
 *   })
 *
 *   // now safe
 * }
 *
 * =========================================================
 */

"use server"

import { createClient } from "@supabase/supabase-js"
import {
  can,
  requirePermission,
  OrgRole,
  Permission,
} from "@/lib/orgs/role-permissions"

/* =========================================================
   CLIENT
========================================================= */

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/* =========================================================
   TYPES
========================================================= */

type GuardOptions = {
  orgId: string
  permission: Permission
}

type GuardResult = {
  user: any
  role: OrgRole
}

/* =========================================================
   CORE GUARD
========================================================= */

export async function guard(
  req: Request,
  options: GuardOptions
): Promise<GuardResult> {
  const supabase = getClient()

  /* ------------------------------------------------------
     1. AUTH
  ------------------------------------------------------ */

  const authHeader = req.headers.get("authorization")

  if (!authHeader) {
    throw new Error("Unauthorized")
  }

  const token = authHeader.replace("Bearer ", "")

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    throw new Error("Unauthorized")
  }

  /* ------------------------------------------------------
     2. GET ROLE
  ------------------------------------------------------ */

  const { data: membership } = await supabase
    .from("organization_members")
    .select("role")
    .eq("org_id", options.orgId)
    .eq("user_id", user.id)
    .single()

  if (!membership) {
    throw new Error("Forbidden")
  }

  const role = membership.role as OrgRole

  /* ------------------------------------------------------
     3. PERMISSION CHECK
  ------------------------------------------------------ */

  requirePermission(role, options.permission)

  /* ------------------------------------------------------
     4. RETURN SAFE CONTEXT
  ------------------------------------------------------ */

  return {
    user,
    role,
  }
}

/* =========================================================
   LIGHTWEIGHT CHECK (boolean)
========================================================= */

export async function hasPermission(
  userId: string,
  orgId: string,
  permission: Permission
) {
  const supabase = getClient()

  const { data } = await supabase
    .from("organization_members")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .single()

  if (!data) return false

  return can(data.role as OrgRole, permission)
}
