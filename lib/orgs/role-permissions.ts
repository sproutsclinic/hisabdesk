/**
 * =========================================================
 * Role Permission Engine (RBAC)
 * HisabDesk – Phase C (Scale)
 * =========================================================
 *
 * PURPOSE
 * Central permission control for:
 *   ✓ Organizations
 *   ✓ Teams
 *   ✓ CA firms
 *   ✓ Multi-tenant access
 *
 * WHY
 * Never scatter "if (role === admin)" checks across app.
 * ALL access rules must live here.
 *
 * BENEFITS
 *   ✓ single source of truth
 *   ✓ secure
 *   ✓ easy to extend
 *   ✓ enterprise compliant
 *
 * SAFE
 * - pure utility
 * - no DB writes
 * - no existing file changes
 *
 * USAGE
 *
 * import { can } from "@/lib/orgs/role-permissions"
 *
 * if (!can(role, "manage_billing")) return 403
 *
 * =========================================================
 */

/* =========================================================
   ROLES
========================================================= */

export type OrgRole =
  | "owner"
  | "admin"
  | "accountant"
  | "member"
  | "viewer"

/* =========================================================
   PERMISSIONS
========================================================= */

export type Permission =
  | "manage_org"
  | "manage_members"
  | "manage_billing"
  | "view_finances"
  | "edit_finances"
  | "manage_tax"
  | "manage_documents"
  | "export_reports"
  | "view_only"

/* =========================================================
   PERMISSION MATRIX
========================================================= */

const MATRIX: Record<OrgRole, Permission[]> = {
  /* ======================================================
     OWNER — full access
  ====================================================== */
  owner: [
    "manage_org",
    "manage_members",
    "manage_billing",
    "view_finances",
    "edit_finances",
    "manage_tax",
    "manage_documents",
    "export_reports",
  ],

  /* ======================================================
     ADMIN — almost full
  ====================================================== */
  admin: [
    "manage_members",
    "view_finances",
    "edit_finances",
    "manage_tax",
    "manage_documents",
    "export_reports",
  ],

  /* ======================================================
     ACCOUNTANT — CA/staff
  ====================================================== */
  accountant: [
    "view_finances",
    "edit_finances",
    "manage_tax",
    "manage_documents",
    "export_reports",
  ],

  /* ======================================================
     MEMBER — limited usage
  ====================================================== */
  member: [
    "view_finances",
    "manage_documents",
  ],

  /* ======================================================
     VIEWER — read only
  ====================================================== */
  viewer: ["view_only"],
}

/* =========================================================
   CORE CHECK
========================================================= */

export function can(
  role: OrgRole | null | undefined,
  permission: Permission
) {
  if (!role) return false
  return MATRIX[role]?.includes(permission) ?? false
}

/* =========================================================
   MULTIPLE CHECK
========================================================= */

export function canAny(
  role: OrgRole | null | undefined,
  permissions: Permission[]
) {
  if (!role) return false
  return permissions.some((p) => can(role, p))
}

/* =========================================================
   REQUIRE (throws for APIs)
========================================================= */

export function requirePermission(
  role: OrgRole | null | undefined,
  permission: Permission
) {
  if (!can(role, permission)) {
    throw new Error("Unauthorized")
  }
}

/* =========================================================
   GET ALL PERMISSIONS (debug/admin)
========================================================= */

export function getRolePermissions(role: OrgRole) {
  return MATRIX[role]
}

/* =========================================================
   REQUIRE ALL PERMISSIONS
========================================================= */

export function canAll(
  role: OrgRole | null | undefined,
  permissions: Permission[]
) {
  if (!role) return false
  return permissions.every((p) => can(role, p))
}

/* =========================================================
   ROLE HELPERS
========================================================= */

export function isElevatedRole(role: OrgRole | null | undefined) {
  return role === "owner" || role === "admin"
}
