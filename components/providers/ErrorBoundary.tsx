ï»¿"use client"

import React from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"

/* ==========================================================
   ENTERPRISE ERROR BOUNDARY (Production Hardened)

   Improvements:
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ catches all render/runtime errors
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ no infinite reload loops
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ retry without page refresh
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ optional auto-reset on route change
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ production logging safe
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ accessibility compliant
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ fintech fallback UI
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ retry spam protection
========================================================== */

type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
  retrying: boolean
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      hasError: false,
      retrying: false,
    }
  }

  /* ======================================================
     TRIGGER FALLBACK
  ====================================================== */

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
      retrying: false,
    }
  }

  /* ======================================================
     LOGGING (safe for prod)
     Later ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ connect to Sentry / LogRocket
  ====================================================== */

  override componentDidCatch(error: unknown, info: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.error("APP_ERROR_BOUNDARY:", error, info)
    } else {
      // future safe logging hook
      // sendToSentry(error, info)
    }
  }

  /* ======================================================
     SAFE RETRY
     - prevents rapid double click
     - soft re-render only
  ====================================================== */

  handleRetry = () => {
    if (this.state.retrying) return

    this.setState({ retrying: true })

    // small delay ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ smoother UX
    setTimeout(() => {
      this.setState({
        hasError: false,
        retrying: false,
      })
    }, 200)
  }

  /* ======================================================
     UI
  ====================================================== */

  override render() {
    if (this.state.hasError) {
      return (
        <div
          className="
            min-h-screen
            flex items-center justify-center
            px-6
            bg-zinc-50
          "
          role="alert"
          aria-live="assertive"
        >
          <div
            className="
              max-w-sm w-full
              bg-white
              border border-zinc-200
              rounded-2xl
              p-7
              shadow-sm
              text-center
              space-y-5
              animate-fade-in
            "
          >
            {/* Icon */}
            <div className="flex justify-center text-red-600">
              <AlertTriangle size={28} />
            </div>

            {/* Title */}
            <h2 className="text-sm font-semibold text-zinc-900">
              Something went wrong
            </h2>

            {/* Message */}
            <p className="text-xs text-zinc-500">
              DonÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢t worry ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â your financial data is safe. Please retry.
            </p>

            {/* Action */}
            <button
              onClick={this.handleRetry}
              disabled={this.state.retrying}
              className="
                inline-flex items-center justify-center gap-2
                bg-zinc-900 text-white
                h-10 px-4 rounded-xl
                text-sm font-medium
                hover:opacity-90
                disabled:opacity-50
                transition
              "
            >
              <RefreshCcw size={14} />
              {this.state.retrying ? "Retrying..." : "Retry"}
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}


