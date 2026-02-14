/*
  PHASE 17 — Security Barrel Export

  Single import point for all security utilities

  Usage:

  import {
    withAdmin,
    withRateLimit,
    withAudit,
    hasRole,
    logAudit
  } from "@/lib/security"
*/

export { rateLimit } from "./rateLimit"
export { withRateLimit } from "./withRateLimit"

export { logAudit } from "./auditLog"
export { withAudit } from "./withAudit"

export { hasRole, requireAdmin } from "./permissions"

export { requireAdminRoute } from "./requireAdmin"
export { withAdmin } from "./withAdmin"
