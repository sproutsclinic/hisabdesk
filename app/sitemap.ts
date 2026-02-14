import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://hisabdesk.com"

  const now = new Date()

  return [
    {
      url: base,
      lastModified: now,
      priority: 1,
    },

    {
      url: `${base}/login`,
      lastModified: now,
      priority: 0.9,
    },

    {
      url: `${base}/billing`,
      lastModified: now,
      priority: 0.9,
    },

    {
      url: `${base}/dashboard`,
      lastModified: now,
      priority: 0.8,
    },

    {
      url: `${base}/vault`,
      lastModified: now,
      priority: 0.8,
    },

    {
      url: `${base}/referral`,
      lastModified: now,
      priority: 0.7,
    },

    {
      url: `${base}/tax`,
      lastModified: now,
      priority: 0.7,
    },

    {
      url: `${base}/blog`,
      lastModified: now,
      priority: 0.6,
    },

    {
      url: `${base}/blog/44ada`,
      lastModified: now,
      priority: 0.6,
    },
  ]
}
