ï»¿"use client"

import { ShieldCheck } from "lucide-react"

export default function SecurityBadge() {
  return (
    <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
      <ShieldCheck size={14} />
      Encrypted
    </div>
  )
}
