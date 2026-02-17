ï»¿"use client"

/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Org Context
   ---------------------------------------------------------
   PURPOSE
   Provide current organisation scope across app.

   ARCHITECTURE
   Layout ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ OrgProvider ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ any module needing orgId
   ========================================================= */

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react"

/* =========================================================
   TYPES
   ========================================================= */

type OrgContextValue = {
  orgId: string | null
  setOrgId: (id: string | null) => void
}

/* =========================================================
   CONTEXT
   ========================================================= */

const OrgContext = createContext<OrgContextValue | undefined>(
  undefined,
)

/* =========================================================
   PROVIDER
   ========================================================= */

export function OrgProvider({
  children,
}: {
  children: ReactNode
}) {
  const [orgId, setOrgId] = useState<string | null>(null)

  return (
    <OrgContext.Provider value={{ orgId, setOrgId }}>
      {children}
    </OrgContext.Provider>
  )
}

/* =========================================================
   HOOK (Safe Consumer)
   ========================================================= */

export function useOrg() {
  const ctx = useContext(OrgContext)

  if (!ctx) {
    throw new Error(
      "useOrg must be used inside <OrgProvider>",
    )
  }

  return ctx
}
