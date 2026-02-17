ï»¿"use client"

/**
 * =========================================================
 * Global Search Bar (Floating Quick Search)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Enterprise Productivity UX
 * =========================================================
 *
 * PURPOSE
 * Keyboard-first universal search:
 *
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Cmd/Ctrl + K to open
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ search everything in org
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ instant navigation
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ power-user feature
 *
 * CONNECTS TO
 *   lib/search/global-search.ts
 *
 * USAGE (add once in layout/header)
 *
 * <GlobalSearchBar />
 *
 * SAFE
 * - client only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { globalSearch, SearchResult } from "@/lib/search/global-search"

export default function GlobalSearchBar({
  orgId,
}: {
  orgId: string
}) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  /* ======================================================
     HOTKEY (Cmd/Ctrl + K)
  ====================================================== */

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }

      if (e.key === "Escape") setOpen(false)
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  /* ======================================================
     SEARCH
  ====================================================== */

  async function run(q: string) {
    setQuery(q)

    if (q.length < 2) {
      setResults([])
      return
    }

    setLoading(true)

    const res = await globalSearch(orgId, q)
    setResults(res)

    setLoading(false)
  }

  /* ======================================================
     NAVIGATE
  ====================================================== */

  function go(url: string) {
    setOpen(false)
    router.push(url)
  }

  if (!open) return null

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-start pt-24">
      <div className="bg-white rounded-2xl shadow-xl w-[600px] max-w-[95%]">
        <input
          autoFocus
          placeholder="Search anything..."
          value={query}
          onChange={(e) => run(e.target.value)}
          className="w-full border-b px-4 py-3 outline-none"
        />

        <div className="max-h-80 overflow-auto">
          {loading && (
            <p className="p-3 text-sm text-gray-500">
              Searching...
            </p>
          )}

          {results.map((r) => (
            <button
              key={`${r.type}-${r.id}`}
              onClick={() => go(r.url)}
              className="w-full text-left p-3 hover:bg-gray-50 border-b"
            >
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-gray-500">
                {r.type}
                {r.subtitle ? ` ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ ${r.subtitle}` : ""}
              </p>
            </button>
          ))}

          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="p-3 text-sm text-gray-500">
              No results
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
