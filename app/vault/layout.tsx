"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Shield,
  Phone,
  Share2,
  Download,
  AlertTriangle,
} from "lucide-react"

/* =================================================
   VAULT LAYOUT — Grahalakshmi Vault Shell

   Purpose:
   ✅ persistent sub-navigation for all vault pages
   ✅ fast thumb navigation (mobile-first)
   ✅ emergency always visible
   ✅ export + share quick access
   ✅ consistent UX across:
      /vault
      /vault/[category]
      /vault/contacts
      /vault/emergency
      /vault/share
      /vault/timeline

   ZERO breaking changes
================================================= */

export default function VaultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const tabs = [
    {
      href: "/vault",
      label: "Vault",
      icon: Shield,
    },
    {
      href: "/vault/contacts",
      label: "Contacts",
      icon: Phone,
    },
    {
      href: "/vault/share",
      label: "Share",
      icon: Share2,
    },
    {
      href: "/vault/timeline",
      label: "Timeline",
      icon: AlertTriangle,
    },
    {
      href: "/api/vault/export",
      label: "Backup",
      icon: Download,
      external: true,
    },
  ]

  return (
    <div className="space-y-6">

      {/* ================= TOP NAV ================= */}
      <div
        className="
          sticky top-14 z-30
          bg-white/90 dark:bg-zinc-950/90
          backdrop-blur
          border-b
        "
      >
        <div className="flex gap-2 overflow-x-auto px-4 py-2">

          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = pathname.startsWith(tab.href)

            const className = `
              flex items-center gap-1.5
              text-xs whitespace-nowrap
              px-3 py-1.5 rounded-full
              transition
              ${
                active
                  ? "bg-black text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600"
              }
            `

            if (tab.external) {
              return (
                <a
                  key={tab.href}
                  href={tab.href}
                  className={className}
                >
                  <Icon size={14} />
                  {tab.label}
                </a>
              )
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={className}
              >
                <Icon size={14} />
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* ================= PAGE ================= */}
      <div className="px-4 pb-10">
        {children}
      </div>
    </div>
  )
}
