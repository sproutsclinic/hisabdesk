import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {},
    },
  },

  // 🔴 Disable Turbopack for build (keep for dev if needed)
  turbopack: {
    enabled: false,
  },
}

export default nextConfig