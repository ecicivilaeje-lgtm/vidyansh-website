/**
 * Data access for the journal. Today it reads content/blog.ts and the article HTML
 * files; later it can call GET /articles and GET /articles/:slug instead.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { blogPage, blogPosts } from "@/content/blog";
import type { BlogArticle, BlogPost } from "@/lib/blog-types";

const strip = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();

export async function getBlogPage() {
  return blogPage;
}

/** GET /articles */
export async function getBlogPosts(): Promise<BlogPost[]> {
  return blogPosts;
}

export async function getBlogPostsForExam(exam: string): Promise<BlogPost[]> {
  return blogPosts.filter((p) => p.exam === exam);
}

/** GET /articles/:slug */
export async function getBlogArticle(slug: string): Promise<BlogArticle | null> {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return null;
  const html = await readFile(path.join(process.cwd(), "content", "blog", `${slug}.html`), "utf8");
  const sections = [...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map((m) => ({ id: m[1], title: strip(m[2]) }));
  const faq = [...html.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map((m) => ({ q: strip(m[1]), a: strip(m[2]) }));
  const words = strip(html).split(/\s+/).length;
  return { ...post, html, sections, faq, readMinutes: Math.max(1, Math.round(words / 220)) };
}
