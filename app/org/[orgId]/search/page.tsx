"use client"

/**
 * =========================================================
 * Organization Global Search UI
 * HisabDesk – Enterprise Productivity (Universal Search)
 * =========================================================
 *
 * ROUTE
 *   /org/[orgId]/search
 *
 * PURPOSE
 * Google-like quick search inside organization:
 *
 *   ✓ income
 *   ✓ expenses
 *   ✓ documents
 *   ✓ members
 *   ✓ activity logs
 *
 * CONNECTS TO
 *   lib/search/global-search.ts
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useState } from "react"
import { useParams } from "next/navigation"
import { globalSearch, SearchResult } from "@/lib/search/global-search"

export default function OrgSearchPage() {
  const params = useParams()
  const orgId = params?.orgId as string

  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])

  /* ======================================================
     SEARCH
  ====================================================== */

  async function runSearch(q: string) {
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
     UI
  ====================================================== */

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-2xl font-semibold">
          Search
        </h2>
        <p className="text-sm text-gray-500">
          Find anything in this organization
        </p>
      </div>

      {/* SEARCH INPUT */}
      <input
        autoFocus
        placeholder="Search transactions, documents, members..."
        value={query}
        onChange={(e) => runSearch(e.target.value)}
        className="border rounded-xl px-4 py-3 w-full"
      />

      {loading && <p className="text-sm">Searching...</p>}

      {/* RESULTS */}
      <div className="border rounded-xl divide-y">
        {results.map((r) => (
          <a
            key={`${r.type}-${r.id}`}
            href={r.url}
            className="block p-4 hover:bg-gray-50"
          >
            <p className="font-medium capitalize">
              {r.title}
            </p>

            <p className="text-xs text-gray-500">
              {r.type}
              {r.subtitle ? ` • ${r.subtitle}` : ""}
            </p>
          </a>
        ))}

        {!loading && query.length >= 2 && results.length === 0 && (
          <p className="p-4 text-sm text-gray-500">
            No results found
          </p>
        )}
      </div>
    </div>
  )
}
