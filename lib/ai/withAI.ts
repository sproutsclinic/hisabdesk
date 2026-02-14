// ==========================================================
// HisabDesk — withAI Wrapper (Route Helper)
// ----------------------------------------------------------
// PURPOSE
//   Standard wrapper for ALL /api/ai routes
//
//   Eliminates:
//     ❌ repeated auth logic
//     ❌ repeated try/catch
//     ❌ repeated guard + safeRun setup
//
//   Gives:
//     ✓ auth
//     ✓ rate-limit protection (via safeRunAI)
//     ✓ consistent error handling
//     ✓ production-grade pattern
//
// ==========================================================
//
// USAGE (example)
//
// export const POST = withAI(async ({ user, safeRun }) => {
//   const result = await safeRun({
//     prompt: "...",
//     type: "module",
//     module: "dashboard-summary"
//   })
//
//   return { insights: result.text }
// })
//
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { safeRunAI, AIRunType } from "@/lib/ai"

// ==========================================================
// TYPES
// ==========================================================

interface SafeRunParams {
  prompt: string
  type: AIRunType
  system?: string
  module: string
}

interface HandlerContext {
  user: {
    id: string
    email?: string | null
  }
  safeRun: (params: SafeRunParams) => Promise<any>
}

type Handler = (
  ctx: HandlerContext,
  req: Request
) => Promise<any>

// ==========================================================
// CLIENT
// ==========================================================

const supabase = createClient()

// ==========================================================
// AUTH
// ==========================================================

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  return user
}

// ==========================================================
// WRAPPER
// ==========================================================

export function withAI(handler: Handler) {
  return async function (req: Request) {
    try {
      const user = await getUser()

      const response = await handler(
        {
          user,
          safeRun: (params: SafeRunParams) =>
            safeRunAI({
              userId: user.id,
              ...params,
            }),
        },
        req
      )

      return NextResponse.json(response)
    } catch (e: any) {
      return NextResponse.json(
        { error: e.message || "AI request failed" },
        { status: 401 }
      )
    }
  }
}
