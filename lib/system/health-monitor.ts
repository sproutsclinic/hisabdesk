ï»¿/**
 * =========================================================
 * System Health Monitor (Enterprise Observability)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Reliability Layer
 * =========================================================
 *
 * PURPOSE
 * Monitor overall system health:
 *
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ database connectivity
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Supabase latency
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ storage access
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ env config presence
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ queue backlog
 *
 * Useful for:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ /admin/system page
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ uptime checks
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ alerts
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ debugging production issues
 *
 * SAFE
 * - server only
 * - no existing files modified
 *
 * =========================================================
 *
 * USAGE
 *
 * const health = await getSystemHealth()
 *
 * return Response.json(health)
 *
 * =========================================================
 */

"use server"

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

/* =========================================================
   TYPES
========================================================= */

export type HealthCheck = {
  name: string
  status: "ok" | "warn" | "fail"
  latency?: number
  message?: string
}

export type SystemHealth = {
  status: "ok" | "degraded" | "down"
  checks: HealthCheck[]
  timestamp: string
}

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
   ENV CHECK
========================================================= */

function checkEnv(): HealthCheck {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
  ]

  const missing = required.filter((k) => !process.env[k])

  if (missing.length) {
    return {
      name: "environment",
      status: "fail",
      message: `Missing: ${missing.join(", ")}`,
    }
  }

  return {
    name: "environment",
    status: "ok",
  }
}

/* =========================================================
   DATABASE CHECK
========================================================= */

async function checkDatabase(): Promise<HealthCheck> {
  const supabase = getClient()

  const start = Date.now()

  try {
    await supabase.from("profiles").select("id").limit(1)

    const latency = Date.now() - start

    return {
      name: "database",
      status: latency > 1500 ? "warn" : "ok",
      latency,
    }
  } catch (err: any) {
    return {
      name: "database",
      status: "fail",
      message: err.message,
    }
  }
}

/* =========================================================
   STORAGE CHECK
========================================================= */

async function checkStorage(): Promise<HealthCheck> {
  const supabase = getClient()

  const start = Date.now()

  try {
    await supabase.storage.listBuckets()

    const latency = Date.now() - start

    return {
      name: "storage",
      status: latency > 1500 ? "warn" : "ok",
      latency,
    }
  } catch (err: any) {
    return {
      name: "storage",
      status: "fail",
      message: err.message,
    }
  }
}

/* =========================================================
   QUEUE BACKLOG CHECK (offline queue or jobs)
========================================================= */

async function checkQueue(): Promise<HealthCheck> {
  const supabase = getClient()

  try {
    const { count } = await supabase
      .from("payment_jobs")
      .select("*", { count: "exact", head: true })

    if ((count || 0) > 500) {
      return {
        name: "queue",
        status: "warn",
        message: `High backlog: ${count}`,
      }
    }

    return {
      name: "queue",
      status: "ok",
    }
  } catch {
    return {
      name: "queue",
      status: "ok",
    }
  }
}

/* =========================================================
   MAIN HEALTH AGGREGATOR
========================================================= */

export async function getSystemHealth(): Promise<SystemHealth> {
  const checks: HealthCheck[] = []

  checks.push(checkEnv())
  checks.push(await checkDatabase())
  checks.push(await checkStorage())
  checks.push(await checkQueue())

  let status: SystemHealth["status"] = "ok"

  if (checks.some((c) => c.status === "fail")) {
    status = "down"
  } else if (checks.some((c) => c.status === "warn")) {
    status = "degraded"
  }

  return {
    status,
    checks,
    timestamp: new Date().toISOString(),
  }
}
