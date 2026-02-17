ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AI Middleware Utilities
// ----------------------------------------------------------
// PURPOSE
//   Shared helpers for ALL AI routes
//
//   Handles:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ auth
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ JSON body parsing
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ small prompt enforcement
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ standard responses
//
//   Keeps route files extremely small + clean
//
//   This is NOT the AI runner.
//   It is route hygiene utilities only.
//
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

// ==========================================================
// CLIENT
// ==========================================================

const supabase = getSupabaseAdmin()

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
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ extremely large prompts
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ token abuse
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
