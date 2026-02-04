import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // gzip/brotli compression (works on Vercel automatically)
  compress: true,

  // remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // security headers (good for fintech / tax / payments apps)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ]
  },
}

export default nextConfig
