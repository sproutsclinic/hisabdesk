import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import AppShell from "@/components/layout/AppShell"
import ToastProvider from "@/components/providers/ToastProvider"
import ThemeProvider from "@/components/providers/ThemeProvider"
import ErrorBoundary from "@/components/providers/ErrorBoundary" // ✅ NEW

/* =========================
   FONTS
========================= */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

/* =========================
   METADATA
========================= */

export const metadata: Metadata = {
  metadataBase: new URL("https://hisabdesk.com"),

  title: {
    default: "HisabDesk – AI Tax Filing & Calculator for India",
    template: "%s | HisabDesk",
  },

  description:
    "Track income, expenses, calculate tax, import bank statements and file taxes easily. Built for Indian doctors, freelancers & professionals.",

  manifest: "/manifest.json",

  openGraph: {
    title: "HisabDesk – Smart Tax Filing for India",
    description:
      "Calculate tax instantly. Save money legally. No CA required.",
    url: "https://hisabdesk.com",
    siteName: "HisabDesk",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "HisabDesk – AI Tax Filing",
    description: "Smart income tax calculator for Indian professionals",
  },
}

/* =========================
   ROOT LAYOUT
========================= */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        className="
          bg-zinc-50 text-zinc-900
          dark:bg-zinc-950 dark:text-zinc-100
          font-sans antialiased
          min-h-screen
        "
      >
        {/* Razorpay */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />

            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* ================= APP WRAPPERS ================= */}
        <ThemeProvider>
          <ToastProvider>
            <ErrorBoundary> {/* ✅ NEW crash safety */}
              <AppShell>
                {children}
              </AppShell>
            </ErrorBoundary>
          </ToastProvider>
        </ThemeProvider>

      </body>
    </html>
  )
}
