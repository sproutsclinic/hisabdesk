import Link from "next/link"
import EmailCapture from "@/components/EmailCapture"

export const metadata = {
  title: "Old vs New Tax Regime – Which is Better in 2026?",
  description:
    "Compare old vs new tax regime in India and find which saves more tax. Use our free calculator to instantly choose the best regime.",
  keywords: [
    "old vs new tax regime",
    "tax regime comparison india",
    "which tax regime is better",
    "income tax calculator india",
    "old vs new regime calculator"
  ]
}

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 leading-7">

      {/* TITLE */}
      <h1 className="text-3xl font-bold">
        Old vs New Tax Regime – Which One Should You Choose?
      </h1>

      <p className="text-gray-600">
        Choosing the wrong tax regime can cost you thousands of rupees every year.
        The best option depends on your income, deductions and expenses.
      </p>


      {/* INTRO */}
      <section className="space-y-4">
        <p>
          Many taxpayers randomly choose a regime without comparing both options.
          This leads to paying more tax than necessary.
        </p>

        <p>
          The smart approach is simple: calculate both and pick the lower tax.
        </p>
      </section>


      {/* OLD REGIME */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Old Tax Regime</h2>

        <p>Allows multiple deductions and exemptions:</p>

        <ul className="list-disc pl-6">
          <li>80C (PF, LIC, ELSS, etc.)</li>
          <li>HRA</li>
          <li>Home loan interest</li>
          <li>Medical insurance (80D)</li>
          <li>Education loan interest</li>
        </ul>

        <p>
          Best for people with many investments and deductions.
        </p>
      </section>


      {/* NEW REGIME */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">New Tax Regime</h2>

        <p>
          Offers lower tax slabs but removes most deductions.
        </p>

        <ul className="list-disc pl-6">
          <li>Simpler structure</li>
          <li>No need to track deductions</li>
          <li>Lower tax rates</li>
        </ul>

        <p>
          Best for people with fewer deductions or salaried individuals.
        </p>
      </section>


      {/* COMPARISON EXAMPLE */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Quick example</h2>

        <div className="bg-gray-50 p-4 rounded-xl">
          <ul className="list-disc pl-6 text-sm">
            <li>Income = ₹10,00,000</li>
            <li>Deductions = ₹2,00,000</li>
            <li>Old regime may save more tax</li>
          </ul>
        </div>
      </section>


      {/* BEST WAY */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Best way to choose</h2>

        <p>
          Instead of guessing, use an automatic calculator that compares both regimes instantly.
        </p>

        <p>
          HisabDesk calculates:
        </p>

        <ul className="list-disc pl-6">
          <li>Old regime tax</li>
          <li>New regime tax</li>
          <li>44ADA tax (if applicable)</li>
          <li>Shows the lowest option automatically</li>
        </ul>
      </section>


      {/* CTA */}
      <section className="text-center pt-6">
        <Link
          href="/dashboard"
          className="inline-block bg-black text-white px-6 py-3 rounded-xl font-medium hover:opacity-90"
        >
          Compare Now →
        </Link>
      </section>


      {/* FAQ */}
      <section className="space-y-3 pt-8 border-t">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>

        <p><strong>Which regime is better?</strong><br />
          Depends on deductions and income. Always compare both.</p>

        <p><strong>Can I switch regimes every year?</strong><br />
          Yes, salaried individuals can choose every year.</p>

        <p><strong>Does HisabDesk compare automatically?</strong><br />
          Yes, it instantly shows the best option.</p>
      </section>


      {/* EMAIL CAPTURE */}
      <section className="pt-10">
        <EmailCapture />
      </section>

    </main>
  )
}
