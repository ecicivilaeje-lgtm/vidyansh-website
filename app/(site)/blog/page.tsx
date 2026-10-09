import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPage, getBlogPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Journal · Vidyansh",
  description:
    "Exam guides by Shubham Sir for SSC JE, RRB JE and RSSB JE 2026: vacancies, eligibility, exam pattern and key dates, explained in plain words.",
};

/** The Journal: a contents page. Each guide is one ruled row with its exam set large and its key figures beside it. */
export default async function BlogPage() {
  const [page, posts] = await Promise.all([getBlogPage(), getBlogPosts()]);

  return (
    <>
      <header className="bg-ink pt-[calc(var(--header-h)+clamp(3.5rem,8vw,7rem))] pb-[clamp(3rem,6vw,5rem)]">
        <div className="container-v grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
          <h1 className="text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.86] tracking-[-0.04em]">
            <span className="hero-mask block">
              <span className="hero-rise block">
                The Vidyansh <em className="font-normal">journal</em>
              </span>
            </span>
          </h1>
          <div className="hero-fade grid gap-4">
            <p className="text-[1.1875rem] text-body-d">{page.intro}</p>
            <p className="eyebrow">Written by Shubham Sir</p>
          </div>
        </div>
      </header>

      <section aria-label="Articles" className="scene-sheet on-light bg-ivory pt-[clamp(3rem,6vw,5rem)] pb-[var(--space-section)] text-ink">
        <div className="container-v">
          <p className="eyebrow flex justify-between border-b-2 border-ink pb-4">
            <span>Exam guides</span>
            <span className="tabular-nums">{posts.length} articles</span>
          </p>
          <ol>
            {posts.map((p) => (
              <li key={p.slug} className="border-b border-[var(--line-l)]">
                <Link
                  href={`/blog/${p.slug}`}
                  className="group grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-6 py-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,15rem)] lg:items-start"
                >
                  <p aria-hidden="true" className="font-display text-[clamp(3.75rem,8vw,7.5rem)] leading-[0.84] tracking-[-0.04em] transition-transform duration-700 ease-out-expo group-hover:translate-x-2">
                    {p.short[0]} <em className="font-normal text-mute-l">{p.short[1]}</em>
                  </p>
                  <div className="grid content-start gap-4">
                    <p className="eyebrow text-mute-l">
                      {p.category} · {p.board}
                    </p>
                    <h2 className="text-[clamp(1.75rem,2.6vw,2.375rem)] leading-[1.05] tracking-[-0.015em]">
                      <span className="link-underline">{p.title}</span>
                    </h2>
                    <p className="max-w-[54ch] text-mute-l">{p.description}</p>
                    <p className="mt-2 font-mono text-xs font-medium tracking-[0.16em] uppercase">
                      Read the guide{" "}
                      <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                        →
                      </span>
                    </p>
                  </div>
                  <dl className="grid grid-cols-3 gap-4 border-t border-ink pt-4 lg:grid-cols-1 lg:gap-0 lg:pt-0">
                    {p.figures.map((f) => (
                      <div key={f.label} className="grid content-start gap-1 lg:border-b lg:border-[var(--line-l)] lg:py-3 lg:first:pt-0">
                        <dt className="order-2 font-mono text-[0.625rem] leading-snug tracking-[0.12em] text-mute-l uppercase">{f.label}</dt>
                        <dd className="order-1 font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-none tabular-nums">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                </Link>
              </li>
            ))}
          </ol>
          <p className="eyebrow mt-8 max-w-[64ch] leading-relaxed text-mute-l">
            Figures are taken from each official notice. Always confirm against the notice and any corrigendum.
          </p>
        </div>
      </section>
    </>
  );
}
