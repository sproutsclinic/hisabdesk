// ==========================================================
// HisabDesk — AI Middleware Utilities
// ----------------------------------------------------------
// PURPOSE
//   Shared helpers for ALL AI routes
//
//   Handles:
//     ✓ auth
//     ✓ JSON body parsing
//     ✓ small prompt enforcement
//     ✓ standard responses
//
//   Keeps route files extremely small + clean
//
//   This is NOT the AI runner.
//   It is route hygiene utilities only.
//
// ==========================================================

import { createClient } from "@/lib/supabase"

// ==========================================================
// CLIENT
// ==========================================================

const supabase = createClient()

// ==========================================================
// AUTH HELPER
// ==========================================================

export async function requireUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  return user
}

// ==========================================================
// SAFE JSON PARSER
// ==========================================================

export async function readJson<T = any>(
  req: Request,
  fallback: T
): Promise<T> {
  try {
    return (await req.json()) as T
  } catch {
    return fallback
  }
}

// ==========================================================
// PROMPT SANITIZER
// ----------------------------------------------------------
// Prevents:
//   ❌ extremely large prompts
//   ❌ token abuse
//
// Keeps prompts short & safe
// ==========================================================

const MAX_PROMPT_CHARS = 4000

export function sanitizePrompt(prompt: string) {
  if (!prompt) return ""

  if (prompt.length <= MAX_PROMPT_CHARS) return prompt

  return prompt.slice(0, MAX_PROMPT_CHARS)
}

// ==========================================================
// STANDARD SUCCESS
// ==========================================================

export function ok(data: any) {
  return Response.json(data)
}

// ==========================================================
// STANDARD ERROR
// ==========================================================

export function fail(message: string, status = 401) {
  return Response.json({ error: message }, { status })
}
