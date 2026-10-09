import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { seriesTests } from "@/content/test-series";
import { BeginTest } from "@/components/test-series/BeginTest";
import { getPaper, getSeriesTest, getTestSeriesBySlug } from "@/lib/data";
import { routes } from "@/lib/routes";

export const dynamicParams = false;
export const generateStaticParams = () => seriesTests.map((t) => ({ slug: t.seriesSlug, testId: t.id }));

type Params = Promise<{ slug: string; testId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, testId } = await params;
  const [s, t] = await Promise.all([getTestSeriesBySlug(slug), getSeriesTest(slug, testId)]);
  return { title: `${t?.title} · ${s?.name} · Vidyansh`, description: `Instructions for ${t?.title}, part of ${s?.name}.`, robots: { index: false } };
}

/** State 3, "test available": the instructions sheet a candidate reads before beginning. */
export default async function TestInstructionsPage({ params }: { params: Params }) {
  const { slug, testId } = await params;
  const [series, test] = await Promise.all([getTestSeriesBySlug(slug), getSeriesTest(slug, testId)]);
  if (!series || !test) notFound();
  const paper = test.paperId ? await getPaper(test.paperId) : null;

  const subjects = paper ? [...new Set(paper.questions.map((q) => q.subject))] : [];
  const rules = [
    "The clock starts when you begin and counts down on screen. The test submits itself when time runs out.",
    "Move between questions freely using the answer sheet. Your answers save as you go.",
    "Use Mark for review to come back to a question. A marked question that has an answer is still scored.",
    "Clear response removes your answer. An unanswered question scores zero.",
    "After submitting you see your score, accuracy, time taken and the full solution to every question.",
  ];

  return (
    <div className="bg-ink pt-[calc(var(--header-h)+clamp(2rem,5vw,4rem))] pb-[clamp(4rem,8vw,7rem)]">
      <div className="container-v">
        <nav aria-label="Breadcrumb">
          <ol className="eyebrow flex flex-wrap gap-2">
            <li>
              <Link href="/test-series" className="hover:text-ivory">
                Test Series
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={routes.series(slug)} className="hover:text-ivory">
                {series.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ivory">
              {test.title}
            </li>
          </ol>
        </nav>

        {!paper ? (
          <div className="mt-12 max-w-2xl">
            <h1 className="text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.92]">{test.title}</h1>
            <p className="mt-6 text-body-d">This test is locked. It opens on its release date for students who have the series.</p>
            <Link href={`${routes.series(slug)}#access`} className="link-underline mt-8 inline-block font-mono text-xs tracking-[0.16em] uppercase">
              Back to the series →
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-[clamp(2rem,4vw,4rem)]">
            <div>
              <p className="eyebrow text-ivory">{test.isFree ? "Free test · " : ""}Instructions</p>
              <h1 className="mt-4 text-[clamp(2.75rem,5.6vw,5.25rem)] leading-[0.9] tracking-[-0.025em]">{test.title}</h1>
              <p className="mt-4 font-mono text-[0.75rem] tracking-[0.12em] text-body-d uppercase">
                {series.name} · {paper.title}
              </p>

              <dl className="mt-12 grid grid-cols-2 gap-x-8 sm:grid-cols-4">
                {[
                  ["Questions", String(paper.questions.length)],
                  ["Duration", `${paper.durationMin} min`],
                  ["Correct", `+${paper.marking.correct}`],
                  ["Wrong", `${paper.marking.wrong}`],
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-2 border-t border-[var(--line-d)] pt-4 pb-6">
                    <dt className="eyebrow">{k}</dt>
                    <dd className="font-display text-[2.25rem] leading-none tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>

              <h2 className="eyebrow mt-10">Sections</h2>
              <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
                {subjects.map((s) => (
                  <li key={s} className="text-body-d after:ml-2 after:text-mute-d after:content-['·'] last:after:content-none">
                    {s}
                  </li>
                ))}
              </ul>

              <h2 className="eyebrow mt-10">Read before you begin</h2>
              <ol className="mt-3 border-t border-[var(--line-d)]">
                {rules.map((r, i) => (
                  <li key={r} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-[var(--line-d)] py-4 text-body-d">
                    <span className="font-mono text-xs text-mute-d">{String(i + 1).padStart(2, "0")}</span>
                    {r}
                  </li>
                ))}
              </ol>

              <h2 className="eyebrow mt-10">Answer sheet key</h2>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-body-d">
                <li className="flex items-center gap-2"><span aria-hidden="true" className="size-4 rounded-full border border-ok bg-ok" />Answered</li>
                <li className="flex items-center gap-2"><span aria-hidden="true" className="size-4 rounded-full border border-mark" />Marked for review</li>
                <li className="flex items-center gap-2"><span aria-hidden="true" className="size-4 rounded-full border border-mute-d bg-ivory/15" />Visited, not answered</li>
                <li className="flex items-center gap-2"><span aria-hidden="true" className="size-4 rounded-full border border-mute-d" />Not seen</li>
              </ul>
            </div>

            <aside aria-label="Begin the test" className="on-light on-parchment bg-parchment p-[clamp(1.25rem,2.6vw,1.75rem)] text-ink lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <p className="eyebrow">Candidate declaration</p>
              <p className="mt-3 mb-6 font-display text-[1.75rem] leading-tight">Take it as you would on the day.</p>
              <BeginTest slug={slug} testId={testId} languages={paper.languages} />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
