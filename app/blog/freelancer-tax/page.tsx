import Link from "next/link"
import EmailCapture from "@/components/EmailCapture"

export const metadata = {
  title: "Freelancer Tax Filing Guide India – Step by Step (2026)",
  description:
    "Complete freelancer tax filing guide in India. Learn how to calculate tax, use 44ADA, track expenses and file returns easily without CA dependency.",
  keywords: [
    "freelancer tax india",
    "freelancer tax filing guide",
    "44ada freelancer tax",
    "income tax for freelancers india",
    "freelance tax calculator"
  ]
}

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 leading-7">

      {/* TITLE */}
      <h1 className="text-3xl font-bold">
        Freelancer Tax Filing Guide in India
      </h1>

      <p className="text-gray-600">
        If you earn from freelancing, consulting, gigs or online work,
        you don’t need complicated accounting or expensive CAs.
        Filing taxes as a freelancer can be simple if done correctly.
      </p>


      {/* INTRO */}
      <section className="space-y-4">
        <p>
          Many freelancers overpay tax because they don’t understand deductions
          or Section 44ADA. With the right method, you can reduce tax legally
          and file returns in minutes.
        </p>

        <p>
          This step-by-step guide shows exactly how to do it.
        </p>
      </section>


      {/* STEP BY STEP */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Step-by-step freelancer tax process</h2>

        <ol className="list-decimal pl-6 space-y-2">
          <li>Track all payments received</li>
          <li>Track business expenses</li>
          <li>Use 44ADA for 50% taxable income</li>
          <li>Calculate tax under old vs new regime</li>
          <li>File your return</li>
        </ol>
      </section>


      {/* 44ADA */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Use Section 44ADA (Huge benefit)</h2>

        <p>
          Section 44ADA allows freelancers to pay tax on only 50% of income.
          The remaining 50% is automatically treated as expenses.
        </p>

        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="font-medium">Example:</p>
          <ul className="list-disc pl-6 text-sm mt-2">
            <li>Income = ₹10,00,000</li>
            <li>Taxable = ₹5,00,000 only</li>
            <li>Massive tax savings</li>
          </ul>
        </div>
      </section>


      {/* EXPENSES */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Expenses freelancers can claim</h2>

        <ul className="list-disc pl-6">
          <li>Laptop & software</li>
          <li>Internet & phone bills</li>
          <li>Office rent or co-working</li>
          <li>Travel & meetings</li>
          <li>Courses & tools</li>
        </ul>
      </section>


      {/* COMMON PROBLEMS */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Common mistakes freelancers make</h2>

        <ul className="list-disc pl-6">
          <li>Using Excel manually</li>
          <li>Forgetting expenses</li>
          <li>Calculating tax only at year-end</li>
          <li>Choosing wrong tax regime</li>
        </ul>
      </section>


      {/* SOLUTION */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Better solution: Use HisabDesk</h2>

        <p>
          HisabDesk automates everything so freelancers can focus on work instead of tax math.
        </p>

        <ul className="list-disc pl-6">
          <li>Track income automatically</li>
          <li>Import bank statements</li>
          <li>Auto 44ADA calculation</li>
          <li>Tax comparison</li>
          <li>Generate reports instantly</li>
        </ul>
      </section>


      {/* CTA */}
      <section className="text-center pt-6">
        <Link
          href="/dashboard"
          className="inline-block bg-black text-white px-6 py-3 rounded-xl font-medium hover:opacity-90"
        >
          Try Free →
        </Link>
      </section>


      {/* FAQ */}
      <section className="space-y-3 pt-8 border-t">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>

        <p><strong>Do freelancers need GST?</strong><br />
          Depends on income threshold and services provided.</p>

        <p><strong>Can freelancers use 44ADA?</strong><br />
          Yes, most freelancers are eligible.</p>

        <p><strong>Do I need a CA?</strong><br />
          Not for basic filing if you use proper software.</p>
      </section>


      {/* EMAIL CAPTURE */}
      <section className="pt-10">
        <EmailCapture />
      </section>

    </main>
  )
}
