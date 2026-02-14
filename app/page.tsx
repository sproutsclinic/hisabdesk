// app/page.tsx
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="w-full">

      {/* ================================================= */}
      {/* HEADER (Branding) */}
      {/* ================================================= */}
      <header className="w-full border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">HisabDesk</h1>

          <div className="flex gap-4 text-sm">
            <Link href="/login">Login</Link>
            <Link href="/signup" className="font-medium">
              Start Free
            </Link>
          </div>
        </div>
      </header>


      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}
      <section className="max-w-7xl mx-auto px-6 py-28 text-center">
        <h2 className="text-5xl font-bold tracking-tight leading-tight">
          One Desk for All Your Finances
        </h2>

        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          Personal money. Business accounting. Client compliance.
          Everything in one secure platform.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/signup"
            className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:opacity-90"
          >
            Start Free
          </Link>

          <Link
            href="/login"
            className="border px-6 py-3 rounded-xl font-medium hover:bg-slate-50"
          >
            Login
          </Link>
        </div>
      </section>


      {/* ================================================= */}
      {/* WHO IS THIS FOR */}
      {/* ================================================= */}
      <section className="border-t bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-semibold text-center">
            Built for the way you work
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card
              title="Individuals & Taxpayers"
              text="Track salary, expenses, savings, and taxes in one simple place."
            />
            <Card
              title="Small Businesses & Professionals"
              text="Run your business and stay compliant without spreadsheets."
            />
            <Card
              title="Chartered Accountants"
              text="Manage multiple clients and filings from one powerful workspace."
            />
          </div>
        </div>
      </section>


      {/* ================================================= */}
      {/* TESTIMONIALS (NEW) */}
      {/* ================================================= */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold">Loved by users</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-14 text-left">
          <Testimonial
            name="Amit Sharma"
            text="Finally replaced Excel. Everything is organized and tax ready."
          />
          <Testimonial
            name="Dr. Priya Mehta"
            text="Income, expenses and GST — all in one dashboard. Huge time saver."
          />
          <Testimonial
            name="CA Rohit Jain"
            text="Managing multiple clients is 10x faster now. Perfect for CAs."
          />
        </div>
      </section>


      {/* ================================================= */}
      {/* FINAL CTA */}
      {/* ================================================= */}
      <section className="border-t bg-black text-white text-center py-20">
        <h2 className="text-3xl font-semibold">
          Stop juggling apps. Start managing money professionally.
        </h2>

        <Link
          href="/signup"
          className="inline-block mt-8 bg-white text-black px-8 py-3 rounded-xl font-medium"
        >
          Start Free Today
        </Link>
      </section>
    </div>
  )
}


/* ================================================= */
/* Small helpers (kept inside file for simplicity)   */
/* ================================================= */

function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border hover:shadow-sm">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-slate-600 text-sm">{text}</p>
    </div>
  )
}

function Testimonial({ name, text }: { name: string; text: string }) {
  return (
    <div className="border rounded-2xl p-6 bg-white">
      <div className="text-yellow-500 text-lg mb-2">★★★★★</div>
      <p className="text-sm text-slate-600">"{text}"</p>
      <p className="mt-3 font-medium text-sm">— {name}</p>
    </div>
  )
}
