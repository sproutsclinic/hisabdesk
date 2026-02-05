"use client"

import React from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"

/* ========================================
   GLOBAL ERROR BOUNDARY — Fintech Safe

   Purpose:
   ✅ prevents white screen crashes
   ✅ protects financial UX
   ✅ graceful fallback
   ✅ retry button
   ✅ mobile friendly
   ✅ production safe

   Already used in:
   app/layout.tsx → <ErrorBoundary>
======================================== */

type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("App Crash:", error, info)
  }

  reset = () => {
    this.setState({ hasError: false })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="
            min-h-screen
            flex items-center justify-center
            px-6
            bg-zinc-50 dark:bg-zinc-950
          "
        >
          <div
            className="
              max-w-sm w-full
              bg-white dark:bg-zinc-900
              border border-zinc-200 dark:border-zinc-800
              rounded-2xl
              p-6
              shadow-sm
              text-center
              space-y-4
            "
          >
            <div className="flex justify-center text-red-600">
              <AlertTriangle size={28} />
            </div>

            <h2 className="text-sm font-semibold">
              Something went wrong
            </h2>

            <p className="text-xs text-zinc-500">
              Don’t worry. Your financial data is safe.
              Please refresh the page.
            </p>

            <button
              onClick={this.reset}
              className="
                inline-flex items-center justify-center gap-2
                bg-zinc-900 text-white
                h-10 px-4
                rounded-xl text-sm font-medium
                hover:opacity-90 transition
              "
            >
              <RefreshCcw size={14} />
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
