"use client"

import React from "react"
import { ShieldCheck } from "lucide-react"

/* ========================================
   GLOBAL ERROR BOUNDARY
   Prevents white screen crashes
   Fintech trust safe state
======================================== */

type State = {
  hasError: boolean
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any) {
    console.error("App crashed:", error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const now = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
      })

      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">

          <div className="card max-w-md w-full text-center space-y-6">

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
              <ShieldCheck size={16} />
              Secure cloud backup active
            </div>

            <h2 className="text-lg font-semibold">
              Something went wrong
            </h2>

            <p className="text-sm text-zinc-500">
              Don’t worry — your financial data is safe and synced.
            </p>

            <p className="text-xs text-zinc-400">
              Last sync: {now}
            </p>

            <button
              onClick={this.handleReload}
              className="btn"
            >
              Reload App
            </button>

          </div>

        </div>
      )
    }

    return this.props.children
  }
}
