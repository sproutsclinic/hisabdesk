import Link from "next/link"
import EmailCapture from "@/components/EmailCapture"

export const metadata = {
  title: "How Doctors Can Save Maximum Tax in India (2026 Guide)",
  description:
    "Complete tax saving guide for doctors in India. Learn about 44ADA, deductions, expenses and tools to reduce tax legally and file easily.",
  keywords: [
    "doctor tax saving india",
    "tax for doctors india",
    "44ada for doctors",
    "medical practice tax",
    "doctor income tax calculator"
  ]
}

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 leading-7">

      {/* TITLE */}
      <h1 className="text-3xl font-bold">
        How Doctors Can Save Maximum Tax in India
      </h1>

      <p className="text-gray-600">
        Many doctors unknowingly overpay taxes every year.
        With the right strategy and proper tracking, you can legally reduce your tax by 30–50%.
      </p>


      {/* INTRO */}
      <section className="space-y-4">
        <p>
          Whether you run a clinic, work as a consultant or practice privately,
          managing taxes can feel complicated. Most doctors depend fully on CAs
          and only calculate tax at year-end — which leads to mistakes and missed savings.
        </p>

        <p>
          The good news is: Indian tax law provides multiple benefits specifically
          for professionals like doctors.
        </p>
      </section>


      {/* 44ADA */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Use Section 44ADA (Biggest Benefit)</h2>

        <p>
          Section 44ADA allows doctors to pay tax on only 50% of their income.
          The government assumes the other 50% as expenses automatically.
        </p>

        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="font-medium">Example:</p>
          <ul className="list-disc pl-6 text-sm mt-2">
            <li>Total income = ₹30,00,000</li>
            <li>Taxable income = ₹15,00,000 only</li>
            <li>You save thousands in tax</li>
          </ul>
        </div>
      </section>


      {/* EXPENSES */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Claim all clinic expenses</h2>

        <p>Doctors can legally claim:</p>

        <ul className="list-disc pl-6">
          <li>Clinic rent</li>
          <li>Medical equipment</li>
          <li>Staff salary</li>
          <li>Electricity & internet</li>
          <li>Medical supplies</li>
          <li>Travel & conferences</li>
        </ul>
      </section>


      {/* COMMON MISTAKES */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Common mistakes doctors make</h2>

        <ul className="list-disc pl-6">
          <li>Not tracking daily income</li>
          <li>Forgetting small expenses</li>
          <li>Depending only on CA</li>
          <li>Choosing wrong tax regime</li>
        </ul>

        <p>
          These mistakes often lead to paying more tax than necessary.
        </p>
      </section>


      {/* SOLUTION */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Better solution: Use software instead of Excel</h2>

        <p>
          Modern doctors use tools like HisabDesk to automate everything.
        </p>

        <ul className="list-disc pl-6">
          <li>Track income & expenses automatically</li>
          <li>Import bank statements</li>
          <li>Auto 44ADA calculation</li>
          <li>Compare old vs new regime</li>
          <li>Download reports instantly</li>
        </ul>
      </section>


      {/* CTA */}
      <section className="text-center pt-6">
        <Link
          href="/dashboard"
          className="inline-block bg-black text-white px-6 py-3 rounded-xl font-medium hover:opacity-90"
        >
          Start Free →
        </Link>
      </section>


      {/* FAQ */}
      <section className="space-y-3 pt-8 border-t">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>

        <p><strong>Can doctors use 44ADA?</strong><br />
          Yes, doctors are fully eligible.</p>

        <p><strong>Is audit required?</strong><br />
          No audit is needed under 44ADA.</p>

        <p><strong>Should doctors use tax software?</strong><br />
          Yes. It helps avoid mistakes and saves time.</p>
      </section>


      {/* EMAIL CAPTURE */}
      <section className="pt-10">
        <EmailCapture />
      </section>

    </main>
  )
}
