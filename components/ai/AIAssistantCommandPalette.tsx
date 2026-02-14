"use client"

// ==========================================================
// HisabDesk — AI Command Palette
// ----------------------------------------------------------
// PURPOSE
//   Power-user quick command launcher for AI
//
//   UX:
//     Cmd/Ctrl + K → opens palette
//     Type → pick suggestion → auto ask AI
//
//   Why:
//     ✓ very fast workflow
//     ✓ zero typing full questions
//     ✓ pro feature (Notion/Linear style)
//     ✓ great for heavy users
//
//   Uses:
//     ✓ useAIHotkeys
//     ✓ useAIAssistant
//     ✓ useAIShortcuts
//
//   This is OPTIONAL advanced UI.
//   Safe to mount globally.
//
// ==========================================================

import { useEffect, useMemo, useState } from "react"

import { useAIHotkeys } from "@/lib/hooks/useAIHotkeys"
import { useAIAssistant } from "@/lib/hooks/useAIAssistant"
import { useAIShortcuts } from "@/lib/hooks/useAIShortcuts"

// ==========================================================
// COMPONENT
// ==========================================================

export default function AIAssistantCommandPalette() {
  const { isOpen, close } = useAIHotkeys()

  const { ask, loading } = useAIAssistant()
  const { list } = useAIShortcuts()

  const [query, setQuery] = useState("")
  const [reply, setReply] = useState("")

  // --------------------------------------------------------
  // FILTER
  // --------------------------------------------------------

  const filtered = useMemo(() => {
    if (!query) return list
    return list.filter((s) =>
      s.toLowerCase().includes(query.toLowerCase())
    )
  }, [query, list])

  // --------------------------------------------------------
  // ASK
  // --------------------------------------------------------

  async function run(prompt: string) {
    const text = await ask(prompt)
    setReply(text)
  }

  // close → reset
  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setReply("")
    }
  }, [isOpen])

  // --------------------------------------------------------
  // HIDDEN
  // --------------------------------------------------------

  if (!isOpen) return null

  // ========================================================
  // UI
  // ========================================================

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={close}
      />

      {/* palette */}
      <div className="relative w-[520px] max-w-full bg-white border rounded-xl shadow-xl p-4 space-y-3">
        {/* input */}
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI or search shortcuts…"
          className="w-full border rounded px-3 py-2 text-sm"
        />

        {/* list */}
        <div className="max-h-48 overflow-y-auto space-y-1">
          {filtered.map((item) => (
            <button
              key={item}
              onClick={() => run(item)}
              disabled={loading}
              className="
                w-full text-left text-sm
                px-3 py-2 rounded
                hover:bg-muted
              "
            >
              {item}
            </button>
          ))}
        </div>

        {/* reply */}
        {reply && (
          <div className="text-sm bg-muted p-2 rounded whitespace-pre-wrap">
            {reply}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Press Esc to close
        </div>
      </div>
    </div>
  )
}
