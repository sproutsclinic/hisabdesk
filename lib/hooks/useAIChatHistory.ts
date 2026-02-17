ï»¿"use client"

// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â useAIChatHistory Hook
// ----------------------------------------------------------
// PURPOSE
//   Lightweight local chat history manager
//
//   Why:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ keeps FAB clean
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ enables multi-turn chat later
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ reusable across assistant UIs
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ zero backend change required
//
//   Stores:
//     in-memory only (no DB, no tokens)
//
//   Usage:
//
//     const {
//       messages,
//       addUser,
//       addAI,
//       clear
//     } = useAIChatHistory()
//
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export type ChatRole = "user" | "ai"

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
  createdAt: number
}

// ==========================================================
// HOOK
// ==========================================================

import { useState } from "react"

function id() {
  return Math.random().toString(36).slice(2)
}

export function useAIChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>(
    []
  )

  // --------------------------------------------------------
  // ADD USER
  // --------------------------------------------------------

  function addUser(text: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: id(),
        role: "user",
        text,
        createdAt: Date.now(),
      },
    ])
  }

  // --------------------------------------------------------
  // ADD AI
  // --------------------------------------------------------

  function addAI(text: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: id(),
        role: "ai",
        text,
        createdAt: Date.now(),
      },
    ])
  }

  // --------------------------------------------------------
  // CLEAR
  // --------------------------------------------------------

  function clear() {
    setMessages([])
  }

  return {
    messages,
    addUser,
    addAI,
    clear,
  }
}
