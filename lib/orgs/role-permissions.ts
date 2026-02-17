ï»¿/**
 * =========================================================
 * Role Permission Engine (RBAC)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Phase C (Scale)
 * =========================================================
 *
 * PURPOSE
 * Central permission control for:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Organizations
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Teams
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ CA firms
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Multi-tenant access
 *
 * WHY
 * Never scatter "if (role === admin)" checks across app.
 * ALL access rules must live here.
 *
 * BENEFITS
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ single source of truth
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ secure
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ easy to extend
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ enterprise compliant
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
     OWNER ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â full access
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
     ADMIN ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â almost full
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
     ACCOUNTANT ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â CA/staff
  ====================================================== */
  accountant: [
    "view_finances",
    "edit_finances",
    "manage_tax",
    "manage_documents",
    "export_reports",
  ],

  /* ======================================================
     MEMBER ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â limited usage
  ====================================================== */
  member: [
    "view_finances",
    "manage_documents",
  ],

  /* ======================================================
     VIEWER ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â read only
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
