import type { MetadataRoute } from "next";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    // Test attempts and personal results are not for search engines.
    rules: { userAgent: "*", allow: "/", disallow: ["/test-series/series/*/tests/"] },
    sitemap: `${site}/sitemap.xml`,
  };
}
