"use client";

import Image from "next/image";
import Link from "next/link";
import { useExam } from "@/components/providers/ExamProvider";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { Button } from "@/components/ui/Button";
import { CoursePlate, plateCaption } from "@/components/courses/CoursePlate";
import { examByCode } from "@/content/exams";
import type { Course } from "@/lib/types";

/**
 * LEARN: each course is a full-width editorial spread, image on one side and the
 * story on the other, alternating sides as you read down the chapter.
 */
export function Courses({ courses }: { courses: Course[] }) {
  return (
    <section id="courses" aria-labelledby="courses-title" className="scene-sheet on-light bg-ivory pt-[var(--space-section)] text-ink">
      <ChapterMark numeral="II" name="Learn" note="Courses" className="container-v mb-[var(--space-block)]" />

      <div className="container-v grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-[clamp(3rem,7vw,8rem)]">
        <h2 id="courses-title" className="settle text-[clamp(3.75rem,9.5vw,10.5rem)] leading-[0.84] tracking-[-0.035em]">
          Choose your <em className="font-normal">direction</em>
        </h2>
        <div className="grid gap-8">
          <p className="max-w-[36ch] text-[1.1875rem] text-mute-l">
            Three courses, each led by Shubham Sir and built around one exam&rsquo;s real pattern. Every course includes its matching test series.
          </p>
          <nav aria-label="Courses in this chapter">
            <ol className="border-t border-ink">
              {courses.map((c, i) => (
                <li key={c.slug}>
                  <a href={`#course-${c.slug}`} className="group flex items-baseline gap-4 border-b border-[var(--line-l)] py-3">
                    <span className="font-mono text-xs text-mute-l">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-[1.375rem] leading-tight transition-[font-style] group-hover:italic">{c.name}</span>
                    <span aria-hidden="true" className="ml-auto text-mute-l transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5">
                      ↓
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <p className="eyebrow">Hindi and English medium available</p>
        </div>
      </div>

      <ol className="mt-[var(--space-section)]">
        {courses.map((c, i) => (
          <li key={c.slug}>
            <CoursePanel course={c} index={i} total={courses.length} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function CoursePanel({ course: c, index, total }: { course: Course; index: number; total: number }) {
  const { exam, setExam } = useExam();
  const mine = exam === c.exam;
  const flip = index % 2 === 1;
  const titleId = `course-${c.slug}-title`;
  const practice = c.practiceExam && examByCode(c.practiceExam);

  return (
    <article id={`course-${c.slug}`} aria-labelledby={titleId} className="course-panel grid scroll-mt-16 border-t border-ink lg:grid-cols-2">
      <figure className={`plate-sheet relative overflow-hidden max-md:aspect-[4/5] md:max-lg:aspect-[4/3] lg:sticky lg:top-0 lg:h-[min(100svh,62.5vw)] lg:self-start ${flip ? "lg:order-2" : ""}`}>
        <div className="course-panel__art absolute inset-0">
          {c.image ? (
            <Image src={c.image.src} alt={c.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          ) : (
            <CoursePlate plate={c.plate} index={index} label={c.title[0]} />
          )}
        </div>
        <figcaption className="absolute top-5 left-5 grid gap-1 bg-ink/85 py-1.5 pr-3 lg:top-auto lg:bottom-[clamp(1.25rem,3vw,2.5rem)] lg:left-[clamp(1.25rem,3vw,2.5rem)]">
          <span className="eyebrow text-ivory">{c.title[0]}</span>
          {!c.image && <span className="font-mono text-[0.625rem] tracking-[0.14em] text-mute-d uppercase">{plateCaption(c.plate)}</span>}
        </figcaption>
      </figure>

      <div className="grid content-center gap-[clamp(2.25rem,4vw,3.5rem)] px-[var(--gutter)] py-[clamp(3.5rem,8vw,7rem)] lg:px-[clamp(2.5rem,5.5vw,6.5rem)]">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="font-mono text-xs tracking-[0.12em] text-mute-l">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="eyebrow">{c.category}</span>
          {mine && <span className="border-b border-ink pb-0.5 font-mono text-[0.625rem] tracking-[0.14em] text-ink uppercase">Your exam</span>}
        </div>

        <div className="grid gap-6">
          <h3 id={titleId} className="settle font-display text-[clamp(3.75rem,7.6vw,8.25rem)] leading-[0.86] font-normal tracking-[-0.035em]">
            {c.title[0]}
            <br />
            <em>{c.title[1]}</em>
          </h3>
          <p className="max-w-[30ch] font-display text-[clamp(1.375rem,1.9vw,1.75rem)] leading-snug text-ink/80">{c.lead}</p>
        </div>

        <ol aria-label="Key benefits" className="border-t border-ink">
          {c.benefits.map((b, n) => (
            <li key={b.title} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-[var(--line-l)] py-4">
              <span className="font-display text-lg text-mute-l italic">{["i", "ii", "iii", "iv"][n]}</span>
              <span className="font-display text-[1.375rem] leading-tight">{b.title}</span>
              <span className="col-start-2 max-w-[48ch] text-[0.9375rem] text-mute-l">{b.body}</span>
            </li>
          ))}
        </ol>

        <dl className="grid grid-cols-3 gap-4">
          {[
            ["Mode", c.mode],
            ["Duration", c.duration],
            ["Next batch", c.nextBatch],
          ].map(([k, v]) => (
            <div key={k} className="grid content-start gap-1.5">
              <dt className="eyebrow">{k}</dt>
              <dd className="font-display text-[clamp(1.125rem,1.5vw,1.375rem)] leading-tight">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
          <Button href="/#start" tone="light" diamond onClick={() => setExam(c.exam)}>
            Reserve your seat
            <span className="sr-only"> in {c.name}</span>
          </Button>
          <Link href={`/courses/${c.slug}`} className="link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase">
            Course details →<span className="sr-only">: {c.name}</span>
          </Link>
          {practice && (
            <Link href={`/test-series/${practice.code}`} className="link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase">
              {practice.name} test series →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
