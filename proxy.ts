import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/* =========================================================
   HisabDesk – Global Proxy (Next 16 compliant)
========================================================= */

/* ===============================
   RATE LIMIT
=============================== */

const WINDOW = 60_000
const LIMIT = 120

const buckets = new Map<string, { count: number; ts: number }>()

function rateLimit(ip: string) {
  const now = Date.now()
  const bucket = buckets.get(ip)

  if (!bucket || now - bucket.ts > WINDOW) {
    buckets.set(ip, { count: 1, ts: now })
    return true
  }

  if (bucket.count >= LIMIT) return false

  bucket.count++
  return true
}

function getIP(req: NextRequest): string {
  // Next.js 16 Edge-compatible IP detection
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded && forwarded.length > 0) {
    return forwarded.split(",")[0].trim()
  }

  const real = req.headers.get("x-real-ip")
  if (real && real.length > 0) {
    return real
  }

  return "unknown"
}

/* =========================================================
   ✅ NEXT 16 PROXY (required export name)
========================================================= */

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = getIP(req)

  const res = NextResponse.next()

  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("Referrer-Policy", "strict-origin")
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  )

  if (pathname.startsWith("/api")) {
    if (!rateLimit(ip)) {
      return new NextResponse("Too Many Requests", { status: 429 })
    }
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/ca")) {
    const hasSession =
      req.cookies.get("sb-access-token") ||
      req.cookies.get("sb-refresh-token")

    if (!hasSession) {
      const url = new URL("/login", req.url)
      return NextResponse.redirect(url)
    }
  }

  return res
}

/* ========================================================= */

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/ca/:path*"],
}

