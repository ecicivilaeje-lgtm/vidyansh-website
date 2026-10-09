import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { blogPosts } from "@/content/blog";
import { courses } from "@/content/courses";
import { getBlogArticle, getBlogPosts } from "@/lib/data/blog";
import { testSeriesFor } from "@/lib/data/courses";
import type { ExamCode } from "@/lib/types";

export const dynamicParams = false;
export const generateStaticParams = () => blogPosts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getBlogArticle((await params).slug);
  if (!post) return {};
  return {
    alternates: { canonical: `/blog/${post.slug}` },
    title: `${post.title} · Vidyansh`,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: { type: "article", title: post.title, description: post.description, authors: [post.author] },
  };
}

/** A guide, set for reading: a ruled title page, a contents rail beside the text, then where to go next. */
export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogArticle(slug);
  if (!post) notFound();
  const others = (await getBlogPosts()).filter((p) => p.slug !== post.slug);
  const course = courses.find((c) => c.exam === post.exam);
  const series = testSeriesFor(post.exam as ExamCode);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      author: { "@type": "Person", name: post.author },
      publisher: { "@type": "EducationalOrganization", name: "Vidyansh" },
      mainEntityOfPage: `/blog/${post.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
    <article className="on-light bg-ivory text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div aria-hidden="true" className="h-[var(--header-h)] bg-ink" />

      {/* Title page */}
      <header className="on-light container-v pt-[clamp(3.5rem,8vw,7rem)]">
        <nav aria-label="Breadcrumb" className="eyebrow text-mute-l">
          <Link href="/blog" className="link-underline">
            Journal
          </Link>
          <span aria-hidden="true"> / </span>
          <span>{post.examLabel}</span>
        </nav>
        <p className="eyebrow mt-10">
          {post.category} · {post.board}
        </p>
        <h1 className="mt-6 max-w-[16ch] text-[clamp(3rem,7.5vw,7.25rem)] leading-[0.88] tracking-[-0.035em]">{post.title}</h1>
        <p className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <span className="font-display text-[1.5rem] italic">By {post.author}</span>
          <span className="font-mono text-xs tracking-[0.14em] text-mute-l uppercase">{post.readMinutes} min read</span>
        </p>

        <dl className="mt-[clamp(3rem,6vw,5rem)] grid border-t-2 border-ink sm:grid-cols-3">
          {post.figures.map((f) => (
            <div key={f.label} className="grid gap-2 border-b border-[var(--line-l)] py-6 sm:border-b-0 sm:border-l sm:px-6 sm:first:border-l-0 sm:first:pl-0">
              <dt className="order-2 font-mono text-[0.6875rem] tracking-[0.12em] text-mute-l uppercase">{f.label}</dt>
              <dd className="order-1 font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-none tracking-[-0.02em] tabular-nums">{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* The text, with a contents rail */}
      <div className="on-light container-v grid grid-cols-[minmax(0,1fr)] gap-12 pt-[clamp(3rem,6vw,5rem)] pb-[var(--space-block)] lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-[clamp(3rem,7vw,8rem)]">
        <nav aria-label="In this guide" className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <details className="group border-y border-ink lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-mono text-xs font-medium tracking-[0.16em] uppercase [&::-webkit-details-marker]:hidden">
              In this guide
              <span aria-hidden="true" className="text-base transition-transform duration-500 ease-out-expo group-open:rotate-45">
                +
              </span>
            </summary>
            <ol className="grid gap-1 pb-5">
              {post.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="font-display text-[1.25rem] leading-snug">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </details>
          <div className="hidden lg:block">
            <p className="eyebrow border-t border-ink pt-4">In this guide</p>
            <ol className="mt-5 grid gap-2.5">
              {post.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="block font-display text-[1.125rem] leading-snug text-mute-l transition-colors hover:text-ink hover:italic">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="max-w-[44rem]">
          <div className="article-prose [&>p:first-child]:font-display [&>p:first-child]:text-[clamp(1.375rem,2vw,1.75rem)] [&>p:first-child]:leading-snug" dangerouslySetInnerHTML={{ __html: post.html }} />
          <aside aria-label="Disclaimer" className="mt-16 border-l-2 border-ink py-1 pl-5 text-[0.9375rem] text-mute-l">
            <p className="eyebrow mb-2 text-ink">Before you rely on it</p>
            {post.disclaimer}
          </aside>
        </div>
      </div>

    </article>

      {/* Where to go next */}
      <section aria-labelledby="next-title" className="scene-surface border-t border-[var(--line-d)] bg-night py-[var(--space-block)] text-ivory">
        <div className="container-v grid gap-[clamp(3rem,6vw,5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h2 id="next-title" className="max-w-[14ch] text-[clamp(2.75rem,5.5vw,5rem)] leading-[0.9] tracking-[-0.025em]">
              Preparing for {post.examLabel}? <em className="font-normal">Start here</em>
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              {course ? (
                <Button href={`/courses/${course.slug}`} diamond>
                  See the {course.name} course
                </Button>
              ) : (
                <Button href="/courses" diamond>
                  Explore courses
                </Button>
              )}
              <Button href={series ? `/test-series/${series.code}` : "/test-series"} variant="ghost">
                Try a free mock test
              </Button>
            </div>
          </div>
          {others.length > 0 && (
            <div>
              <p className="eyebrow border-b border-ivory/40 pb-4">More guides</p>
              <ul>
                {others.map((o) => (
                  <li key={o.slug} className="border-b border-[var(--line-d)]">
                    <Link href={`/blog/${o.slug}`} className="group flex items-baseline justify-between gap-6 py-6">
                      <span className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight">
                        <span className="link-underline">
                          {o.short[0]} <em className="font-normal">{o.short[1]}</em>
                        </span>
                        <span className="mt-1 block font-mono text-[0.6875rem] tracking-[0.12em] text-mute-d uppercase">{o.board}</span>
                      </span>
                      <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
