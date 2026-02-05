"use client"

import Sidebar from "@/components/Sidebar"
import Header from "./Header"
import MobileNav from "./MobileNav"

/* ========================================
   APP SHELL — Fintech Grade Layout

   Adds:
   ✅ sticky header safe area
   ✅ centered container system
   ✅ mobile thumb spacing
   ✅ smoother scrolling
   ✅ better desktop proportions
   ✅ zero breaking changes
======================================== */

export default function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="
        min-h-screen
        flex
        bg-zinc-50
        dark:bg-zinc-950
        text-zinc-900
        dark:text-zinc-100
      "
    >
      {/* ===== Desktop Sidebar ===== */}
      <Sidebar />

      {/* ===== Right Side ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header />

        {/* ===== Main Content Area ===== */}
        <main
          className="
            flex-1
            overflow-y-auto
            scroll-smooth

            px-4
            sm:px-6
            lg:px-10

            pt-6
            pb-28 md:pb-10

            w-full
            max-w-6xl
            mx-auto
          "
        >
          <div className="space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* ===== Mobile Bottom Nav ===== */}
      <MobileNav />
    </div>
  )
}
