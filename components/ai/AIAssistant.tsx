ï»¿"use client"

// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Global AI Financial Assistant
// Floating ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Always available ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Secure (API route only)
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Page-aware (NEW)
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Sends userId + current page to backend
// NO direct OpenAI calls here
// ==========================================================

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

export default function AIAssistant() {
  const supabase = getSupabaseClient()

  // ========================================================
  // STATE
  // ========================================================

  const pathname = usePathname() // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ page detection

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      content:
        "Hi ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¹Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¹ IÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢m your AI Finance Manager.\nAsk anything about tax, savings, or expenses.",
    },
  ])

  // ========================================================
  // LOAD USER (for personalised financial context)
  // ========================================================

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      setUserId(data?.user?.id || null)
    }

    loadUser()
  }, [])

  // ========================================================
  // PAGE LABEL (human readable for AI)
  // ========================================================

  function getPageContext() {
    if (pathname.startsWith("/income")) return "Income Page"
    if (pathname.startsWith("/expense")) return "Expense Page"
    if (pathname.startsWith("/wealth-planner")) return "Wealth Planner Page"
    if (pathname.startsWith("/insights")) return "Insights Page"
    if (pathname.startsWith("/tax")) return "Tax Page"
    if (pathname.startsWith("/dashboard")) return "Dashboard Page"

    return "General Finance App"
  }

  // ========================================================
  // SEND MESSAGE ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ server API (/api/ai/chat)
  // ========================================================

  async function send() {
    if (!input.trim() || loading || !userId) return

    const userMsg = { role: "user", content: input }

    setMessages((m) => [...m, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userId,
          page: getPageContext(), // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ NEW: page awareness
        }),
      })

      const data = await res.json()

      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.text || "No response" },
      ])
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "AI unavailable right now." },
      ])
    }

    setLoading(false)
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          fixed bottom-6 right-6
          h-12 w-12
          rounded-full
          bg-black text-white
          shadow-lg
          text-lg
        "
      >
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          className="
            fixed bottom-20 right-6
            w-80 h-[420px]
            bg-white
            border
            rounded-xl
            shadow-2xl
            flex flex-col
          "
        >
          {/* Header */}
          <div className="p-3 border-b font-medium text-sm">
            AI Finance Manager
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[85%] whitespace-pre-wrap ${
                  m.role === "assistant"
                    ? "bg-slate-100"
                    : "bg-black text-white ml-auto"
                }`}
              >
                {m.content}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-2 flex gap-2">
            <input
              className="flex-1 border rounded-lg px-2 text-sm"
              placeholder="Ask tax or finance question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              disabled={loading}
              className="bg-black text-white px-3 rounded-lg text-sm"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
