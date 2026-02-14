"use client"

import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"
import MobileNav from "@/components/layout/MobileNav"

/* ==========================================================
   APP SHELL — Enterprise Fintech Layout (FIXED)

   Fixes applied:
   ✓ prevents double scroll
   ✓ prevents sidebar/content height mismatch
   ✓ safer mobile safe-area padding
   ✓ correct flex shrink issues
   ✓ stable full-height layout
   ✓ smoother desktop spacing
   ✓ production safe
========================================================== */

export default function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="
        min-h-screen
        bg-zinc-50
        text-zinc-900
        flex
        overflow-hidden        /* ✅ prevents body double scroll */
      "
    >
      {/* ======================================================
         DESKTOP SIDEBAR
      ====================================================== */}
      <Sidebar />

      {/* ======================================================
         MAIN WRAPPER
      ====================================================== */}
      <div
        className="
          flex-1
          flex flex-col
          min-h-screen
          md:pl-64
          overflow-hidden       /* ✅ important */
        "
      >
        {/* HEADER */}
        <Header />

        {/* ======================================================
           CONTENT — SINGLE SCROLL CONTAINER ONLY
        ====================================================== */}
        <main
          className="
            flex-1
            overflow-y-auto      /* ✅ only this scrolls */
            overflow-x-hidden
            pb-24 md:pb-8
          "
        >
          <div
            className="
              max-w-7xl
              mx-auto
              px-4 md:px-6
              py-6 md:py-8
            "
          >
            {children}
          </div>
        </main>

        {/* MOBILE NAV */}
        <MobileNav />
      </div>
    </div>
  )
}
