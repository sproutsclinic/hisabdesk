"use client"

// ==========================================================
// HisabDesk — AI Assistant Tips
// ----------------------------------------------------------
// PURPOSE
//   Small suggestion chips for quick AI questions
//
//   Why:
//     ✓ improves engagement
//     ✓ helps non-technical users
//     ✓ reduces typing
//     ✓ increases AI usage quality
//
//   Can be used inside:
//     ✓ FAB panel
//     ✓ Drawer
//     ✓ Dashboard assistant
//
//   Pure UI helper (no API calls)
//
// ==========================================================

import React from "react"

// ==========================================================
// TYPES
// ==========================================================

interface Props {
  onSelect: (text: string) => void
  variant?: "default" | "compact"
}

// ==========================================================
// DEFAULT SUGGESTIONS (finance-focused only)
// ==========================================================

const SUGGESTIONS = [
  "How can I reduce my monthly expenses?",
  "Am I saving enough money?",
  "How to optimize my tax?",
  "Where am I overspending?",
  "How much should I invest monthly?",
  "Show ways to improve savings rate",
]

// ==========================================================
// COMPONENT
// ==========================================================

export default function AIAssistantTips({
  onSelect,
  variant = "default",
}: Props) {
  return (
    <div
      className={
        variant === "compact"
          ? "flex flex-wrap gap-1"
          : "flex flex-wrap gap-2"
      }
    >
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className={`
            text-xs
            px-3 py-1
            rounded-full
            border
            bg-muted
            hover:bg-muted/80
            transition
          `}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
