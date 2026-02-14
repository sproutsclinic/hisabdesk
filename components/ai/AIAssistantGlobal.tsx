"use client"

// ==========================================================
// HisabDesk — AI Assistant Global Mount
// ----------------------------------------------------------
// PURPOSE
//   Single place to mount ALL AI UI globally
//
//   Why:
//     ✓ avoid scattering AI components across layout
//     ✓ one clean import
//     ✓ future-proof
//
//   Mounts:
//     ✓ Floating FAB (quick ask)
//     ✓ Command Palette (Cmd/Ctrl + K)
//     ✓ future global AI tools
//
//   Usage (ONLY ONCE):
//
//     app/(personal)/layout.tsx
//       <AIAssistantGlobal />
//
//   After this:
//     AI is available everywhere automatically
//
// ==========================================================

import AIAssistantFAB from "./AIAssistantFAB"
import AIAssistantCommandPalette from "./AIAssistantCommandPalette"

// ==========================================================
// COMPONENT
// ==========================================================

export default function AIAssistantGlobal() {
  return (
    <>
      {/* Quick floating assistant */}
      <AIAssistantFAB />

      {/* Power-user command palette */}
      <AIAssistantCommandPalette />
    </>
  )
}
