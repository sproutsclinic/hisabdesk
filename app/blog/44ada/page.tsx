import Link from "next/link"
import EmailCapture from "@/components/EmailCapture"

export const metadata = {
  title: "44ADA Tax Calculator – Freelancers, Doctors & Professionals (India)",
  description:
    "Free 44ADA tax calculator for freelancers, doctors and consultants. Calculate taxable income instantly and save maximum tax legally under Section 44ADA.",
  keywords: [
    "44ada calculator",
    "44ada tax calculator india",
    "freelancer tax calculator",
    "doctor tax under 44ada",
    "professional tax india"
  ]
}

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 leading-7">

      {/* TITLE */}
      <h1 className="text-3xl font-bold">
        44ADA Tax Calculator for Freelancers, Doctors & Professionals
      </h1>

      <p className="text-gray-600">
        Looking for a simple way to calculate tax under Section 44ADA?
        This guide explains everything and gives you a free calculator to compute your tax instantly.
      </p>


      {/* INTRO */}
      <section className="space-y-4">
        <p>
          If you are a freelancer, consultant, doctor, architect, designer or other professional,
          you don’t need complicated accounting to file taxes.
          Section <strong>44ADA of the Income Tax Act</strong> allows you to pay tax on only
          <strong> 50% of your income</strong>.
        </p>

        <p>
          This means <strong>lower taxes, less paperwork and faster filing.</strong>
        </p>
      </section>


      {/* HOW IT WORKS */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How 44ADA works</h2>

        <p>
          The government assumes that 50% of your professional income is spent on expenses.
          So only the remaining 50% is taxable.
        </p>

        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="font-medium">Example:</p>
          <ul className="list-disc pl-6 text-sm mt-2">
            <li>Total income = ₹20,00,000</li>
            <li>Expense assumed = ₹10,00,000</li>
            <li>Taxable income = ₹10,00,000</li>
          </ul>
        </div>
      </section>


      {/* ELIGIBILITY */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Who can use 44ADA?</h2>

        <ul className="list-disc pl-6">
          <li>Doctors</li>
          <li>Freelancers</li>
          <li>Consultants</li>
          <li>Designers</li>
          <li>Architects</li>
          <li>Lawyers</li>
          <li>Chartered Accountants</li>
        </ul>
      </section>


      {/* BENEFITS */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Benefits of 44ADA</h2>

        <ul className="list-disc pl-6">
          <li>No detailed bookkeeping required</li>
          <li>No tax audit needed</li>
          <li>Lower taxable income</li>
          <li>Simple filing process</li>
          <li>Save CA fees</li>
        </ul>
      </section>


      {/* PROBLEM */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Common problems professionals face</h2>

        <p>
          Most professionals still rely on Excel or manual CA calculations,
          which often leads to wrong tax estimation and overpaying taxes.
        </p>
      </section>


      {/* SOLUTION */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Use HisabDesk 44ADA Calculator</h2>

        <p>HisabDesk automatically:</p>

        <ul className="list-disc pl-6">
          <li>Tracks income & expenses</li>
          <li>Imports bank statements</li>
          <li>Calculates 44ADA instantly</li>
          <li>Compares old vs new regime</li>
          <li>Generates tax reports</li>
          <li>Gives AI tax tips</li>
        </ul>
      </section>


      {/* CTA */}
      <section className="text-center pt-6">
        <Link
          href="/dashboard"
          className="inline-block bg-black text-white px-6 py-3 rounded-xl font-medium hover:opacity-90"
        >
          Try Free Calculator →
        </Link>
      </section>


      {/* FAQ */}
      <section className="space-y-3 pt-8 border-t">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>

        <p><strong>Is 44ADA better than normal tax?</strong><br />
          Yes, most professionals save 30–50% tax.</p>

        <p><strong>Is audit required under 44ADA?</strong><br />
          No, audit is not required.</p>

        <p><strong>Can freelancers use it?</strong><br />
          Yes, freelancers and consultants are eligible.</p>
      </section>


      {/* EMAIL CAPTURE */}
      <section className="pt-10">
        <EmailCapture />
      </section>

    </main>
  )
}
