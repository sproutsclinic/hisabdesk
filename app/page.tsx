import Link from "next/link"
import Testimonials from "@/components/Testimonials"

import {
  IndianRupee,
  FileText,
  Brain,
  BarChart3,
  ShieldCheck,
  Upload
} from "lucide-react"

export const metadata = {
  title: "Income Tax Calculator & Filing App for India",
  description:
    "Free income tax calculator with AI tax advisor. Designed for freelancers, doctors and small businesses in India."
}

export default function Page() {
  return (
    <main className="bg-gray-50 text-gray-900 min-h-screen">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur border-b z-50">
        <div className="container-app flex items-center justify-between py-4">
          <h1 className="text-xl font-bold">HisabDesk</h1>

          <div className="flex gap-3">
            <Link href="/login" className="btn-outline">Login</Link>
            <Link href="/login" className="btn">Get Started</Link>
          </div>
        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section className="section text-center">
        <div className="container-app max-w-4xl">

          <h2 className="heading-xl mb-6">
            File Your Taxes in Minutes.
            <br />
            <span className="text-gray-500">No CA Required.</span>
          </h2>

          <p className="muted text-lg mb-10">
            Track income, import bank statements, calculate tax,
            and generate reports automatically — all in one dashboard.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login" className="btn text-lg">
              Start Free
            </Link>

            <Link href="/billing" className="btn-outline text-lg">
              View Pricing
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Trusted by freelancers, doctors & consultants across India
          </p>
        </div>
      </section>


      {/* ================= PROBLEMS ================= */}
      <section className="section bg-white text-center">
        <div className="container-app">

          <h2 className="heading-lg mb-10">
            Managing money shouldn’t be this hard
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto text-gray-700">
            <Problem>Manual Excel tracking</Problem>
            <Problem>Confusing tax regimes</Problem>
            <Problem>CA dependency for basics</Problem>
            <Problem>No instant reports</Problem>
          </div>

        </div>
      </section>


      {/* ================= FEATURES ================= */}
      <section className="section">
        <div className="container-app">

          <h2 className="heading-lg text-center mb-14">
            Everything you need in one place
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature icon={<BarChart3 size={18} />} title="Income & Expense Tracking">
              Smart dashboard with totals & profit insights
            </Feature>

            <Feature icon={<IndianRupee size={18} />} title="Auto Tax Comparison">
              Old vs New regime + 44ADA instantly
            </Feature>

            <Feature icon={<Brain size={18} />} title="AI Tax Advisor">
              Suggestions to legally reduce tax
            </Feature>

            <Feature icon={<Upload size={18} />} title="Bank Statement Import">
              Upload PDF → auto detect transactions
            </Feature>

            <Feature icon={<FileText size={18} />} title="PDF Reports">
              Professional tax reports in one click
            </Feature>

            <Feature icon={<ShieldCheck size={18} />} title="Secure & Private">
              Encrypted cloud storage with Supabase auth
            </Feature>
          </div>

        </div>
      </section>


      {/* ================= TESTIMONIALS ================= */}
      <Testimonials />


      {/* ================= PRICING ================= */}
      <section className="section bg-white text-center">
        <div className="container-app">

          <h2 className="heading-lg mb-12">Simple pricing</h2>

          <div className="flex flex-col md:flex-row justify-center gap-8">

            <div className="card w-full md:w-80">
              <h3 className="font-semibold">Free</h3>
              <p className="text-3xl my-4 font-bold">₹0</p>
              <p className="muted">Income & expense tracking</p>
            </div>

            <div className="card w-full md:w-80 border-2 border-black scale-105">
              <h3 className="font-semibold">Pro</h3>
              <p className="text-3xl my-4 font-bold">₹499 / month</p>
              <p className="muted">Tax engine + reports + AI advisor</p>
            </div>

          </div>

        </div>
      </section>


      {/* ================= FINAL CTA ================= */}
      <section className="section text-center">
        <div className="container-app">
          <h2 className="heading-lg mb-6">
            Stop wasting time on spreadsheets
          </h2>

          <Link href="/login" className="btn text-lg px-8">
            Create Free Account →
          </Link>
        </div>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} HisabDesk • Made for Indian taxpayers
      </footer>
    </main>
  )
}


/* ================= COMPONENTS ================= */

function Feature({
  icon,
  title,
  children
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="card text-left">
      <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-xl mb-4">
        {icon}
      </div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  )
}

function Problem({ children }: { children: React.ReactNode }) {
  return (
    <div className="card text-sm text-gray-700">
      ❌ {children}
    </div>
  )
}
