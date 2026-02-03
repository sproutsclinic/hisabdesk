"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()

  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)

  useEffect(() => {
    checkUser()
    loadData()
  }, [])

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) router.push("/login")
  }

  const loadData = async () => {
    const { data: incomes } = await supabase.from("incomes").select("amount")
    const { data: expenses } = await supabase.from("expenses").select("amount")

    const totalIncome =
      incomes?.reduce((sum, i) => sum + Number(i.amount), 0) || 0

    const totalExpense =
      expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0

    setIncome(totalIncome)
    setExpense(totalExpense)
  }

  const profit = income - expense

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-green-100 p-4 rounded">
          <p>Total Income</p>
          <h2 className="text-xl font-bold">₹ {income}</h2>
        </div>

        <div className="bg-red-100 p-4 rounded">
          <p>Total Expense</p>
          <h2 className="text-xl font-bold">₹ {expense}</h2>
        </div>

        <div className="bg-blue-100 p-4 rounded col-span-2">
          <p>Net Profit</p>
          <h2 className="text-xl font-bold">₹ {profit}</h2>
        </div>

      </div>

      <div className="space-x-3">
        <a href="/income/add" className="bg-green-600 text-white px-4 py-2">Add Income</a>
        <a href="/expense/add" className="bg-red-600 text-white px-4 py-2">Add Expense</a>
      </div>
    </div>
  )
}
