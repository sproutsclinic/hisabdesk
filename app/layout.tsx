// ==========================================================
// HisabDesk — Root Layout (ENTERPRISE FINAL)
// Stable • Fast • Fintech neutral • Production hardened
// ==========================================================

import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Geist } from "next/font/google"
import "./globals.css"

import ToastProvider from "@/components/providers/ToastProvider"
import ErrorBoundary from "@/components/providers/ErrorBoundary"

/* ==========================================================
   ✅ ADDED — Global AI Assistant (ONLY ADDITION)
========================================================== */
import AIAssistant from "@/components/ai/AIAssistant"

/* ==========================================================
   FONT — Stripe / Linear / Notion style SaaS typography
========================================================== */

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

/* ==========================================================
   VIEWPORT
========================================================== */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#18181b",
}

/* ==========================================================
   SEO + TRUST
========================================================== */

export const metadata: Metadata = {
  title: {
    default: "HisabDesk — Smart Accounting & Tax Filing",
    template: "%s • HisabDesk",
  },
  description:
    "AI-powered accounting, GST, tax filing and financial vault for Indian professionals.",

  applicationName: "HisabDesk",

  manifest: "/manifest.json",

  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },

  metadataBase: new URL("https://hisabdesk.com"),

  openGraph: {
    title: "HisabDesk",
    description:
      "Accounting, GST and tax filing — simplified for professionals.",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
}

/* ==========================================================
   ROOT LAYOUT
   ✔ no hydration mismatch
   ✔ minimal JS
   ✔ stable shell
   ✔ fintech clean baseline
   ✔ enterprise hardening added (safe)
   ✔ AI Assistant globally available (NEW)
========================================================== */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html
      lang="en"
      className={`${geist.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="
          font-sans antialiased
          min-h-screen w-full

          bg-zinc-50 text-zinc-900

          subpixel-antialiased
          [text-rendering:optimizeLegibility]

          overflow-x-hidden

          pb-[env(safe-area-inset-bottom)]

          selection:bg-zinc-900
          selection:text-white
        "
      >
        {/* ======================================================
           Razorpay — load early for checkout reliability
        ====================================================== */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

        {/* ======================================================
           Google Analytics (only if env present)
        ====================================================== */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}

        {/* ======================================================
           GLOBAL PROVIDERS
           Order matters:
           Toast → ErrorBoundary → App
        ====================================================== */}
        <ToastProvider>
          <ErrorBoundary>
            <div
              className="
                min-h-screen
                flex flex-col
                motion-safe:transition-opacity
              "
            >
              {children}

              {/* ======================================================
                 ✅ GLOBAL AI FINANCIAL MANAGER (ONLY ADDITION)
                 Visible on ALL pages
              ====================================================== */}
              <AIAssistant />

            </div>
          </ErrorBoundary>
        </ToastProvider>
      </body>
    </html>
  )
}
