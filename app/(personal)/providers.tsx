"use client"

// ==========================================================
// HisabDesk — Personal Providers (Global Runtime Layer)
// ----------------------------------------------------------
// PURPOSE
//   Central place to mount ALL global client providers
//
//   Why:
//     ✓ prevents layout clutter
//     ✓ clean architecture
//     ✓ future-ready (theme, analytics, AI, etc)
//
//   Instead of putting many things in layout.tsx,
//   we mount everything here.
//
//   Today:
//     ✓ AIAssistantGlobal
//
//   Future:
//     ✓ ThemeProvider
//     ✓ QueryClientProvider
//     ✓ Feature flags
//     ✓ Analytics
//
//   Usage:
//
//     layout.tsx
//       <Providers>{children}</Providers>
//
// ==========================================================

import { ReactNode } from "react"
import { AIAssistantGlobal } from "@/components/ai"

// ==========================================================
// COMPONENT
// ==========================================================

export default function Providers({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      {children}

      {/* Global AI system mount */}
      <AIAssistantGlobal />
    </>
  )
}
