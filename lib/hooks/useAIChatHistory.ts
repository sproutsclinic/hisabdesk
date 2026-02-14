"use client"

// ==========================================================
// HisabDesk — useAIChatHistory Hook
// ----------------------------------------------------------
// PURPOSE
//   Lightweight local chat history manager
//
//   Why:
//     ✓ keeps FAB clean
//     ✓ enables multi-turn chat later
//     ✓ reusable across assistant UIs
//     ✓ zero backend change required
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
