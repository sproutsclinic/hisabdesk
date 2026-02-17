ï»¿import { ReactNode } from "react"
import { getProfileOverview } from "@/lib/api/profile/service"
import { requireOnboarding } from "@/lib/security/requireOnboarding"
import PersonalLayoutClient from "./layout.client"

/* =========================================================
   Personal Area Server Layout
   ---------------------------------------------------------
   Responsibilities:
   ? Load user profile
   ? Enforce onboarding
   ? Provide clean shell for client layout
   ========================================================= */

type Props = {
  children: ReactNode
}

export default async function PersonalLayoutServer({ children }: Props) {
  // -------------------------------------------------------
  // In Phase H we operate with demo/system user until auth hardening
  // Replace later with real session user id.
  // -------------------------------------------------------
  const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000"

  // Fetch profile from service layer (DB allowed here)
  const { profile } = await getProfileOverview(DEMO_USER_ID)

  // Guard (pure function ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â no DB calls inside)
  requireOnboarding(profile)

  return <PersonalLayoutClient>{children}</PersonalLayoutClient>
}
