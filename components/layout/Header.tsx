ï»¿"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ShieldCheck,
  Plus,
  LifeBuoy,
  Cloud,
  Crown,
} from "lucide-react"

import NotificationBell from "@/components/layout/NotificationBell"

/* ==========================================================
   ROUTE TITLES ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â deterministic
========================================================== */

const titles: Record<string, string> = {
  "/app/dashboard": "Dashboard",
  "/app/income": "Income",
  "/app/expense": "Expenses",
  "/app/gst": "GST",
  "/app/tax": "Tax",
  "/app/vault": "Vault",
  "/app/insights": "Insights",
  "/app/filing": "Filing",
  "/app/settings": "Settings",
}

/* ==========================================================
   HEADER ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â FINAL HARDENED

   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â real NotificationBell wired
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â prefix-safe route matching
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â consistent heights
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â mobile safe
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â enterprise clean
========================================================== */

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const title =
    Object.entries(titles).find(([k]) =>
      pathname?.startsWith(k)
    )?.[1] || "Dashboard"

  const syncTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <>
      {/* ======================================================
         HEADER BAR
      ====================================================== */}
      <header
        className="
          sticky top-0 z-40
          h-14
          bg-white/95
          backdrop-blur-sm
          border-b border-zinc-200
        "
      >
        <div
          className="
            max-w-7xl mx-auto
            px-4 md:px-6
            h-full
            flex items-center justify-between
          "
        >
          {/* ================= LEFT ================= */}
          <div className="flex items-center gap-4 min-w-0">
            <h1 className="text-sm md:text-base font-semibold truncate">
              {title}
            </h1>

            <span className="hidden lg:flex items-center gap-1 text-xs text-zinc-500">
              <Cloud size={12} />
              Synced {syncTime}
            </span>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex items-center gap-2">

            {/* trust */}
            <div className="hidden md:flex items-center gap-1 text-xs text-green-600 font-medium">
              <ShieldCheck size={14} />
              Encrypted
            </div>

            {/* plan badge */}
            <span className="hidden md:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700">
              <Crown size={12} />
              Pro
            </span>

            {/* quick add */}
            <Link
              href="/app/income/add"
              className="
                h-9 px-3
                flex items-center gap-1.5
                rounded-xl
                bg-zinc-900 text-white
                text-xs font-medium
                active:scale-95 transition
              "
            >
              <Plus size={14} />
              Add
            </Link>

            {/* ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ REAL NOTIFICATION BELL */}
            <NotificationBell />

            {/* avatar */}
            <button
              onClick={() => router.push("/app/settings")}
              className="
                h-9 w-9
                rounded-full
                bg-zinc-200
                flex items-center justify-center
                text-xs font-medium
              "
            >
              U
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================
         SUPPORT FAB
      ====================================================== */}
      <a
        href="mailto:support@hisabdesk.com"
        className="
          fixed bottom-24 right-4 md:right-8
          w-11 h-11
          rounded-full
          bg-zinc-900 text-white
          flex items-center justify-center
          shadow-lg
          active:scale-95 transition
          z-50
        "
      >
        <LifeBuoy size={18} />
      </a>
    </>
  )
}
