/*
=========================================================
GST TOKEN MANAGER — ENTERPRISE SAFE (FINAL)
Week 2 Hardening

✓ retry
✓ timeout
✓ race-safe (best effort)
✓ env validation
✓ typed response
✓ safer DB update
✓ clear logs
=========================================================
*/

import { createClient } from "@supabase/supabase-js"

/* =========================================================
   ENV VALIDATION
========================================================= */

const BASE_URL = process.env.GSP_BASE_URL
const API_KEY = process.env.GSP_API_KEY

if (!BASE_URL || !API_KEY) {
  throw new Error(
    "Missing GSP_BASE_URL or GSP_API_KEY environment variables"
  )
}

/* =========================================================
   ADMIN CLIENT
========================================================= */

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* =========================================================
   IN-MEMORY LOCK (best effort)
========================================================= */

const refreshLocks = new Map<string, Promise<string>>()

/* =========================================================
   TYPES
========================================================= */

type TokenResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
}

/* =========================================================
   UTILS
========================================================= */

const wait = (ms: number) =>
  new Promise((r) => setTimeout(r, ms))

async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3
): Promise<T> {
  let lastErr: any

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      await wait(1000 * (i + 1))
    }
  }

  throw lastErr
}

/* =========================================================
   PUBLIC API
========================================================= */

export async function getValidGSTToken(orgId: string) {
  const { data: cred, error } = await supabaseAdmin
    .from("gst_credentials")
    .select("*")
    .eq("org_id", orgId)
    .single()

  if (error || !cred) {
    throw new Error("GST not connected")
  }

  const now = Date.now()

  /* still valid */
  if (cred.expires_at && new Date(cred.expires_at).getTime() > now + 60_000) {
    return cred.access_token
  }

  /* lock */
  if (refreshLocks.has(orgId)) {
    return refreshLocks.get(orgId)!
  }

  const promise = refreshToken(orgId, cred.refresh_token)
  refreshLocks.set(orgId, promise)

  try {
    return await promise
  } finally {
    refreshLocks.delete(orgId)
  }
}

/* =========================================================
   INTERNAL REFRESH
========================================================= */

async function refreshToken(
  orgId: string,
  refreshToken: string
) {
  console.log("🔄 Refreshing GST token:", orgId)

  return withRetry(async () => {
    const controller = new AbortController()

    const timeout = setTimeout(
      () => controller.abort(),
      15000
    )

    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("Token refresh failed:", text)
        throw new Error("Token refresh failed")
      }

      const tokenData = (await res.json()) as TokenResponse

      /* safer timestamp */
      const expiryDate = new Date(
        Date.now() + tokenData.expires_in * 1000
      )

      const { error: updateErr } = await supabaseAdmin
        .from("gst_credentials")
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: expiryDate,
        })
        .eq("org_id", orgId)

      if (updateErr) {
        console.error(updateErr)
        throw new Error("Failed to save GST token")
      }

      return tokenData.access_token
    } finally {
      clearTimeout(timeout)
    }
  })
}
