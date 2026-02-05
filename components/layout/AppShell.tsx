"use client"

import Sidebar from "@/components/Sidebar"
import Header from "./Header"
import MobileNav from "./MobileNav"

/* ========================================
   APP SHELL (layout only)
   - Sidebar
   - Header
   - Content
   - Mobile nav
======================================== */

export default function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-zinc-50">

      {/* ===== Desktop Sidebar ===== */}
      <Sidebar />

      {/* ===== Right Side ===== */}
      <div className="flex-1 flex flex-col">

        {/* Sticky Header */}
        <Header />

        {/* Main Content Area */}
        <main
          className="
            flex-1
            overflow-y-auto
            p-4 md:p-8
            pb-24 md:pb-8
            max-w-7xl w-full mx-auto
          "
        >
          {children}
        </main>
      </div>

      {/* ===== Mobile Bottom Nav ===== */}
      <MobileNav />
    </div>
  )
}
