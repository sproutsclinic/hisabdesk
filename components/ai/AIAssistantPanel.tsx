"use client"

// ==========================================================
// HisabDesk — AI Assistant Panel (Reusable Chat UI)
// ----------------------------------------------------------
// PURPOSE
//   Reusable assistant panel UI separated from FAB
//
//   Why:
//     ✓ clean separation (logic vs button)
//     ✓ can embed anywhere (drawer/modal/page)
//     ✓ uses centralized useAIAssistant hook
//
//   Used by:
//     ✓ Floating FAB
//     ✓ future inline help panels
//     ✓ dashboard assistant
//
// ==========================================================

import { useState } from "react"
import { useAIAssistant } from "@/lib/hooks/useAIAssistant"

// ==========================================================
// TYPES
// ==========================================================

interface Props {
  onClose?: () => void
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function AIAssistantPanel({ onClose }: Props) {
  const { ask, reply, loading } = useAIAssistant()

  const [message, setMessage] = useState("")

  // --------------------------------------------------------
  // SEND
  // --------------------------------------------------------

  async function handleSend() {
    if (!message.trim()) return
    await ask(message)
    setMessage("")
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <div
      className="
        w-80
        bg-white
        border rounded-xl shadow-xl
        p-4 space-y-3
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm">
          HisabDesk AI
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground"
          >
            Close
          </button>
        )}
      </div>

      {/* Reply */}
      {reply && (
        <div className="text-sm bg-muted p-2 rounded whitespace-pre-wrap">
          {reply}
        </div>
      )}

      {/* Input */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about savings, tax, investments..."
        rows={3}
        className="w-full text-sm border rounded p-2 resize-none"
      />

      {/* Button */}
      <button
        onClick={handleSend}
        disabled={loading}
        className="w-full bg-primary text-white rounded py-2 text-sm"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
    </div>
  )
}
