export default function Testimonials() {
  const items = [
    {
      name: "Dr. Sharma",
      role: "Clinic Owner",
      text: "Earlier I depended on CA for everything. Now HisabDesk calculates my tax in seconds."
    },
    {
      name: "Priya Mehta",
      role: "Freelance Designer",
      text: "Bank statement import + AI tips saved me ₹25,000 in taxes this year!"
    },
    {
      name: "Rahul Jain",
      role: "Consultant",
      text: "Feels like QuickBooks but made for Indian taxes. Super simple and fast."
    }
  ]

  return (
    <section className="py-24 px-6 bg-gray-50">

      <h2 className="text-3xl font-bold text-center mb-14">
        Loved by professionals across India ❤️
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {items.map((t, i) => (
          <div
            key={i}
            className="bg-white border rounded-2xl p-6 shadow-sm"
          >
            <p className="text-sm text-gray-600 mb-4">
              “{t.text}”
            </p>

            <div className="font-semibold">{t.name}</div>
            <div className="text-xs text-gray-500">{t.role}</div>
          </div>
        ))}

      </div>
    </section>
  )
}
