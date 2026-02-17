ï»¿"use client"

// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â useAIHotkeys
// ----------------------------------------------------------
// PURPOSE
//   Global keyboard shortcuts for AI assistant
//
//   Improves UX:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ open assistant instantly
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ power-user friendly
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ faster than mouse
//
//   Default shortcuts:
//     Cmd/Ctrl + K  ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ toggle assistant
//     Esc           ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ close assistant
//
//   Usage:
//
//     const { isOpen, toggle, close } = useAIHotkeys()
//
//   Then wire:
//     <AIAssistantDrawer open={isOpen} onClose={close} />
//
//   Pure client hook (no API)
// ==========================================================

import { useEffect, useState, useCallback } from "react"

// ==========================================================
// HOOK
// ==========================================================

export function useAIHotkeys() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = useCallback(() => {
    setIsOpen((v) => !v)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  // --------------------------------------------------------
  // LISTENERS
  // --------------------------------------------------------

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isCmdK =
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "k"

      const isEsc = e.key === "Escape"

      // Cmd/Ctrl + K
      if (isCmdK) {
        e.preventDefault()
        toggle()
      }

      // ESC
      if (isEsc) {
        close()
      }
    }

    window.addEventListener("keydown", onKey)

    return () =>
      window.removeEventListener("keydown", onKey)
  }, [toggle, close])

  // --------------------------------------------------------
  // RETURN
  // --------------------------------------------------------

  return {
    isOpen,
    toggle,
    close,
  }
}
