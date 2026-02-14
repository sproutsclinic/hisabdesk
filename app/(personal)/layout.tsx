"use client"

// ==========================================================
// HisabDesk — Personal Module Layout (FINAL POLISHED)
// ==========================================================

import { ReactNode } from "react"

/* ✅ ADDED */
import React from "react"

import AIAssistantProvider from "@/components/ai/AIAssistantProvider"

import Sidebar from "./components/Sidebar"
import TopNavbar from "./components/TopNavbar"
import PageContainer from "./components/PageContainer"

// ==========================================================
// LAYOUT
// ==========================================================

export default function PersonalLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <AIAssistantProvider>
      <div
        className="
          flex
          min-h-screen
          bg-gray-50

          /* ✅ ADDED — smoother feel */
          antialiased

          /* ✅ ADDED — subtle app depth */
          bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100/40
        "
      >

        {/* =================================================
           SIDEBAR
        ================================================= */}

        {/* ✅ ADDED — visual separation shadow */}
        <div className="shadow-sm z-20">
          <Sidebar />
        </div>

        {/* =================================================
           RIGHT SIDE
        ================================================= */}

        <div
          className="
            flex-1
            flex
            flex-col

            /* ✅ ADDED — prevents horizontal jitter */
            min-w-0
          "
        >

          {/* Sticky Navbar */}
          <div
            className="
              sticky
              top-0
              z-30
              bg-white
              border-b

              /* ✅ ADDED — glass style polish */
              backdrop-blur
              bg-white/95
            "
          >
            <TopNavbar />
          </div>

          {/* Scrollable Content */}
          <div
            className="
              flex-1
              overflow-y-auto

              /* ✅ ADDED — smooth scroll */
              scroll-smooth

              /* ✅ ADDED — subtle inner padding feel */
              transition-all duration-150
            "
          >
            <PageContainer>
              {children}
            </PageContainer>
          </div>

        </div>
      </div>
    </AIAssistantProvider>
  )
}