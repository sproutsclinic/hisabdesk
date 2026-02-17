ï»¿"use client"

// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AI Assistant Floating Button (Global)
// ----------------------------------------------------------
// PURPOSE
//   Floating AI assistant launcher available on EVERY page
//
//   Integrates with:
//     POST /api/ai/page-assistant
//
//   Provides:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ quick questions
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ contextual advice
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ finance-only answers
//
//   Lightweight:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ no heavy UI libs
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ minimal state
//
//   Drop once inside root layout:
//
//     <AIAssistantFAB />
//
// ==========================================================

import { useState } from "react"

// ==========================================================
// COMPONENT
// ==========================================================

export default function AIAssistantFAB() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(false)

  // --------------------------------------------------------
  // SEND
  // --------------------------------------------------------

  async function ask() {
    if (!message.trim()) return

    setLoading(true)
    setReply("")

    try {
      const res = await fetch("/api/ai/page-assistant", {
        method: "POST",
        body: JSON.stringify({
          message,
        }),
      })

      const json = await res.json()

      setReply(json.reply || "")
      setMessage("")
    } finally {
      setLoading(false)
    }
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          fixed bottom-6 right-6
          h-14 w-14 rounded-full
          bg-primary text-white
          shadow-lg
          flex items-center justify-center
          text-xl
        "
      >
        AI
      </button>

      {/* Panel */}
      {open && (
        <div
          className="
            fixed bottom-24 right-6
            w-80
            bg-white
            border rounded-xl shadow-xl
            p-4 space-y-3
          "
        >
          <div className="font-semibold text-sm">
            Ask HisabDesk AI
          </div>

          {/* Reply */}
          {reply && (
            <div className="text-sm bg-muted p-2 rounded">
              {reply}
            </div>
          )}

          {/* Input */}
          <textarea
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Ask about savings, tax, investments..."
            className="
              w-full text-sm
              border rounded p-2
              resize-none
            "
            rows={3}
          />

          <button
            onClick={ask}
            disabled={loading}
            className="
              w-full bg-primary text-white
              rounded py-2 text-sm
            "
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
      )}
    </>
  )
}
