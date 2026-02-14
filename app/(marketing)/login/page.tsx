// app/(marketing)/login/page.tsx

import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md border rounded-2xl p-8 bg-white">

        <h1 className="text-2xl font-semibold text-center">
          Welcome back
        </h1>

        <p className="text-sm text-slate-600 text-center mt-2">
          Sign in to continue to HisabDesk
        </p>

        <div className="mt-8 space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
          />

          <button className="w-full bg-black text-white rounded-xl p-3 font-medium">
            Login
          </button>

        </div>

        <p className="text-sm text-center text-slate-600 mt-6">
          Don’t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}
