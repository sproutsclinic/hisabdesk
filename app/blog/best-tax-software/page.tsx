export const metadata = {
  title: "Best Tax Filing Software in India for Freelancers & Professionals",
  description:
    "Looking for the best tax software in India? Compare tools and choose the smartest way to file taxes."
}

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6 leading-7">

      <h1 className="text-3xl font-bold">
        Best Tax Filing Software in India
      </h1>

      <p>
        Excel sheets and manual CA calculations are outdated.
        Modern professionals use smart tax software to automate everything.
      </p>

      <h2 className="text-xl font-semibold">What to look for?</h2>

      <ul className="list-disc pl-6">
        <li>Auto income tracking</li>
        <li>Expense categorization</li>
        <li>Tax comparison</li>
        <li>Bank import</li>
        <li>Reports</li>
      </ul>

      <p>
        HisabDesk combines all these features into one simple dashboard.
      </p>

      <a href="/dashboard" className="inline-block bg-black text-white px-5 py-3 rounded-xl">
        Start Free →
      </a>

    </main>
  )
}
