ï»¿/*
  PHASE 17 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Security Barrel Export

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
