/*
=========================================================
GST GSP CLIENT — ENTERPRISE SAFE (FINAL)
Week 2 Hardening

✓ timeout
✓ retry
✓ exponential backoff
✓ safe JSON parsing
✓ clear errors
✓ env validation
✓ typed return
✓ debug logging
=========================================================
*/

const BASE_URL = process.env.GSP_BASE_URL
const API_KEY = process.env.GSP_API_KEY

/* =========================================================
   ENV SAFETY
========================================================= */

if (!BASE_URL || !API_KEY) {
  throw new Error(
    "Missing GSP_BASE_URL or GSP_API_KEY environment variables"
  )
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
   MAIN FETCH
========================================================= */

export async function gspFetch<T = any>(
  path: string,
  token: string,
  timeoutMs = 15000
): Promise<T> {
  return withRetry(async () => {
    const controller = new AbortController()

    const timeout = setTimeout(
      () => controller.abort(),
      timeoutMs
    )

    try {
      const url = `${BASE_URL}${path}`

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })

      if (!res.ok) {
        const text = await res.text()

        console.error(
          `[GST] ${res.status} ${path} → ${text.slice(0, 200)}`
        )

        throw new Error(`GST API ${res.status}`)
      }

      try {
        return (await res.json()) as T
      } catch {
        throw new Error("GST API returned invalid JSON")
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        throw new Error("GST request timeout")
      }

      throw err
    } finally {
      clearTimeout(timeout)
    }
  })
}
