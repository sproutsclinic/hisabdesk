"use client"

// ==========================================================
// HisabDesk — AI Assistant Drawer (Advanced UI)
// ----------------------------------------------------------
// PURPOSE
//   Full-height side assistant (future upgrade path)
//
//   Why:
//     FAB = quick questions
//     Drawer = serious conversation
//
//   Enables:
//     ✓ multi-turn chat
//     ✓ history view
//     ✓ longer answers
//     ✓ future streaming
//
//   This does NOT replace FAB.
//   It is an optional advanced UI you can mount later.
//
//   Safe addition only.
// ==========================================================

import { useState } from "react"

import { useAIAssistant } from "@/lib/hooks/useAIAssistant"
import { useAIChatHistory } from "@/lib/hooks/useAIChatHistory"
import AIAssistantHistory from "./AIAssistantHistory"

// ==========================================================
// TYPES
// ==========================================================

interface Props {
  open: boolean
  onClose: () => void
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function AIAssistantDrawer({
  open,
  onClose,
}: Props) {
  const { ask, loading } = useAIAssistant()

  const {
    messages,
    addUser,
    addAI,
    clear,
  } = useAIChatHistory()

  const [input, setInput] = useState("")

  // --------------------------------------------------------
  // SEND
  // --------------------------------------------------------

  async function handleSend() {
    if (!input.trim()) return

    const text = input

    addUser(text)
    setInput("")

    const reply = await ask(text)

    if (reply) addAI(reply)
  }

  // --------------------------------------------------------
  // HIDE
  // --------------------------------------------------------

  if (!open) return null

  // ========================================================
  // UI
  // ========================================================

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="flex-1 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="
          w-96 max-w-full
          bg-white border-l shadow-xl
          p-4
          flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">
            HisabDesk AI Assistant
          </h2>

          <button
            onClick={onClose}
            className="text-sm text-muted-foreground"
          >
            Close
          </button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-hidden">
          <AIAssistantHistory messages={messages} />
        </div>

        {/* Input */}
        <div className="space-y-2 pt-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder="Ask about tax, savings, investments..."
            className="w-full border rounded p-2 text-sm resize-none"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSend}
              disabled={loading}
              className="flex-1 bg-primary text-white rounded py-2 text-sm"
            >
              {loading ? "Thinking..." : "Send"}
            </button>

            <button
              onClick={clear}
              className="px-3 border rounded text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
