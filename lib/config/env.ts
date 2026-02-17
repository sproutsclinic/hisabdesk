ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Environment Validation (Fail Fast)
// Location: lib/config/env.ts
//
// PURPOSE
// Validate ALL required environment variables at boot.
//
// WHY
// - prevent silent production misconfig
// - crash early instead of runtime bugs
// - avoids partial failures (auth, db, ai)
//
// USAGE
// import "@/lib/config/env"
//
// Add once in:
//   app/layout.tsx  (root)
// OR
//   any server bootstrap file
//
// RULES
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ server only
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ zero business logic
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no side effects except validation
// ==========================================================

/* =========================================================
Types
========================================================= */

type EnvKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "CRON_SECRET"
  | "OPENAI_API_KEY"

/* =========================================================
Helpers
========================================================= */

function required(key: EnvKey): string {
  const value = process.env[key]

  if (!value || value.length === 0) {
    throw new Error(`ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ Missing required environment variable: ${key}`)
  }

  return value
}

function optional(key: string, fallback?: string) {
  return process.env[key] ?? fallback
}

/* =========================================================
Validated Export
========================================================= */

export const env = {
  // -------------------------------------------------------
  // Supabase
  // -------------------------------------------------------

  NEXT_PUBLIC_SUPABASE_URL: required("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY: required("SUPABASE_SERVICE_ROLE_KEY"),

  // -------------------------------------------------------
  // AI
  // -------------------------------------------------------

  OPENAI_API_KEY: required("OPENAI_API_KEY"),

  // -------------------------------------------------------
  // Security
  // -------------------------------------------------------

  CRON_SECRET: required("CRON_SECRET"),

  // -------------------------------------------------------
  // Optional
  // -------------------------------------------------------

  NODE_ENV: optional("NODE_ENV", "development"),
  APP_ENV: optional("APP_ENV", "local"),
  LOG_LEVEL: optional("LOG_LEVEL", "info"),
}

/* =========================================================
Boot Validation (executes on import)
========================================================= */

export function validateEnv() {
  // Accessing properties forces validation
  Object.values(env)
}

/* =========================================================
Auto-run (fail fast)
========================================================= */

validateEnv()
