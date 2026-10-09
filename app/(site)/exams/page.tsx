import type { Metadata } from "next";
import Link from "next/link";
import { ExamLine } from "@/components/exams/ExamLine";
import { RouteNetwork } from "@/components/exams/RouteNetwork";
import { getCourses, getExams, testSeriesFor } from "@/lib/data/courses";
import { getBlogPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  alternates: { canonical: "/exams" },
  title: "Exams · Vidyansh",
  description:
    "The route through SSC JE, RRB JE, State AE / JE and AE / JE: who each exam is for, eligibility in general terms, and the stages from notification to destination.",
};

const pad = (n: number) => String(n).padStart(2, "0");

/** The Route Map: every exam drawn as a transit line, stage by stage, on one dark sheet. */
export default async function ExamsPage() {
  const [exams, courses, guides] = await Promise.all([getExams(), getCourses(), getBlogPosts()]);

  return (
    <div className="bg-ink text-ivory">
      {/* The route drawing is the opening image; the title sits above it at a quieter size. */}
      <header className="drafting-grid relative pt-[calc(var(--header-h)+clamp(2.5rem,6vw,5rem))] pb-[var(--space-block)]">
        <div className="container-v grid gap-[clamp(2rem,4vw,3.5rem)]">
          <h1 className="text-[clamp(3rem,6.5vw,6.75rem)] leading-[0.88] tracking-[-0.035em]">
            <span className="hero-mask block">
              <span className="hero-rise block">
                Know the <em className="font-normal">route</em> before you travel
              </span>
            </span>
          </h1>
          <div className="hero-fade-late">
            <RouteNetwork exams={exams} />
          </div>
          <div className="hero-fade grid gap-8 border-t border-[var(--line-d)] pt-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
            <p className="max-w-[46ch] text-[1.1875rem] text-body-d">
              Each exam is drawn as a line, with a stop for every stage between the notification and the destination. Find yours, see who it is for, and where Vidyansh travels with you.
            </p>
            <p className="border-l border-ivory/40 pl-5 font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-snug italic">
              Patterns change. Always confirm against the official notification.
            </p>
          </div>
        </div>
      </header>

      <nav aria-label="Exams on this page" className="sticky top-0 z-30 border-y border-[var(--line-d)] bg-ink/90 backdrop-blur-xl">
        <ol className="container-v flex gap-x-8 overflow-x-auto py-4 [scrollbar-width:none]">
          {exams.map((e, i) => (
            <li key={e.code} className="shrink-0">
              <a href={`#${e.code}`} className="group flex items-baseline gap-2.5 whitespace-nowrap">
                <span className="font-mono text-[0.625rem] tracking-[0.14em] text-mute-d">L{i + 1}</span>
                <span className="link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase">{e.name}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="container-v pb-[var(--space-section)]">
        {exams.map((e, i) => {
          const course = courses.find((c) => c.exam === e.code);
          const series = testSeriesFor(e.code);
          return (
            <section
              key={e.code}
              id={e.code}
              aria-labelledby={`${e.code}-title`}
              className="scene-surface grid scroll-mt-20 gap-[clamp(2.5rem,5vw,4.5rem)] border-t border-ivory/40 pt-[clamp(2.5rem,5vw,4rem)] mt-[var(--space-block)] first:mt-[clamp(4rem,8vw,7rem)]"
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
                <div className="grid gap-4">
                  <p className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                    <span className="font-mono text-xs tracking-[0.14em] text-mute-d">LINE {pad(i + 1)}</span>
                    <span className="eyebrow">{e.fullName}</span>
                  </p>
                  <h2 id={`${e.code}-title`} className="settle text-[clamp(3.75rem,10vw,9.5rem)] leading-[0.84] tracking-[-0.04em]">
                    {e.name}
                  </h2>
                </div>
                {e.routeNote && <p className="font-display text-[clamp(1.25rem,1.8vw,1.5rem)] leading-snug text-body-d italic">{e.routeNote}</p>}
              </div>

              {e.stages && <ExamLine stages={e.stages} label={e.name} />}

              <div className="grid gap-x-12 gap-y-8 border-t border-[var(--line-d)] pt-8 md:grid-cols-3">
                <div className="grid content-start gap-2">
                  <h3 className="eyebrow">Who it is for</h3>
                  <p className="text-[1.0625rem] text-body-d">{e.forWhom}</p>
                </div>
                <div className="grid content-start gap-2">
                  <h3 className="eyebrow">Eligibility, in general terms</h3>
                  <p className="text-[1.0625rem] text-body-d">{e.eligibility}</p>
                </div>
                <div className="grid content-start gap-3">
                  <h3 className="eyebrow">Travel with Vidyansh</h3>
                  <ul className="grid gap-3">
                    {course ? (
                      <li>
                        <Link href={`/courses/${course.slug}`} className="group font-display text-[1.5rem] leading-tight">
                          <span className="link-underline">{course.name}</span>{" "}
                          <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                            →
                          </span>
                        </Link>
                      </li>
                    ) : (
                      <li className="text-[1rem] text-mute-d">Course to be announced</li>
                    )}
                    {series ? (
                      <li>
                        <Link href={`/test-series/${series.code}`} className="group font-mono text-xs font-medium tracking-[0.16em] uppercase">
                          <span className="link-underline">{series.label} test series</span>{" "}
                          <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                            →
                          </span>
                        </Link>
                      </li>
                    ) : (
                      <li className="font-mono text-xs tracking-[0.16em] text-mute-d uppercase">Test series to be announced</li>
                    )}
                    {guides
                      .filter((g) => g.exam === e.code)
                      .map((g) => (
                        <li key={g.slug}>
                          <Link href={`/blog/${g.slug}`} className="group font-mono text-xs font-medium tracking-[0.16em] uppercase">
                            <span className="link-underline">Read the {g.short.join(" ")} guide</span>{" "}
                            <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              <p className="eyebrow">Stages shown in outline · confirm against the official notification</p>
            </section>
          );
        })}

        <div className="mt-[var(--space-section)] grid gap-8 border-t border-ivory/40 pt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-baseline">
          <p className="max-w-[30ch] font-display text-[clamp(1.75rem,3vw,2.625rem)] leading-tight">
            Not sure which line is <em className="font-normal">yours?</em>
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Link href="/courses" className="link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase">
              Compare courses →
            </Link>
            <Link href="/contact" className="link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase">
              Ask the Vidyansh team →
            </Link>
          </div>
        </div>
        <p className="mt-10 eyebrow">Patterns change. Always confirm against the official notification.</p>
      </div>
    </div>
  );
}
