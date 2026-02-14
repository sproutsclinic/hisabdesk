"use client"

// ==========================================================
// HisabDesk — useAIHotkeys
// ----------------------------------------------------------
// PURPOSE
//   Global keyboard shortcuts for AI assistant
//
//   Improves UX:
//     ✓ open assistant instantly
//     ✓ power-user friendly
//     ✓ faster than mouse
//
//   Default shortcuts:
//     Cmd/Ctrl + K  → toggle assistant
//     Esc           → close assistant
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
