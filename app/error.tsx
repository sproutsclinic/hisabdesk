ï»¿"use client"

import { useEffect } from "react"

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // production-safe logging only
    console.error("App Crash:", {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    })
  }, [error])

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Something went wrong
          </h1>

          <p className="text-sm text-gray-600">
            HisabDesk encountered an unexpected error.
            <br />
            Please retry.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-xl bg-black text-white text-sm hover:opacity-90"
            >
              Retry
            </button>

            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-4 py-2 rounded-xl border text-sm"
            >
              Go Dashboard
            </button>
          </div>

          <p className="text-xs text-gray-400">
            If issue persists, refresh the page.
          </p>
        </div>
      </body>
    </html>
  )
}
