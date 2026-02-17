ï»¿import { NextResponse } from "next/server"
import { rateLimit } from "./rateLimit"

export function withRateLimit<T extends (...args: any[]) => any>(
 handler: T,
) {
  return async (req: Request, ctx: any) => {
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "global"

    const result = rateLimit(ip)

    if (!result.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 },
      )
    }

    return handler(req, ctx)
  }
}
