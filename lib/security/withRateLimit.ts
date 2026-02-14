import { NextRequest, NextResponse } from "next/server"
import { rateLimit } from "./rateLimit"

/*
  Wrapper for API routes

  Usage:

  export const POST = withRateLimit(async (req) => {
     ...
  })
*/

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown"

    const allowed = rateLimit(ip)

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      )
    }

    return handler(req)
  }
}
