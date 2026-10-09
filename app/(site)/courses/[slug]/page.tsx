import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CoursePlate, plateCaption } from "@/components/courses/CoursePlate";
import { SyllabusList } from "@/components/courses/SyllabusList";
import { WeekStrip } from "@/components/courses/WeekStrip";
import { courses as allCourses } from "@/content/courses";
import { examByCode } from "@/content/exams";
import { mentor } from "@/content/mentor";
import { getCourseBySlug, getCourses, testSeriesFor } from "@/lib/data/courses";

export const dynamicParams = false;
export const generateStaticParams = () => allCourses.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const course = await getCourseBySlug((await params).slug);
  if (!course) return {};
  return { alternates: { canonical: `/courses/${course.slug}` }, title: `${course.name} · Vidyansh`, description: `${course.lead} ${course.mode}, ${course.duration}. Syllabus, weekly rhythm and what the course includes.` };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** The Specification Sheet: a split hero, a long main column with a sticky enrolment rail, then a dark band. */
export default async function CourseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();
  const courses = await getCourses();
  const index = courses.findIndex((c) => c.slug === course.slug);
  const exam = examByCode(course.exam);
  const series = testSeriesFor(course.practiceExam);
  const others = courses.filter((c) => c.slug !== course.slug);
  const reserve = `/contact?course=${course.slug}`;

  const facts = [
    ["Mode", course.mode],
    ["Duration", course.duration],
    ["Next batch", course.nextBatch],
  ] as const;

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "syllabus", label: "Syllabus" },
    { id: "week", label: "How a week runs" },
    { id: "included", label: "What's included" },
  ];

  const courseLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.lead,
    provider: { "@type": "EducationalOrganization", name: "Vidyansh" },
    inLanguage: ["en", "hi"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseLd) }} />
      {/* ---------- Split hero ---------- */}
      <header className="grid lg:min-h-svh lg:grid-cols-2">
        <figure className="plate-sheet relative overflow-hidden max-lg:order-2 max-md:aspect-[4/5] md:max-lg:aspect-[4/3]">
          <div className="absolute inset-0 lg:inset-y-[var(--header-h)]">
            {course.image ? (
              <Image src={course.image.src} alt={course.image.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            ) : (
              <CoursePlate plate={course.plate} index={index} label={course.title[0]} />
            )}
          </div>
          <span aria-hidden="true" className="crosshair top-5 left-5 lg:top-[calc(var(--header-h)+1.25rem)]" />
          <figcaption className="absolute bottom-[clamp(1.25rem,3vw,2.5rem)] left-[clamp(1.25rem,3vw,2.5rem)] max-lg:hidden">
            <dl className="grid grid-cols-[auto_auto] border border-[var(--hair)] bg-ink/85 font-mono text-[0.625rem] font-medium tracking-[0.16em] uppercase">
              {[
                ["Drawing", course.name],
                ["Plate", pad(index + 1)],
                ["Subject", course.image ? "Photograph" : plateCaption(course.plate)],
                ["Scale", "NTS"],
              ].map(([k, v], i) => (
                <div key={k} className={`contents ${i ? "[&>*]:border-t [&>*]:border-[var(--hair)]" : ""}`}>
                  <dt className="border-r border-[var(--hair)] px-3 py-2 text-mute-d">{k}</dt>
                  <dd className="px-3 py-2 text-ivory">{v}</dd>
                </div>
              ))}
            </dl>
          </figcaption>
        </figure>

        <div className="on-light grid content-center gap-[clamp(2.25rem,4vw,3.5rem)] bg-ivory px-[var(--gutter)] pt-[calc(var(--header-h)+clamp(3rem,7vw,6rem))] pb-[clamp(3.5rem,7vw,6rem)] text-ink lg:px-[clamp(2.5rem,5.5vw,6.5rem)]">
          <nav aria-label="Breadcrumb" className="eyebrow">
            <Link href="/courses" className="link-underline">
              Courses
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{course.name}</span>
          </nav>
          <div className="grid gap-6">
            <p className="eyebrow">{course.category}</p>
            <h1 aria-label={course.name} className="text-[clamp(4rem,9vw,9.5rem)] leading-[0.84] font-normal tracking-[-0.04em]">
              <span className="hero-mask block">
                <span className="hero-rise block">{course.title[0]}</span>
              </span>{" "}
              <span className="hero-mask block">
                <em className="hero-rise hero-rise-2 block font-normal">{course.title[1]}</em>
              </span>
            </h1>
            <p className="hero-fade max-w-[30ch] font-display text-[clamp(1.375rem,2vw,1.875rem)] leading-snug text-ink/80">{course.lead}</p>
          </div>
          <dl className="hero-fade-late grid grid-cols-3 gap-4 border-t border-ink pt-5">
            {facts.map(([k, v]) => (
              <div key={k} className="grid content-start gap-1.5">
                <dt className="eyebrow">{k}</dt>
                <dd className="font-display text-[clamp(1.125rem,1.6vw,1.5rem)] leading-tight">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="lg:hidden">
            <Button href={reserve} tone="light" diamond>
              Reserve your seat
            </Button>
          </div>
        </div>
      </header>

      {/* ---------- Specification body ---------- */}
      <div className="on-light bg-ivory text-ink">
        <div className="container-v grid gap-[var(--space-block)] border-t border-ink py-[var(--space-section)] lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-[clamp(3rem,6vw,7rem)]">
          <div className="grid min-w-0 gap-[var(--space-block)]">
            <nav aria-label="On this page" className="flex flex-wrap gap-x-7 gap-y-2">
              {sections.map((s, i) => (
                <a key={s.id} href={`#${s.id}`} className="link-underline font-mono text-[0.6875rem] font-medium tracking-[0.16em] uppercase">
                  <span className="text-mute-l">{pad(i + 1)}</span> {s.label}
                </a>
              ))}
            </nav>

            <section id="overview" aria-labelledby="overview-title" className="grid scroll-mt-24 gap-8">
              <SectionHead n={1} id="overview-title" title={["The course ", "in brief"]} />
              <div className="grid max-w-[60ch] gap-6 text-[1.1875rem] text-mute-l">
                {(course.overview ?? [course.lead]).map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </section>

            {course.modules && (
              <section id="syllabus" aria-labelledby="syllabus-title" className="grid scroll-mt-24 gap-8">
                <SectionHead n={2} id="syllabus-title" title={["The ", "syllabus"]} />
                <div className="grid gap-2">
                  <p className="eyebrow">Indicative syllabus · confirm against the official notification</p>
                  {course.syllabusNote && <p className="text-[0.9375rem] text-mute-l">{course.syllabusNote}</p>}
                </div>
                <SyllabusList modules={course.modules} />
              </section>
            )}

            {course.week && (
              <section id="week" aria-labelledby="week-title" className="grid scroll-mt-24 gap-8">
                <SectionHead n={3} id="week-title" title={["How a ", "week", " runs"]} />
                <p className="max-w-[52ch] text-[1.0625rem] text-mute-l">A typical week. The order shifts with the syllabus, but the rhythm holds.</p>
                <WeekStrip week={course.week} />
              </section>
            )}

            {course.included && (
              <section id="included" aria-labelledby="included-title" className="grid scroll-mt-24 gap-8">
                <SectionHead n={4} id="included-title" title={["What’s ", "included"]} />
                <ul className="border-t border-ink">
                  {course.included.map((item) => (
                    <li key={item.title} className="grid gap-x-8 gap-y-1 border-b border-[var(--line-l)] py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-baseline">
                      <span className="flex items-baseline gap-4 font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-tight">
                        <span aria-hidden="true" className="inline-block size-[6px] shrink-0 -translate-y-[0.25em] rotate-45 bg-ink" />
                        {item.title}
                      </span>
                      <span className="text-mute-l max-sm:pl-[calc(6px+1rem)]">{item.body}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Enrolment rail */}
          <aside aria-labelledby="rail-title" className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <div className="grid gap-7 border-t border-ink pt-6">
              <h2 id="rail-title" className="eyebrow">
                Enrolment
              </h2>
              <p className="font-display text-[1.75rem] leading-tight">
                {course.title[0]} <em className="font-normal">{course.title[1]}</em>
              </p>
              <dl>
                {[...facts, ["Fee", "Fee to be announced"] as const].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-[var(--line-l)] py-3">
                    <dt className="eyebrow">{k}</dt>
                    <dd className={`text-right font-mono text-[0.8125rem] tracking-[0.06em] ${k === "Fee" ? "text-mute-l" : ""}`}>{v}</dd>
                  </div>
                ))}
              </dl>
              <Button href={reserve} tone="light" diamond className="w-full">
                Reserve your seat
                <span className="sr-only"> in {course.name}</span>
              </Button>
              {series ? (
                <Link href={`/test-series/${series.code}`} className="group link-underline justify-self-start font-mono text-xs font-medium tracking-[0.16em] uppercase">
                  {series.label} test series{" "}
                  <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              ) : (
                <p className="eyebrow">{exam?.name ?? course.title[0]} test series to be announced</p>
              )}
              <p className="text-[0.9375rem] text-mute-l">
                Batch dates and fees are confirmed when you enquire. Classes in Hindi and English.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ---------- Dark band: mentor and other directions ---------- */}
      <section aria-labelledby="mentor-title" className="scene-surface bg-ink py-[var(--space-section)] text-ivory">
        <div className="container-v grid gap-[var(--space-section)]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end">
            <div className="grid gap-5">
              <p className="eyebrow">Taught by</p>
              <h2 id="mentor-title" className="settle text-[clamp(3.5rem,8vw,8rem)] leading-[0.86] tracking-[-0.035em]">
                {mentor.name.split(" ")[0]} <em className="font-normal">{mentor.name.split(" ").slice(1).join(" ")}</em>
              </h2>
            </div>
            <div className="grid gap-6">
              <p className="max-w-[48ch] text-[1.125rem] text-body-d">{mentor.bio}</p>
              <Link href="/faculty" className="group link-underline justify-self-start font-mono text-xs font-medium tracking-[0.16em] uppercase">
                Meet the faculty{" "}
                <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="grid gap-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] leading-none">
                Other <em className="font-normal">directions</em>
              </h2>
              <Link href="/courses" className="link-underline eyebrow">
                All courses →
              </Link>
            </div>
            <ul className="border-t border-ivory/40">
              {others.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/courses/${c.slug}`}
                    className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-2 border-b border-[var(--line-d)] py-[clamp(1.5rem,3vw,2.5rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)_auto]"
                  >
                    <span className="font-display text-[clamp(2.5rem,6vw,5.75rem)] leading-[0.9] tracking-[-0.03em] transition-[font-style] group-hover:italic">
                      {c.title[0]} <em className="font-normal">{c.title[1]}</em>
                    </span>
                    <span className="eyebrow max-md:col-start-1 max-md:row-start-2">{c.mode} · {c.duration}</span>
                    <span aria-hidden="true" className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-none transition-transform duration-500 ease-out-expo group-hover:translate-x-3 max-md:row-span-2 max-md:self-center">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({ n, id, title }: { n: number; id: string; title: string[] }) {
  return (
    <div className="grid gap-4">
      <span className="font-mono text-xs tracking-[0.14em] text-mute-l">{pad(n)}</span>
      <h2 id={id} className="settle text-[clamp(2.75rem,5.5vw,5.25rem)] leading-[0.9] tracking-[-0.03em]">
        {title.map((t, i) => (i === 1 ? <em key={i} className="font-normal">{t}</em> : <span key={i}>{t}</span>))}
      </h2>
    </div>
  );
}
