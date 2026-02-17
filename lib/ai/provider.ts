ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AI Provider Abstraction (FINAL)
// ----------------------------------------------------------
// Single contract aligned with openai.ts
// ==========================================================

import { runAI, type AIRunType } from "./openai"

/* =========================================================
   STANDARD RESULT (single shape across app)
========================================================= */

export type AIResult = {
  text: string
  tokens: number
}

/* =========================================================
   PROVIDER INTERFACE
========================================================= */

export interface AIProvider {
  run(params: {
    prompt: string
    type?: AIRunType
    system?: string
  }): Promise<AIResult>
}

/* =========================================================
   OPENAI PROVIDER (current engine)
========================================================= */

class OpenAIProvider implements AIProvider {
  async run(params: {
    prompt: string
    type?: AIRunType
    system?: string
  }): Promise<AIResult> {
    // system is ignored for now (kept for future extensibility)

    return runAI({
      prompt: params.prompt,
      type: params.type ?? "cheap",
    })
  }
}

/* =========================================================
   FACTORY (swappable later)
========================================================= */

let provider: AIProvider = new OpenAIProvider()

export function getProvider(): AIProvider {
  return provider
}

/* =========================================================
   FUTURE (multi-provider ready)
========================================================= */
// export function setProvider(p: AIProvider) {
//   provider = p
// }
