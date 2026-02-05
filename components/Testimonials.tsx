"use client"

/* =================================================
   TESTIMONIALS — Trust Builder (In-App)

   Upgrades:
   ✅ compact (fits dashboard)
   ✅ card style (not landing page)
   ✅ softer colors
   ✅ mobile friendly
   ✅ fintech SaaS feel
   ✅ zero breaking
================================================= */

export default function Testimonials() {
  const items = [
    {
      name: "Dr. Sharma",
      role: "Clinic Owner",
      text: "Earlier I depended on CA for everything. Now HisabDesk calculates my tax in seconds.",
    },
    {
      name: "Priya Mehta",
      role: "Freelance Designer",
      text: "Bank statement import + AI tips saved me ₹25,000 in taxes this year!",
    },
    {
      name: "Rahul Jain",
      role: "Consultant",
      text: "Feels like QuickBooks but made for Indian taxes. Super simple and fast.",
    },
  ]

  return (
    <section className="space-y-5">
      {/* Title */}
      <h3 className="text-sm font-semibold text-zinc-500 text-center">
        Trusted by professionals across India
      </h3>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((t, i) => (
          <div
            key={i}
            className="
              bg-white dark:bg-zinc-900
              border border-zinc-200 dark:border-zinc-800
              rounded-2xl
              p-5
              text-sm
              shadow-sm
            "
          >
            <p className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
              “{t.text}”
            </p>

            <div className="text-xs font-semibold">
              {t.name}
            </div>

            <div className="text-[11px] text-zinc-500">
              {t.role}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
