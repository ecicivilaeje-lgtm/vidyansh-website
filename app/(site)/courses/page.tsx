import type { Metadata } from "next";
import Link from "next/link";
import { CourseIndex } from "@/components/courses/CourseIndex";
import { CourseMatrix } from "@/components/courses/CourseMatrix";
import { getCourses } from "@/lib/data/courses";

export const metadata: Metadata = {
  alternates: { canonical: "/courses" },
  title: "Courses · Vidyansh",
  description:
    "Vidyansh courses for SSC JE, RRB JE and State AE / JE, led by Shubham Sir. Compare mode, duration and what each course includes.",
};

/** The Prospectus: a dark masthead, a ruled ivory index with filters, a dark comparison matrix. */
export default async function CoursesPage() {
  const courses = await getCourses();
  const count = String(courses.length).padStart(2, "0");

  return (
    <>
      <header className="drafting-grid relative overflow-hidden bg-ink pt-[calc(var(--header-h)+clamp(4rem,10vw,9rem))] pb-[var(--space-block)] text-ivory">
        <span aria-hidden="true" className="crosshair top-[calc(var(--header-h)+1.5rem)] right-[var(--gutter)]" />
        <div className="container-v grid gap-[clamp(3rem,6vw,5rem)]">
          <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_auto]">
            <h1 aria-label="Every direction, one destination" className="text-[clamp(4rem,11.5vw,11.5rem)] leading-[0.84] tracking-[-0.04em]">
              <span className="hero-mask block">
                <span className="hero-rise block">Every <em className="font-normal">direction,</em></span>
              </span>{" "}
              <span className="hero-mask block">
                <span className="hero-rise hero-rise-2 block">one destination</span>
              </span>
            </h1>

            <div className="hero-fade grid justify-items-start gap-6 lg:justify-items-end">
              <p className="font-display text-[clamp(7rem,17vw,16rem)] leading-[0.78] font-normal tracking-[-0.05em] tabular-nums" aria-hidden="true">
                {count}
              </p>
              <p className="eyebrow">
                <span className="sr-only">{courses.length} </span>Courses, each led by Shubham Sir
              </p>
            </div>
          </div>

          <div className="hero-fade-late grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <p className="max-w-[40ch] text-[1.1875rem] text-body-d">
              Each course is built around one exam&rsquo;s real pattern and taught from first principles. Choose by exam, choose by how you like to learn.
            </p>
            <div className="dimension self-end" aria-hidden="true">
              <span className="-translate-y-1/2 bg-ink px-3 font-mono text-[0.625rem] tracking-[0.16em] text-mute-d uppercase">Hindi and English medium</span>
            </div>
          </div>
        </div>
      </header>

      <section aria-label="Course index" className="scene-sheet on-light bg-ivory py-[var(--space-section)] text-ink">
        <div className="container-v">
          <CourseIndex courses={courses} />
        </div>
      </section>

      <CourseMatrix courses={courses} />

      <section aria-label="Enquiry" className="on-light bg-ivory py-[var(--space-block)] text-ink">
        <div className="container-v flex flex-wrap items-baseline justify-between gap-x-10 gap-y-6 border-t border-ink pt-10">
          <p className="max-w-[34ch] font-display text-[clamp(1.75rem,3vw,2.625rem)] leading-tight">
            Not sure which one is yours? <em className="font-normal">Ask us.</em>
          </p>
          <Link href="/contact" className="group link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase">
            Talk to the Vidyansh team{" "}
            <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
