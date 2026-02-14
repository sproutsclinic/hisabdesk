// ==========================================================
// HisabDesk — Vault Layout
// ----------------------------------------------------------
// PURPOSE
//   Layout wrapper for Vault module
//
//   Responsibilities:
//     ✓ consistent container spacing
//     ✓ mount global AI assistant
//     ✓ keep page clean
//
//   Why:
//     ✓ same pattern as dashboard layout
//     ✓ modular architecture
//     ✓ future: filters / AI doc scan / bulk tools
//
//   RULES
//     ✓ layout only
//     ✓ no fetching
//     ✓ no business logic
//
// ==========================================================

import { ReactNode } from "react"
import { AIAssistantFAB } from "@/components/ai"

// ==========================================================
// TYPES
// ==========================================================

interface Props {
  children: ReactNode
}

// ==========================================================
// LAYOUT
// ==========================================================

export default function VaultLayout({ children }: Props) {
  return (
    <div className="relative">

      {/* -------------------------------------------------- */}
      {/* Container */}
      {/* -------------------------------------------------- */}

      <section
        className="
          max-w-5xl
          mx-auto
          px-4
          py-6
        "
      >
        {children}
      </section>

      {/* -------------------------------------------------- */}
      {/* Global AI always available */}
      {/* -------------------------------------------------- */}

      <AIAssistantFAB />

    </div>
  )
}
