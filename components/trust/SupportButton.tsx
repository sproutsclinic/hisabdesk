ï»¿"use client"

import { LifeBuoy } from "lucide-react"

export default function SupportButton() {
  return (
    <a
      href="mailto:support@hisabdesk.com"
      className="
        fixed bottom-24 right-4 md:right-8
        bg-black text-white
        w-11 h-11 rounded-full
        flex items-center justify-center
        shadow-lg
        hover:scale-105 transition
        z-50
      "
    >
      <LifeBuoy size={18} />
    </a>
  )
}
