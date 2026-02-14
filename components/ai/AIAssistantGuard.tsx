"use client"

// ==========================================================
// HisabDesk — AI Assistant Guard
// ----------------------------------------------------------
// PURPOSE
//   Central safety wrapper for AI UI components
//
//   Prevents:
//     ✓ showing AI when monthly limit reached
//     ✓ unnecessary API calls
//     ✓ bad UX when AI disabled
//
//   Uses:
//     useAIReady()  → /api/ai/health
//
//   Usage:
//
//     <AIAssistantGuard>
//        <AIAssistantInline />
//     </AIAssistantGuard>
//
//   If not ready:
//     shows disabled state instead of children
//
//   Pure UI guard (no OpenAI)
// ==========================================================

import { ReactNode } from "react"
import { useAIReady } from "@/lib/hooks/useAIReady"

// ==========================================================
// TYPES
// ==========================================================

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function AIAssistantGuard({
  children,
  fallback,
}: Props) {
  const { ready, remaining, loading } = useAIReady()

  // loading → render nothing (avoid flicker)
  if (loading) return null

  // AI allowed
  if (ready) return <>{children}</>

  // --------------------------------------------------------
  // Fallback UI
  // --------------------------------------------------------

  if (fallback) return <>{fallback}</>

  return (
    <div
      className="
        text-xs
        px-3 py-2
        border rounded
        bg-muted text-muted-foreground
      "
    >
      AI monthly limit reached. Available next month.
      Remaining: ${remaining}
    </div>
  )
}
