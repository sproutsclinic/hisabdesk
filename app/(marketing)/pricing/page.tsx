// app/(marketing)/pricing/page.tsx

import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">

      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>

        <p className="mt-4 text-slate-600">
          Choose the plan that matches how you manage your finances.
        </p>

        {/* ✅ ADDED clarity */}
        <p className="mt-3 text-sm text-slate-500">
          Select a plan → Complete payment → Get instant access to HisabDesk
        </p>
      </div>



      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">

        {/* PERSONAL */}
        <div className="border rounded-2xl p-8 bg-white">
          <h3 className="text-xl font-semibold">Personal</h3>
          <p className="text-slate-600 mt-2">For individuals & taxpayers</p>

          <div className="mt-6 text-3xl font-bold">
            ₹199 <span className="text-sm font-normal text-slate-500">/ month</span>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            <li>• Income & expense tracking</li>
            <li>• Budget management</li>
            <li>• Tax calculator</li>
            <li>• Document vault</li>
            <li>• Insights dashboard</li>
          </ul>

          <Link
            href="/api/razorpay?plan=personal"
            className="block text-center mt-8 bg-black text-white py-3 rounded-xl"
          >
            Subscribe Personal
          </Link>
        </div>



        {/* BUSINESS */}
        <div className="border-2 border-black rounded-2xl p-8 bg-white shadow-sm">
          <h3 className="text-xl font-semibold">Business</h3>
          <p className="text-slate-600 mt-2">For GST owners & professionals</p>

          <div className="mt-6 text-3xl font-bold">
            ₹499 <span className="text-sm font-normal text-slate-500">/ month</span>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            <li>• Invoices & billing</li>
            <li>• GST reconciliation</li>
            <li>• Reports & P&L</li>
            <li>• CA exports</li>
            <li>• Business dashboard</li>
          </ul>

          <Link
            href="/api/razorpay?plan=business"
            className="block text-center mt-8 bg-black text-white py-3 rounded-xl"
          >
            Subscribe Business
          </Link>
        </div>



        {/* CA */}
        <div className="border rounded-2xl p-8 bg-white">
          <h3 className="text-xl font-semibold">CA Workstation</h3>
          <p className="text-slate-600 mt-2">For firms & professionals</p>

          <div className="mt-6 text-3xl font-bold">
            ₹1499 <span className="text-sm font-normal text-slate-500">/ month</span>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            <li>• Multi-client workspace</li>
            <li>• Bulk GST sync</li>
            <li>• Batch exports</li>
            <li>• Admin tools</li>
            <li>• Priority support</li>
          </ul>

          <Link
            href="/api/razorpay?plan=ca"
            className="block text-center mt-8 bg-black text-white py-3 rounded-xl"
          >
            Subscribe CA Plan
          </Link>
        </div>

      </div>



      {/* Bottom CTA */}
      <div className="text-center mt-20">

        {/* ✅ ADDED trust line */}
        <p className="text-sm text-slate-500">
          Secure payments powered by Razorpay • Instant activation • Cancel anytime
        </p>

        <Link
          href="/api/razorpay?plan=personal"
          className="inline-block mt-6 bg-black text-white px-8 py-3 rounded-xl"
        >
          Get Started
        </Link>
      </div>

    </div>
  )
}
