import Link from "next/link"

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
          This means:
          <strong> lower taxes + less paperwork + faster filing.</strong>
        </p>
      </section>


      {/* WHAT IS 44ADA */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">✅ What is Section 44ADA?</h2>

        <p>
          44ADA is a presumptive taxation scheme for professionals.  
          The government assumes that half of your income goes towards expenses.
          So only the remaining half becomes taxable.
        </p>

        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="font-medium">Example:</p>
          <ul className="list-disc pl-6 text-sm mt-2">
            <li>Total income = ₹20,00,000</li>
            <li>50% expense assumed = ₹10,00,000</li>
            <li>Taxable income = ₹10,00,000 only</li>
          </ul>
        </div>
      </section>


      {/* WHO CAN USE */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">✅ Who can use 44ADA?</h2>

        <ul className="list-disc pl-6">
          <li>Doctors</li>
          <li>Freelancers</li>
          <li>Consultants</li>
          <li>Designers</li>
          <li>Architects</li>
          <li>Chartered Accountants</li>
          <li>Lawyers</li>
        </ul>

        <p className="text-sm text-gray-600">
          Annual income must be within the government limits (generally ₹75 lakh or as updated).
        </p>
      </section>


      {/* BENEFITS */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">✅ Benefits of 44ADA</h2>

        <ul className="list-disc pl-6">
          <li>No need to maintain detailed books</li>
          <li>No audit required</li>
          <li>Lower taxable income</li>
          <li>Simple tax filing</li>
          <li>Saves CA fees</li>
        </ul>
      </section>


      {/* PROBLEM */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">❌ Common problem professionals face</h2>

        <p>
          Most professionals still calculate tax manually using Excel or depend fully on a CA.
          This leads to:
        </p>

        <ul className="list-disc pl-6">
          <li>Wrong tax estimates</li>
          <li>Missed deductions</li>
          <li>Overpaying tax</li>
          <li>Wasted time</li>
        </ul>
      </section>


      {/* SOLUTION */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">🚀 Use HisabDesk 44ADA Calculator</h2>

        <p>
          HisabDesk automatically calculates your 44ADA tax in seconds.
        </p>

        <ul className="list-disc pl-6">
          <li>Import bank statements</li>
          <li>Track income & expenses</li>
          <li>Auto 44ADA calculation</li>
          <li>Old vs New regime comparison</li>
          <li>PDF tax reports</li>
          <li>AI tax saving suggestions</li>
        </ul>
      </section>


      {/* CTA */}
      <section className="text-center pt-6">
        <Link
          href="/dashboard"
          className="inline-block bg-black text-white px-6 py-3 rounded-xl font-medium hover:opacity-90"
        >
          Try Free 44ADA Calculator →
        </Link>
      </section>


      {/* FAQ FOR SEO */}
      <section className="space-y-3 pt-8 border-t">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>

        <p><strong>Is 44ADA better than normal tax?</strong><br />
          Yes, for most professionals it reduces tax significantly.</p>

        <p><strong>Do I need audit under 44ADA?</strong><br />
          No, audit is not required.</p>

        <p><strong>Can freelancers use 44ADA?</strong><br />
          Yes, most freelancers qualify.</p>
      </section>

    </main>
  )
}
