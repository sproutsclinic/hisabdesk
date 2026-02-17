ï»¿'use client'

import { ReactNode } from 'react'

/* =========================================================
   Personal Layout ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Client Shell
   ---------------------------------------------------------
   Client-only responsibilities:
   ? Context providers (future)
   ? UI state
   ? Event handlers
   ? No data fetching here
   ========================================================= */

type Props = {
  children: ReactNode
}

export default function PersonalLayoutClient({ children }: Props) {
  return (
    <>
      {children}
    </>
  )
}
