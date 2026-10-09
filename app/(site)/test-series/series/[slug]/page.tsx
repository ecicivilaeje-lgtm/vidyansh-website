import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { testSeriesCatalogue, testSeriesFormats } from "@/content/test-series";
import { Difficulty } from "@/components/test-series/Difficulty";
import { OmrPattern } from "@/components/test-series/OmrPattern";
import { SeriesView } from "@/components/test-series/SeriesView";
import { getPaper, getSeriesProgress, getSeriesTests, getTestSeries, getTestSeriesBySlug } from "@/lib/data";
import { orDash } from "@/lib/format";
import { routes } from "@/lib/routes";

export const dynamicParams = false;
export const generateStaticParams = () => testSeriesCatalogue.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = await getTestSeriesBySlug((await params).slug);
  return { alternates: { canonical: `/test-series/series/${s?.slug}` }, title: `${s?.name} · Vidyansh Test Series`, description: `${s?.name}: exam-pattern tests with detailed solutions, rank and analysis. The first test is free.` };
}

/** Review switch for the five states. Turn off in production with NEXT_PUBLIC_STATE_PREVIEW=off. */
const preview = process.env.NEXT_PUBLIC_STATE_PREVIEW !== "off";

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = await getTestSeriesBySlug(slug);
  if (!series) notFound();
  const [tests, progress, related] = await Promise.all([getSeriesTests(slug), getSeriesProgress(slug), getTestSeries({ exam: series.exam === "multi" ? undefined : series.exam })]);
  const paperId = tests.find((t) => t.paperId)?.paperId;
  const paper = paperId ? await getPaper(paperId) : null;
  const formats = series.formats.map((f) => testSeriesFormats.find((x) => x.id === f)?.short).join(" · ");
  const others = related.filter((s) => s.id !== series.id).slice(0, 3);

  const facts = [
    { label: "Tests", value: orDash(series.testCount) },
    { label: "Questions / test", value: orDash(series.questionsPerTest) },
    { label: "Duration", value: orDash(series.durationMin, " min") },
    { label: "Validity", value: orDash(series.validityDays, " days") },
  ];

  return (
    <>
      <header className="relative overflow-hidden bg-ink pt-[calc(var(--header-h)+clamp(2.5rem,6vw,5rem))] pb-[clamp(3rem,6vw,5rem)]">
        <OmrPattern rows={9} className="pointer-events-none absolute top-[calc(var(--header-h)+2rem)] right-[var(--gutter)] hidden w-36 text-ivory/15 md:block" />
        <div className="container-v relative">
          <nav aria-label="Breadcrumb">
            <ol className="eyebrow flex flex-wrap gap-2">
              <li>
                <Link href="/test-series" className="hover:text-ivory">
                  Test Series
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/test-series/${series.exam}`} className="hover:text-ivory">
                  {series.examLabel}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ivory">
                {series.id}
              </li>
            </ol>
          </nav>
          <h1 className="mt-7 max-w-[16ch] text-[clamp(3.4rem,8vw,8.5rem)] leading-[0.86] tracking-[-0.03em]">{series.name}</h1>
          <p className="mt-5 font-mono text-[0.75rem] tracking-[0.14em] text-body-d uppercase">
            {series.examLabel} · {formats} · {series.subjects.join(" · ")}
          </p>
          <dl className="mt-10 grid max-w-4xl grid-cols-2 border-t border-[var(--line-d)] sm:grid-cols-5">
            {facts.map((f) => (
              <div key={f.label} className="grid gap-1.5 border-b border-[var(--line-d)] py-4 pr-4 sm:border-b-0">
                <dt className="eyebrow">{f.label}</dt>
                <dd className="font-display text-[2rem] leading-none tabular-nums">{f.value}</dd>
              </div>
            ))}
            <div className="grid gap-2.5 border-b border-[var(--line-d)] py-4 sm:border-b-0">
              <dt className="eyebrow">Difficulty</dt>
              <dd>
                <Difficulty level={series.difficulty} showLabel />
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <SeriesView series={series} tests={tests} progress={progress} paper={paper} preview={preview} />

      <section aria-labelledby="analysis-title" className="border-t border-[var(--line-d)] bg-night py-[var(--space-section)]">
        <div className="container-v grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">After every attempt</p>
            <h2 id="analysis-title" className="mt-5 settle text-[clamp(3rem,6vw,6.25rem)] leading-[0.88] tracking-[-0.025em]">
              Know exactly <em className="font-normal">where marks went</em>
            </h2>
            <p className="mt-6 max-w-[42ch] text-body-d">Your report card is ready the moment you submit. These are the figures it holds; they fill in from your own attempt.</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-10 md:grid-cols-3">
            {["Score", "Accuracy", "Time taken", "Rank", "Percentile", "By subject"].map((k) => (
              <div key={k} className="grid content-start gap-3 border-t border-[var(--line-d)] pt-4 pb-10">
                <dt className="eyebrow">{k}</dt>
                <dd className="font-display text-[3.25rem] leading-none text-ivory/35">—</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {others.length > 0 && (
        <section aria-labelledby="more-title" className="border-t border-[var(--line-d)] bg-ink py-[var(--space-block)]">
          <div className="container-v">
            <h2 id="more-title" className="eyebrow text-ivory">
              More for {series.examLabel}
            </h2>
            <ul className="mt-4 border-t border-[var(--line-d)]">
              {others.map((o) => (
                <li key={o.id}>
                  <Link href={routes.series(o.slug)} className="group flex items-baseline justify-between gap-4 border-b border-[var(--line-d)] py-5">
                    <span className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight transition-colors group-hover:text-ivory">{o.name}</span>
                    <span aria-hidden="true" className="text-mute-d group-hover:text-ivory">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
