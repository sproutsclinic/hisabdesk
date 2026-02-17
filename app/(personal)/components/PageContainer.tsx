ï»¿"use client"

import React from "react"
import { useEffect } from "react"

export default function PageContainer({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100/60 min-h-screen scroll-smooth transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6 py-2 w-full px-1 sm:px-2 md:px-0">
        {children}
      </div>
    </main>
  )
}
