"use client"

/**
 * =========================================================
 * PWA Install Prompt (FINAL – Enterprise UX)
 * HisabDesk – Phase D Mobile
 * =========================================================
 *
 * Features:
 * ✓ detects install eligibility
 * ✓ custom branded install button
 * ✓ hides after install
 * ✓ hides on iOS (not supported)
 * ✓ remembers dismissal
 * ✓ production safe
 *
 * Drop-in replacement
 * =========================================================
 */

import { useEffect, useState } from "react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "hisabdesk-install-dismissed"

export default function InstallPrompt() {
  const [deferred, setDeferred] =
    useState<BeforeInstallPromptEvent | null>(null)

  const [visible, setVisible] = useState(false)

  /* ======================================================
     HELPERS
  ====================================================== */

  const isIOS =
    typeof window !== "undefined" &&
    /iphone|ipad|ipod/i.test(navigator.userAgent)

  const isStandalone =
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches

  /* ======================================================
     DETECT INSTALL ELIGIBLE
  ====================================================== */

  useEffect(() => {
    if (isIOS || isStandalone) return
    if (localStorage.getItem(DISMISS_KEY)) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    window.addEventListener("appinstalled", () => {
      setVisible(false)
      setDeferred(null)
    })

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      )
  }, [])

  /* ======================================================
     INSTALL ACTION
  ====================================================== */

  async function install() {
    if (!deferred) return

    await deferred.prompt()

    const choice = await deferred.userChoice

    if (choice.outcome === "accepted") {
      setVisible(false)
      setDeferred(null)
    }
  }

  /* ======================================================
     DISMISS (remember)
  ====================================================== */

  function dismiss() {
    setVisible(false)
    localStorage.setItem(DISMISS_KEY, "1")
  }

  /* ======================================================
     UI
  ====================================================== */

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
      <div className="bg-black text-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-4 max-w-sm w-[95%]">
        <div className="flex-1">
          <p className="text-sm font-medium">
            Install HisabDesk
          </p>
          <p className="text-xs opacity-80">
            Faster. Works offline. Like an app.
          </p>
        </div>

        <button
          onClick={install}
          className="bg-white text-black text-sm px-4 py-2 rounded-lg font-medium"
        >
          Install
        </button>

        <button
          onClick={dismiss}
          className="text-xs opacity-70"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
