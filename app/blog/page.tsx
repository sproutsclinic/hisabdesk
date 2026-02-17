ï»¿import Link from "next/link"

export const metadata = {
  title: "Tax Guides & Calculators",
  description:
    "Free Indian tax guides, 44ADA calculator, freelancer tax saving tips and more."
}

export default function Blog() {
  const posts = [
    {
      title: "44ADA Tax Calculator for Freelancers",
      href: "/blog/44ada"
    },
    {
      title: "How Doctors Can Save Maximum Tax in India",
      href: "/blog/doctors-tax"
    },
    {
      title: "Freelancer Tax Filing Guide (Step-by-Step)",
      href: "/blog/freelancer-tax"
    }
  ]

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-8">

      <h1 className="text-3xl font-bold">
        Tax Guides & Calculators
      </h1>

      <div className="space-y-4">
        {posts.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="block border rounded-xl p-4 hover:shadow"
          >
            {p.title}
          </Link>
        ))}
      </div>

    </main>
  )
}
