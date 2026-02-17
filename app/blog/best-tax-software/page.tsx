ï»¿import Link from "next/link"
import EmailCapture from "@/components/EmailCapture"

export const metadata = {
  title: "Best Tax Filing Software in India for Freelancers & Professionals",
  description:
    "Looking for the best tax filing software in India? Compare tools, calculate tax automatically and file returns easily without CA dependency.",
  keywords: [
    "best tax software india",
    "tax filing software india",
    "income tax calculator india",
    "freelancer tax software",
    "44ada tax calculator app"
  ]
}

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 leading-7">

      {/* TITLE */}
      <h1 className="text-3xl font-bold">
        Best Tax Filing Software in India for Freelancers & Professionals
      </h1>

      <p className="text-gray-600">
        Still using Excel sheets or depending fully on a CA to calculate taxes?
        Modern professionals now use smart tax software to automate everything.
      </p>


      {/* INTRO */}
      <section className="space-y-4">
        <p>
          Filing income tax manually is time-consuming and error-prone.
          Tracking expenses, calculating deductions, comparing regimes and preparing reports
          can take hours every month.
        </p>

        <p>
          A good tax filing software saves time, reduces mistakes and helps you legally
          pay the lowest possible tax.
        </p>
      </section>


      {/* FEATURES */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What to look for in tax software?</h2>

        <ul className="list-disc pl-6">
          <li>Automatic income tracking</li>
          <li>Expense categorization</li>
          <li>Old vs New regime comparison</li>
          <li>44ADA calculator for professionals</li>
          <li>Bank statement import</li>
          <li>PDF tax reports</li>
          <li>Simple dashboard</li>
        </ul>
      </section>


      {/* PROBLEMS */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Common problems with traditional methods</h2>

        <ul className="list-disc pl-6">
          <li>Manual Excel tracking</li>
          <li>Wrong tax calculations</li>
          <li>Missed deductions</li>
          <li>Dependence on CA for small tasks</li>
          <li>No real-time tax estimate</li>
        </ul>
      </section>


      {/* SOLUTION */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Why HisabDesk is better</h2>

        <p>
          HisabDesk combines accounting + tax + AI guidance into one simple app.
          You donÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢t need multiple tools or spreadsheets.
        </p>

        <ul className="list-disc pl-6">
          <li>Track income & expenses instantly</li>
          <li>Auto 44ADA tax calculation</li>
          <li>Old vs New regime comparison</li>
          <li>AI tax saving suggestions</li>
          <li>Bank statement import</li>
          <li>Download reports anytime</li>
        </ul>
      </section>


      {/* CTA */}
      <section className="text-center pt-6">
        <Link
          href="/dashboard"
          className="inline-block bg-black text-white px-6 py-3 rounded-xl font-medium hover:opacity-90"
        >
          Start Free ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢
        </Link>
      </section>


      {/* FAQ FOR SEO */}
      <section className="space-y-3 pt-8 border-t">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>

        <p><strong>Is tax software better than Excel?</strong><br />
          Yes. It automates calculations and reduces mistakes.</p>

        <p><strong>Can freelancers use tax software?</strong><br />
          Absolutely. ItÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢s ideal for freelancers and consultants.</p>

        <p><strong>Does HisabDesk support 44ADA?</strong><br />
          Yes. It automatically calculates tax under 44ADA.</p>
      </section>


      {/* EMAIL CAPTURE */}
      <section className="pt-10">
        <EmailCapture />
      </section>

    </main>
  )
}
