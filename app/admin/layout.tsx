"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

/* =================================================
   ADMIN LAYOUT — ENTERPRISE GUARD

   ✅ blocks non-admins early
   ✅ prevents flash of content
   ✅ loading state
   ✅ centered container system
   ✅ consistent spacing with app shell
   ✅ zero breaking changes
================================================= */

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data.user

      if (!user) {
        router.replace("/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

      if (!profile?.is_admin) {
        router.replace("/dashboard")
        return
      }

      setChecking(false)
    }

    check()
  }, [router])

  /* ===== prevent flash ===== */
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-zinc-500">
        Checking permissions...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* ✅ centered admin container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {children}
      </div>
    </div>
  )
}
