"use client"

import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="w-64 h-screen bg-black text-white flex flex-col p-5">
      <h2 className="text-xl font-bold mb-10">HisabDesk</h2>

      <nav className="flex flex-col gap-4 flex-1">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/customers">Customers</Link>
        <Link href="/invoices">Invoices</Link>
        <Link href="/expenses">Expenses</Link>
        <Link href="/reports">Reports</Link>
      </nav>

      <button
        onClick={logout}
        className="bg-red-600 p-2 rounded mt-6"
      >
        Logout
      </button>
    </div>
  )
}
