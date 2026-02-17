ï»¿/**
 * =========================================================
 * OpenAI Runner (Core Engine)
 * HisabDesk AI Layer ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â FINAL
 * =========================================================
 *
 * Pure server utility used by API routes.
 * NOT a Server Action.
 */

import OpenAI from "openai"

/* =========================================================
   TYPES
========================================================= */

export type AIRunType = "cheap" | "heavy" | "module"

type RunAIParams = {
  prompt: string
  type?: AIRunType
  temperature?: number
}

/* =========================================================
   MODEL MAP
========================================================= */

const AI_MODELS: Record<AIRunType, string> = {
  cheap: "gpt-4o-mini",
  heavy: "gpt-4o",
  module: "gpt-4o",
}

const MAX_TOKENS: Record<AIRunType, number> = {
  cheap: 700,
  heavy: 1800,
  module: 1200,
}

/* =========================================================
   CLIENT
========================================================= */

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing")
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

/* =========================================================
   HELPERS
========================================================= */

export function getModel(type: AIRunType = "cheap") {
  return AI_MODELS[type]
}

export function getMaxTokens(type: AIRunType = "cheap") {
  return MAX_TOKENS[type]
}

/* =========================================================
   MAIN RUNNER
========================================================= */

export async function runAI(
  params: RunAIParams
): Promise<{ text: string; tokens: number }> {
  const {
    prompt,
    type = "cheap",
    temperature = 0.3,
  } = params

  const client = getClient()

  const completion = await client.chat.completions.create({
    model: getModel(type),
    temperature,
    max_tokens: getMaxTokens(type),
    messages: [
      {
        role: "system",
        content:
          "You are a precise financial assistant. Respond concisely with short actionable insights.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  })

  const text =
    completion.choices?.[0]?.message?.content ?? ""

  const tokens =
    completion.usage?.total_tokens ??
    Math.ceil(text.length / 4)

  return {
    text,
    tokens,
  }
}
