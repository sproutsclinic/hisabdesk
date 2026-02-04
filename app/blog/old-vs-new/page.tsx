export const metadata = {
  title: "Old vs New Tax Regime – Which is Better in 2026?",
  description:
    "Compare old vs new tax regime and find which saves more tax using our calculator."
}

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6 leading-7">

      <h1 className="text-3xl font-bold">
        Old vs New Tax Regime – Which One Should You Choose?
      </h1>

      <p>
        Choosing the wrong regime can cost you thousands of rupees.
        The best choice depends on deductions and income level.
      </p>

      <h2 className="text-xl font-semibold">Old Regime</h2>
      <p>Allows deductions like 80C, HRA, home loan, etc.</p>

      <h2 className="text-xl font-semibold">New Regime</h2>
      <p>Lower tax slabs but fewer deductions.</p>

      <h2 className="text-xl font-semibold">Best Way</h2>
      <p>
        Use HisabDesk’s automatic comparison tool to instantly know which regime saves more tax.
      </p>

      <a href="/dashboard" className="inline-block bg-black text-white px-5 py-3 rounded-xl">
        Compare Now →
      </a>

    </main>
  )
}
