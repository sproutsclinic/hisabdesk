"use client"

import { supabase } from "@/lib/supabase"
import { useEffect } from "react"


import { useState } from "react"

export default function DeductionsPage() {

  const [form, setForm] = useState({
    lic: 0,
    ppf: 0,
    elss: 0,
    epf: 0,
    tuition: 0,
    homePrincipal: 0,

    healthSelf: 0,
    healthParents: 0,

    hra: 0,
    homeInterest: 0,

    nps: 0,
    educationLoan: 0,
    donations: 0,
    savingsInterest: 0
  })

  const update = (key: string, value: number) => {
    setForm({ ...form, [key]: value })
  }

  // ======================
  // CALCULATIONS
  // ======================

  const eightyC =
    form.lic +
    form.ppf +
    form.elss +
    form.epf +
    form.tuition +
    form.homePrincipal

  const capped80C = Math.min(eightyC, 150000)

  const eightyD = form.healthSelf + form.healthParents

  const total =
    capped80C +
    eightyD +
    form.hra +
    form.homeInterest +
    form.nps +
    form.educationLoan +
    form.donations +
    form.savingsInterest

    // SAVE TO DATABASE
useEffect(() => {
  const save = async () => {
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) return

    await supabase
      .from("deductions")
      .upsert({
        user_id: user.id,
        total
      })
  }

  save()
}, [total])

  // ======================
  // UI
  // ======================

  return (
    <div className="p-10 space-y-8">

      <h1 className="text-2xl font-bold">Tax Deductions</h1>

      {/* 80C */}
      <section className="bg-white p-6 rounded shadow space-y-3">
        <h2 className="font-bold text-lg">80C (Max ₹1,50,000)</h2>

        {[
          ["LIC Premium", "lic"],
          ["PPF", "ppf"],
          ["ELSS Mutual Funds", "elss"],
          ["EPF Contribution", "epf"],
          ["Tuition Fees", "tuition"],
          ["Home Loan Principal", "homePrincipal"]
        ].map(([label, key]) => (
          <input
            key={key}
            type="number"
            placeholder={label}
            className="border p-2 w-full"
            onChange={(e) => update(key, Number(e.target.value))}
          />
        ))}

        <p className="font-semibold">
          Total 80C (capped): ₹ {capped80C}
        </p>
      </section>

      {/* 80D */}
      <section className="bg-white p-6 rounded shadow space-y-3">
        <h2 className="font-bold text-lg">80D – Health Insurance</h2>

        <input
          type="number"
          placeholder="Self / Family Insurance"
          className="border p-2 w-full"
          onChange={(e) => update("healthSelf", Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Parents Insurance"
          className="border p-2 w-full"
          onChange={(e) => update("healthParents", Number(e.target.value))}
        />
      </section>

      {/* Other */}
      <section className="bg-white p-6 rounded shadow space-y-3">
        <h2 className="font-bold text-lg">Other Deductions</h2>

        {[
          ["HRA Exemption", "hra"],
          ["Home Loan Interest (Section 24)", "homeInterest"],
          ["NPS 80CCD(1B)", "nps"],
          ["Education Loan Interest 80E", "educationLoan"],
          ["Donations 80G", "donations"],
          ["Savings Interest 80TTA/TTB", "savingsInterest"]
        ].map(([label, key]) => (
          <input
            key={key}
            type="number"
            placeholder={label}
            className="border p-2 w-full"
            onChange={(e) => update(key, Number(e.target.value))}
          />
        ))}
      </section>

      {/* TOTAL */}
      <section className="bg-green-100 p-6 rounded text-xl font-bold">
        ✅ Total Deductions: ₹ {total}
      </section>

    </div>
  )
}
