"use client"

// ==========================================================
// HisabDesk — AI Assistant Provider (Global Mount)
// ----------------------------------------------------------
// PURPOSE
//   Single global mount point for AI assistant system
//
//   Why this exists:
//     ✓ keeps layout clean
//     ✓ future place for shared AI state
//     ✓ enables:
//         - history
//         - streaming
//         - caching
//         - page context injection
//
//   Wrap once in root layout:
//
//     <AIAssistantProvider>
//        {children}
//     </AIAssistantProvider>
//
//   Today:
//     just renders FAB
//
//   Tomorrow:
//     becomes full AI runtime layer
//
// ==========================================================

import { ReactNode } from "react"
import AIAssistantFAB from "./AIAssistantFAB"

// ==========================================================
// TYPES
// ==========================================================

interface Props {
  children: ReactNode
}

// ==========================================================
// PROVIDER
// ==========================================================

export default function AIAssistantProvider({
  children,
}: Props) {
  return (
    <>
      {children}

      {/* Global AI assistant */}
      <AIAssistantFAB />
    </>
  )
}
