import type { Metadata } from "next";
import Link from "next/link";
import { DepartmentRow } from "@/components/faculty/DepartmentRow";
import { FounderFeature } from "@/components/faculty/FounderFeature";
import { facultyPage } from "@/content/faculty";
import { getDepartments, getFounder, getTeachingStatements } from "@/lib/data/people";

export const metadata: Metadata = {
  alternates: { canonical: "/faculty" },
  title: "Faculty · Vidyansh",
  description: "Shubham Sir and the Vidyansh faculty: Civil, Electrical, Mechanical, and General Studies & Reasoning for SSC JE, RRB JE and State AE / JE.",
};

export default async function FacultyPage() {
  const [founder, departments, statements] = await Promise.all([getFounder(), getDepartments(), getTeachingStatements()]);

  return (
    <>
      {/* An ink band under the fixed header, then the ivory page. */}
      <div aria-hidden="true" className="h-[var(--header-h)] bg-ink" />

      {/* I. The masthead */}
      <section aria-labelledby="faculty-title" className="on-light bg-ivory pt-[clamp(4rem,9vw,8rem)] pb-[var(--space-block)] text-ink">
        <div className="container-v">
          <p className="eyebrow">{facultyPage.eyebrow}</p>
          <h1 id="faculty-title" className="mt-6 text-[clamp(4.25rem,14vw,12.5rem)] leading-[0.82] tracking-[-0.045em]">
            Who <em className="font-normal">teaches</em> here
          </h1>

          <div className="mt-[var(--space-block)] grid gap-12 border-t-2 border-ink pt-8 lg:grid-cols-12">
            <p className="max-w-[40ch] text-[1.1875rem] text-mute-l lg:col-span-4">{facultyPage.intro}</p>
            {/* Credits, set like a magazine masthead. */}
            <dl className="grid gap-x-12 sm:grid-cols-2 lg:col-span-8">
              <div className="flex items-baseline gap-3 border-b border-[var(--line-l)] py-3">
                <dt className="eyebrow shrink-0">{founder.role}</dt>
                <span aria-hidden="true" className="min-w-4 flex-1 border-b border-dotted border-ink/30" />
                <dd>
                  <a href="#founder-name" className="link-underline font-display text-[1.35rem] leading-none">
                    {founder.name}
                  </a>
                </dd>
              </div>
              {departments.map((d) => (
                <div key={d.id} className="flex items-baseline gap-3 border-b border-[var(--line-l)] py-3">
                  <dt className="eyebrow shrink-0">
                    <a href={`#${d.id}`} className="link-underline">
                      {d.name}
                    </a>
                  </dt>
                  <span aria-hidden="true" className="min-w-4 flex-1 border-b border-dotted border-ink/30" />
                  <dd className="font-display text-[1.2rem] leading-none text-mute-l italic">To come</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* II. Lead feature */}
      <section aria-label="Founder" className="on-light bg-ivory pb-[var(--space-section)] text-ink">
        <div className="container-v">
          <FounderFeature founder={founder} />
        </div>
      </section>

      {/* III. Departments */}
      <section aria-labelledby="departments-title" className="on-light border-t border-[var(--line-l)] bg-ivory py-[var(--space-section)] text-ink">
        <div className="container-v">
          <div className="grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <p className="eyebrow">Departments</p>
              <h2 id="departments-title" className="settle mt-5 text-[clamp(3.25rem,8vw,8rem)] leading-[0.88] tracking-[-0.03em]">
                Four <em className="font-normal">desks</em>
              </h2>
            </div>
            <p className="max-w-[32ch] text-mute-l md:pb-3">Each department owns its subjects end to end: lectures, notes, practice and doubts.</p>
          </div>
          <ol className="mt-[var(--space-block)] border-t-2 border-ink">
            {departments.map((d, i) => (
              <DepartmentRow key={d.id} dept={d} index={i} />
            ))}
          </ol>
          <p className="eyebrow mt-8">Faculty names and profiles are published only once each teacher has supplied them</p>
        </div>
      </section>

      {/* IV. How we teach */}
      <section aria-labelledby="teach-title" className="scene-surface bg-ink py-[var(--space-section)]">
        <div className="container-v">
          <h2 id="teach-title">
            <span className="eyebrow">How we teach</span>
          </h2>
          <ol className="mt-10 border-t border-ivory/40">
            {statements.map((s) => {
              const [before, after] = s.statement.split(s.accent);
              return (
                <li key={s.n} className="grid gap-4 border-b border-[var(--line-d)] py-[clamp(2rem,4vw,3.5rem)] md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,18rem)] md:items-baseline md:gap-8">
                  <span className="font-mono text-[0.8125rem] tracking-[0.14em] text-mute-d tabular-nums">{s.n}</span>
                  <p className="font-display text-[clamp(2.25rem,5vw,5rem)] leading-[0.95] tracking-[-0.02em] text-balance">
                    {before}
                    <em className="font-normal">{s.accent}</em>
                    {after}
                  </p>
                  <p className="text-body-d">{s.body}</p>
                </li>
              );
            })}
          </ol>
          <div className="mt-[var(--space-block)] flex flex-wrap gap-x-12 gap-y-6">
            <Link href="/courses" className="group inline-flex items-baseline gap-3 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none">
              <span className="link-underline">See the courses</span>
              <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                →
              </span>
            </Link>
            <Link href="/about" className="group inline-flex items-baseline gap-3 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none text-body-d">
              <span className="link-underline">
                Why Vidyansh <em className="font-normal">exists</em>
              </span>
              <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
