import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/vault",
          "/billing",
        ],
      },
    ],
    sitemap: "https://hisabdesk.com/sitemap.xml",
  }
}
