import Link from "next/link";
import { examByCode } from "@/content/exams";
import type { Course } from "@/lib/types";

const rows: { label: string; value: (c: Course) => string }[] = [
  { label: "Exam", value: (c) => examByCode(c.exam)?.name ?? c.title[0] },
  { label: "Mode", value: (c) => c.mode },
  { label: "Duration", value: (c) => c.duration },
  { label: "Next batch", value: (c) => c.nextBatch },
  { label: "Test series", value: (c) => c.testSeries ?? "—" },
  { label: "Live doubt hours", value: (c) => c.liveDoubts ?? "—" },
  { label: "Medium", value: (c) => c.medium ?? "—" },
  { label: "Fee", value: () => "To be announced" },
];

/** "Which course fits you?" A real comparison table, courses as columns, scrollable on phones. */
export function CourseMatrix({ courses }: { courses: Course[] }) {
  return (
    <section aria-labelledby="matrix-title" className="scene-surface bg-ink py-[var(--space-section)] text-ivory">
      <div className="container-v grid gap-[var(--space-block)]">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2 id="matrix-title" className="settle text-[clamp(3.25rem,8vw,8.5rem)] leading-[0.86] tracking-[-0.035em]">
            Which course <em className="font-normal">fits</em> you?
          </h2>
          <p className="max-w-[38ch] text-[1.125rem] text-body-d">
            The same facts, side by side. Read across a row to compare, or down a column to see one course whole.
          </p>
        </div>

        <div role="region" aria-label="Course comparison table, scrolls sideways" tabIndex={0} className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] pb-4 lg:mx-0 lg:px-0">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">Comparison of Vidyansh courses by exam, mode, duration, next batch, test series, live doubt hours, medium and fee</caption>
            <thead>
              <tr className="border-y border-ivory/40">
                <td className="w-[11rem] py-6" />
                {courses.map((c, i) => (
                  <th key={c.slug} scope="col" className="py-6 pr-6 align-bottom font-normal">
                    <span className="block font-mono text-[0.6875rem] tracking-[0.14em] text-mute-d">{String(i + 1).padStart(2, "0")}</span>
                    <Link href={`/courses/${c.slug}`} className="group mt-2 inline-block font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.05]">
                      <span className="transition-[font-style] group-hover:italic">{c.title[0]}</span>
                      <br />
                      <em>{c.title[1]}</em>
                      <span aria-hidden="true" className="ml-2 inline-block text-mute-d transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                        →
                      </span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-[var(--line-d)]">
                  <th scope="row" className="eyebrow py-5 pr-6 align-top font-medium">
                    {r.label}
                  </th>
                  {courses.map((c) => {
                    const v = r.value(c);
                    return (
                      <td key={c.slug} className={`py-5 pr-6 align-top text-[1rem] leading-snug ${v === "—" || v === "To be announced" ? "text-mute-d" : "text-body-d"}`}>
                        {v}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="eyebrow">Batch dates and fees are placeholders until the schedule is published.</p>
      </div>
    </section>
  );
}
