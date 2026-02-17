ï»¿"use client"

/**
 * =========================================================
 * PWA Install Prompt (FINAL ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Enterprise UX)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Phase D Mobile
 * =========================================================
 *
 * Features:
 * ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ detects install eligibility
 * ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ custom branded install button
 * ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ hides after install
 * ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ hides on iOS (not supported)
 * ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ remembers dismissal
 * ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ production safe
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
          ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢
        </button>
      </div>
    </div>
  )
}
