"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"

export default function Dashboard() {
  const router = useRouter()
  const [email, setEmail] = useState("")

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/login")
      } else {
        setEmail(data.user.email || "")
      }
    }

    checkUser()
  }, [router])

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome {email}</p>

        {/* ✅ Income Buttons (MOVED INSIDE) */}
        <div className="flex gap-4 mt-6">
          <a
            href="/income/add"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Income
          </a>

          <a
            href="/income/list"
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            View Income
          </a>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-6 rounded shadow">Total Sales</div>
          <div className="bg-white p-6 rounded shadow">Expenses</div>
          <div className="bg-white p-6 rounded shadow">Profit</div>
        </div>
      </main>
    </div>
  )
}
<a href="/expense/add" className="bg-red-500 text-white px-4 py-2 mr-2">Add Expense</a>
<a href="/expense/list" className="bg-gray-600 text-white px-4 py-2">View Expenses</a>
