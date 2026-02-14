"use client"

// ==========================================================
// HisabDesk — AI Assistant History View
// ----------------------------------------------------------
// PURPOSE
//   Reusable chat history renderer
//
//   Why:
//     ✓ keeps FAB/panel clean
//     ✓ separates UI from logic
//     ✓ enables multi-turn conversation
//     ✓ future: streaming / markdown support
//
//   Used by:
//     ✓ AIAssistantPanel (later)
//     ✓ full-page assistant
//
//   Pure presentational component
// ==========================================================

import type { ChatMessage } from "@/lib/hooks/useAIChatHistory"

// ==========================================================
// TYPES
// ==========================================================

interface Props {
  messages: ChatMessage[]
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function AIAssistantHistory({
  messages,
}: Props) {
  if (!messages.length) {
    return (
      <div className="text-xs text-muted-foreground">
        Ask anything about savings, tax, investments…
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`
            text-sm p-2 rounded
            ${
              m.role === "user"
                ? "bg-primary text-white ml-6"
                : "bg-muted mr-6"
            }
          `}
        >
          {m.text}
        </div>
      ))}
    </div>
  )
}
