ï»¿/*
  PHASE 17 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Role Permissions

  Usage:

  import { hasRole, requireAdmin } from "@/lib/security/permissions"

  if (!hasRole(userRole, "admin")) return forbidden
*/

export type Role = "user" | "pro" | "admin"

export const ROLE_HIERARCHY: Record<Role, number> = {
  user: 1,
  pro: 2,
  admin: 3,
}

export function hasRole(current: Role | undefined, required: Role) {
  if (!current) return false
  return ROLE_HIERARCHY[current] >= ROLE_HIERARCHY[required]
}

export function requireAdmin(role?: Role) {
  return hasRole(role, "admin")
}
