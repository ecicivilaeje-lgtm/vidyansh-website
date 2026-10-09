import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog";
import { courses } from "@/content/courses";
import { testSeriesCatalogue, testSeriesExams, testSeriesFormats } from "@/content/test-series";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/courses", "/test-series", "/results", "/exams", "/faculty", "/study-material", "/free-classes", "/blog", "/about", "/contact", "/privacy", "/terms", "/refunds"];
  const paths = [
    ...pages,
    ...courses.map((c) => `/courses/${c.slug}`),
    ...blogPosts.map((b) => `/blog/${b.slug}`),
    ...testSeriesExams.map((e) => `/test-series/${e.code}`),
    ...testSeriesFormats.map((f) => `/test-series/format/${f.id}`),
    ...testSeriesCatalogue.map((s) => `/test-series/series/${s.slug}`),
  ];
  return paths.map((p) => ({ url: `${site}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
}
