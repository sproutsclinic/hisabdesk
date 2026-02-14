// ==========================================================
// HisabDesk — Personal Server Layout (Guard Layer)
// Location: app/personal/layout.server.tsx
//
// PURPOSE
// Server-side security + onboarding enforcement
//
// FLOW
// request
//   → requireOnboarding()
//        → requireUser()
//        → ensureProfile()
//        → redirect if needed
//   → render client layout
//
// RULES
// ✅ server only
// ✅ guards only
// ❌ no UI logic
// ❌ no calculations
// ❌ no business logic
// ==========================================================

import { ReactNode } from "react"

import { requireOnboarding } from "@/lib/security/requireOnboarding"
import PersonalLayoutClient from "./layout"

/* =========================================================
Layout (Server Component)
========================================================= */

export default async function PersonalServerLayout({
  children,
}: {
  children: ReactNode
}) {
  // Single guard handles:
  // auth + bootstrap + onboarding
  await requireOnboarding()

  return <PersonalLayoutClient>{children}</PersonalLayoutClient>
}
