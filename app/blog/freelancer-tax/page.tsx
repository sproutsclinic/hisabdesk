export const metadata = {
  title: "Freelancer Tax Filing Guide India – Step by Step",
  description:
    "Simple guide for freelancers to calculate income tax, use 44ADA and file returns easily."
}

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6 leading-7">

      <h1 className="text-3xl font-bold">
        Freelancer Tax Filing Guide in India
      </h1>

      <p>
        If you earn from freelancing, consulting or gigs, you don’t need complicated accounting.
        Section 44ADA makes tax filing extremely simple.
      </p>

      <h2 className="text-xl font-semibold">Steps</h2>

      <ol className="list-decimal pl-6">
        <li>Track all payments received</li>
        <li>Track expenses</li>
        <li>Use 44ADA for 50% taxable income</li>
        <li>Calculate tax</li>
        <li>File return</li>
      </ol>

      <p>
        HisabDesk automates all these steps in one dashboard.
      </p>

      <a href="/dashboard" className="inline-block bg-black text-white px-5 py-3 rounded-xl">
        Try Now →
      </a>

    </main>
  )
}
