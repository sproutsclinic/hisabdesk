import Link from "next/link"
import {
  IndianRupee,
  FileText,
  Brain,
  BarChart3,
  ShieldCheck,
  Upload
} from "lucide-react"

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-5 border-b">
        <h1 className="text-2xl font-bold">HisabDesk</h1>

        <div className="flex gap-6 items-center text-sm font-medium">
          <Link href="/login">Login</Link>

          <Link
            href="/login"
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            Get Started
          </Link>
        </div>
      </nav>


      {/* HERO */}
      <section className="text-center py-28 px-6 max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold leading-tight mb-6">
          File Your Taxes in Minutes.
          <br />
          <span className="text-gray-500">No CA Required.</span>
        </h2>

        <p className="text-lg text-gray-600 mb-10">
          Track income, import bank statements, calculate tax,
          and generate reports automatically.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="bg-black text-white px-8 py-4 rounded-2xl font-semibold"
          >
            Start Free
          </Link>

          <Link
            href="/billing"
            className="border px-8 py-4 rounded-2xl font-semibold"
          >
            View Pricing
          </Link>
        </div>
      </section>


      {/* PROBLEMS */}
      <section className="py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-12">
          Managing money shouldn’t be this hard
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto text-lg text-gray-700">
          <div>❌ Manual Excel tracking</div>
          <div>❌ Confusing tax regimes</div>
          <div>❌ CA dependency for basics</div>
          <div>❌ No instant reports</div>
        </div>
      </section>


      {/* FEATURES */}
      <section className="py-24 px-6">
        <h2 className="text-3xl font-bold text-center mb-16">
          Everything you need in one place
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Feature icon={<BarChart3 />} title="Income & Expense Tracking">
            Smart dashboard with totals & profit insights
          </Feature>

          <Feature icon={<IndianRupee />} title="Auto Tax Comparison">
            Old vs New regime + 44ADA instantly
          </Feature>

          <Feature icon={<Brain />} title="AI Tax Advisor">
            Suggestions to legally reduce tax
          </Feature>

          <Feature icon={<Upload />} title="Bank Statement Import">
            Upload PDF → auto detect transactions
          </Feature>

          <Feature icon={<FileText />} title="PDF Reports">
            Professional tax reports in one click
          </Feature>

          <Feature icon={<ShieldCheck />} title="Secure & Private">
            Supabase auth + encrypted cloud storage
          </Feature>
        </div>
      </section>


      {/* PRICING */}
      <section className="py-24 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-14">
          Simple pricing
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-10">

          <div className="border p-8 rounded-2xl w-72 shadow-sm">
            <h3 className="text-xl font-bold">Free</h3>
            <p className="text-3xl my-4">₹0</p>
            <p className="text-gray-600">
              Income & expense tracking
            </p>
          </div>

          <div className="border-2 border-black p-8 rounded-2xl w-72 shadow-lg scale-105">
            <h3 className="text-xl font-bold">Pro</h3>
            <p className="text-3xl my-4">₹499 / month</p>
            <p className="text-gray-600">
              Tax engine + reports + AI advisor
            </p>
          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Stop wasting time on spreadsheets
        </h2>

        <Link
          href="/login"
          className="bg-black text-white px-10 py-4 rounded-2xl text-lg font-semibold"
        >
          Create Free Account →
        </Link>
      </section>


      {/* FOOTER */}
      <footer className="border-t text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} HisabDesk • Made for Indian taxpayers
      </footer>
    </main>
  )
}


/* ---------- Feature Card ---------- */

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
    <div className="p-6 border rounded-2xl hover:shadow-lg transition text-left">
      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl mb-4">
        {icon}
      </div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  )
}
