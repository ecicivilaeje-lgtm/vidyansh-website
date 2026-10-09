"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { exams, examByCode } from "@/content/exams";
import { journeyStages, week, type WeekBlock } from "@/content/journey";
import { useExam } from "@/components/providers/ExamProvider";
import { Button } from "@/components/ui/Button";
import { Star } from "@/components/ui/Star";
import type { ExamCode } from "@/lib/types";

const BACKGROUNDS = ["#f4eee2", "#e5ddcd", "#d8cfbd", "#c9beaa", "#f4eee2"];
const CHAPTER_BG = ["bg-ink", "bg-charcoal", "bg-graphite", "bg-stone text-ink on-light on-stone", "bg-ivory text-ink on-light"];

export function ExamJourney() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  /* Pin only on large screens with motion allowed; otherwise chapters stack as normal sections. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem) and (min-height: 37.5rem) and (prefers-reduced-motion: no-preference)");
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const onScroll = () => {
      const el = section.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(0.9999, Math.max(0, -el.getBoundingClientRect().top / total));
      setActive(Math.floor(p * journeyStages.length));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pinned]);

  const goTo = useCallback(
    (i: number) => {
      const el = section.current;
      if (!el) return;
      const smooth = window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? "smooth" : "auto";
      if (pinned) {
        const total = el.offsetHeight - window.innerHeight;
        window.scrollTo({ top: el.offsetTop + (total * (i + 0.5)) / journeyStages.length, behavior: smooth });
      } else {
        document.getElementById(`chapter-${journeyStages[i].id}`)?.scrollIntoView({ behavior: smooth });
      }
    },
    [pinned],
  );

  /* Any link to a chapter (hero ruler, rail) scrolls to the right point of the pinned stage. */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#chapter-"]');
      if (!a) return;
      const i = journeyStages.findIndex((s) => `#chapter-${s.id}` === a.getAttribute("href"));
      if (i < 0) return;
      e.preventDefault();
      goTo(i);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [goTo]);

  const isActive = (i: number) => !pinned || i === active;
  const dark = pinned && active >= 3;

  return (
    <section ref={section} id="journey" aria-label="The examination journey" data-pinned={pinned} className="journey relative bg-ink">
      <div className="journey-stage">
        <div className="journey-sticky" style={pinned ? { backgroundColor: BACKGROUNDS[active] } : undefined}>
          {pinned && (
            <>
              <nav aria-label="Journey chapters" className="absolute top-1/2 right-[calc(var(--gutter)*0.6)] z-10 grid -translate-y-1/2 justify-items-end">
                {journeyStages.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#chapter-${s.id}`}
                    aria-current={i === active ? "step" : undefined}
                    className={`group flex items-center gap-3 py-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase transition-colors duration-500 ${
                      i === active ? (dark ? "text-ink" : "text-ivory") : dark ? "text-mute-l" : "text-mute-d"
                    }`}
                  >
                    <span className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{s.title}</span>
                    <span
                      aria-hidden="true"
                      className={`size-[9px] rotate-45 border border-current transition-all duration-500 ${i === active ? "bg-current" : ""}`}
                    />
                  </a>
                ))}
              </nav>
              <p aria-live="polite" className={`absolute bottom-7 left-[var(--gutter)] z-10 font-mono text-[0.65625rem] tracking-[0.16em] ${dark ? "text-mute-l" : "text-mute-d"}`}>
                Chapter {journeyStages[active].number} / 05
              </p>
            </>
          )}

          {journeyStages.map((stage, i) => (
            <article
              key={stage.id}
              id={`chapter-${stage.id}`}
              aria-labelledby={`chapter-${stage.id}-title`}
              data-active={isActive(i)}
              className={`chapter relative grid min-h-[100svh] items-center overflow-hidden px-[var(--gutter)] py-[clamp(5.5rem,10vw,8.75rem)] ${CHAPTER_BG[i]}`}
            >
              {i === 0 && <DreamChapter />}
              {i === 1 && <DirectionChapter />}
              {i === 2 && <PreparationChapter />}
              {i === 3 && <PerformanceChapter />}
              {i === 4 && <DestinationChapter />}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChapterHead({ index }: { index: number }) {
  const s = journeyStages[index];
  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="title-block">
        <span>Chapter</span>
        <span>{s.number} / 05</span>
      </span>
      <span className="eyebrow">{s.light}</span>
    </div>
  );
}

const chapterTitle = "mt-5 leading-[0.82] tracking-[-0.04em]";

/* ---------- 01 Dream ---------- */
function DreamChapter() {
  const { exam, setExam } = useExam();
  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_78%_26%,rgb(200_144_47/0.16),transparent_70%),radial-gradient(ellipse_80%_60%_at_20%_110%,rgb(143_97_22/0.06),transparent_70%)]" />
      <Star className="absolute top-[18%] right-[16%] size-9 md:size-12" />
      <div className="chapter-inner relative mx-auto grid w-full max-w-[85rem] items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <ChapterHead index={0} />
          <h2 id="chapter-dream-title" className={`${chapterTitle} text-[clamp(4.5rem,13vw,13.75rem)]`}>
            Dream
          </h2>
          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-3 font-display text-[clamp(1.5rem,2.4vw,2.125rem)] italic">
            <label htmlFor="exam-pick">I am preparing for</label>
            <span className="relative inline-block">
              <select
                id="exam-pick"
                value={exam ?? ""}
                onChange={(e) => setExam((e.target.value || null) as ExamCode | null)}
                className="cursor-pointer appearance-none rounded-none border-0 border-b border-ivory bg-transparent py-1 pr-9 pl-0.5 font-display text-[length:inherit] font-medium text-ivory not-italic"
              >
                <option value="" className="bg-charcoal text-ivory">
                  choose an exam
                </option>
                {exams.map((e) => (
                  <option key={e.code} value={e.code} className="bg-charcoal text-ivory">
                    {e.name}
                  </option>
                ))}
              </select>
              <span aria-hidden="true" className="pointer-events-none absolute top-[45%] right-2 size-2 -translate-y-1/2 rotate-45 border-r border-b border-ivory" />
            </span>
          </div>
        </div>
        <div className="grid gap-4 self-end border-l border-[var(--line-d)] pl-7">
          <p className="eyebrow">Every journey starts here</p>
          <p className="max-w-[34ch] text-[0.96875rem] text-mute-d">
            Tell us where you are going. The courses and test series further down this page follow that one choice.
          </p>
        </div>
      </div>
    </>
  );
}

/* ---------- 02 Direction ---------- */
function DirectionChapter() {
  const { exam, setExam } = useExam();
  const [hover, setHover] = useState<ExamCode | null>(null);
  const shown = examByCode(hover ?? exam ?? exams[0].code) ?? exams[0];
  const ticks = Array.from({ length: 36 }, (_, k) => {
    const a = k * 10;
    const r1 = a % 90 === 0 ? 160 : 170;
    const rad = ((a - 90) * Math.PI) / 180;
    return { x1: 200 + r1 * Math.cos(rad), y1: 200 + r1 * Math.sin(rad), x2: 200 + 180 * Math.cos(rad), y2: 200 + 180 * Math.sin(rad) };
  });

  return (
    <div className="chapter-inner relative mx-auto grid w-full max-w-[85rem] items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <ChapterHead index={1} />
        <h2 id="chapter-direction-title" className={`${chapterTitle} text-[clamp(3.75rem,9vw,9.5rem)]`}>
          Direction
        </h2>
        <p className="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.375rem)] leading-tight text-body-d italic">Choose your examination.</p>
        <ul className="mt-8 border-t border-[var(--line-d)]" onMouseLeave={() => setHover(null)}>
          {exams.map((e) => {
            const selected = (exam ?? exams[0].code) === e.code;
            return (
              <li key={e.code}>
                <button
                  type="button"
                  aria-pressed={exam === e.code}
                  onClick={() => setExam(e.code)}
                  onMouseEnter={() => setHover(e.code)}
                  onFocus={() => setHover(e.code)}
                  onBlur={() => setHover(null)}
                  className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-b border-[var(--line-d)] py-4 text-left"
                >
                  <span
                    className={`font-display text-[clamp(1.9rem,3.6vw,3.25rem)] leading-none transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-ivory ${
                      selected ? "translate-x-3 text-ivory" : "text-mute-d"
                    }`}
                  >
                    {e.name}
                  </span>
                  <span className={`font-mono text-[0.6875rem] tracking-[0.14em] ${selected ? "text-ivory" : "text-mute-d"}`}>
                    BRG {String(e.bearing).padStart(3, "0")}°
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="relative mx-auto mb-16 aspect-square w-full max-w-[20rem] lg:mb-0 lg:max-w-[30rem]">
        <svg viewBox="0 0 400 400" aria-hidden="true" className="size-full overflow-visible">
          <circle cx="200" cy="200" r="180" fill="none" stroke="rgb(143 97 22 / 0.35)" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="rgb(143 97 22 / 0.15)" strokeDasharray="2 6" />
          <g stroke="rgb(143 97 22 / 0.4)">
            {ticks.map((t, k) => (
              <line key={k} x1={t.x1.toFixed(1)} y1={t.y1.toFixed(1)} x2={t.x2.toFixed(1)} y2={t.y2.toFixed(1)} />
            ))}
          </g>
          <g fontFamily="var(--font-mono)" fontSize="11" fill="#5a5248" textAnchor="middle" letterSpacing="2">
            <text x="200" y="10">N</text>
            <text x="398" y="204">E</text>
            <text x="200" y="402">S</text>
            <text x="2" y="204">W</text>
          </g>
          <g style={{ transform: `rotate(${shown.bearing}deg)`, transformOrigin: "200px 200px", transition: "transform 1.1s cubic-bezier(.16,1,.3,1)" }}>
            <path d="M200 46 L208 200 L200 214 L192 200Z" fill="#c8902f" />
            <path d="M200 354 L206 200 L194 200Z" fill="rgb(7 7 6 / 0.25)" />
          </g>
          <circle cx="200" cy="200" r="5" fill="#f4eee2" stroke="#8f6116" />
        </svg>
        <div className="absolute inset-x-0 -bottom-2 translate-y-full text-center" aria-live="polite">
          <p className="font-display text-[1.75rem] leading-none">{shown.name}</p>
          <p className="eyebrow mt-2">{shown.descriptor}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- 03 Preparation ---------- */
const blockStyle: Record<Exclude<WeekBlock, null>, string> = {
  live: "bg-ivory/90 text-ink",
  practice: "bg-ivory/[0.12] text-ivory border border-ivory/20",
  notes: "bg-ivory/[0.12] text-ivory border border-ivory/20",
  doubts: "bg-ivory/[0.12] text-ivory border border-ivory/20",
  analysis: "bg-ivory/[0.12] text-ivory border border-ivory/20",
  test: "bg-ivory text-ink",
  revise: "text-ivory bg-[repeating-linear-gradient(135deg,rgb(7_7_6/0.14)_0_4px,transparent_4px_8px)]",
};
const blockLabel: Record<Exclude<WeekBlock, null>, string> = {
  live: "Live", practice: "Practice", notes: "Notes", doubts: "Doubts", analysis: "Analysis", test: "Weekly test", revise: "Revise",
};

function PreparationChapter() {
  return (
    <>
      <div aria-hidden="true" className="drafting-grid absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_60%_50%,#000,transparent)]" />
      <div className="chapter-inner relative mx-auto grid w-full max-w-[85rem] items-center gap-12 lg:grid-cols-[0.9fr_1.3fr]">
        <div>
          <ChapterHead index={2} />
          <h2 id="chapter-preparation-title" className={`${chapterTitle} text-[clamp(3.25rem,8vw,8.5rem)]`}>
            Preparation
          </h2>
          <p className="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.375rem)] leading-tight text-body-d italic">Learn with structured guidance.</p>
          <p className="mt-4 max-w-[44ch] text-body-d">
            Every week has a shape: live classes with Shubham Sir, practice that follows the lesson, a test on Saturday and revision before the week closes.
          </p>
        </div>
        <div className="min-w-0">
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="A typical Vidyansh week, scrollable">
            <table className="w-full min-w-[32rem] border-collapse border-t border-l border-[var(--hair)] font-mono text-[0.625rem] tracking-[0.08em] uppercase">
              <caption className="sr-only">A typical Vidyansh week</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-16 border-r border-b border-[var(--line-d)]"><span className="sr-only">Time</span></th>
                  {week.days.map((d) => (
                    <th key={d} scope="col" className="border-r border-b border-[var(--line-d)] px-1 py-2.5 font-medium text-ivory">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {week.slots.map((slot) => (
                  <tr key={slot.time}>
                    <th scope="row" className="border-r border-b border-[var(--line-d)] p-1.5 text-left font-medium text-mute-d">
                      {slot.time}
                    </th>
                    {slot.blocks.map((b, k) => (
                      <td key={k} className="h-12 border-r border-b border-[var(--line-d)] p-[3px]">
                        {b ? <span className={`block h-full p-1.5 font-medium ${blockStyle[b]}`}>{blockLabel[b]}</span> : <span className="sr-only">Free</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 flex flex-wrap gap-4 font-mono text-[0.65625rem] tracking-[0.12em] text-mute-d uppercase" aria-label="Legend">
            <li className="flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-3.5 bg-ivory/90" />Live class</li>
            <li className="flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-3.5 border border-ivory/30 bg-ivory/[0.12]" />Practice</li>
            <li className="flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-3.5 bg-ivory" />Test</li>
            <li className="flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-3.5 bg-[repeating-linear-gradient(135deg,rgb(143_97_22/0.3)_0_3px,transparent_3px_6px)]" />Revision</li>
          </ul>
        </div>
      </div>
    </>
  );
}

/* ---------- 04 Performance ---------- */
function PerformanceChapter() {
  const points = "M40 180 L100 172 L160 176 L220 150 L280 146 L340 120 L400 112 L460 90 L520 74 L580 56 L630 44";
  return (
    <div className="chapter-inner relative mx-auto grid w-full max-w-[85rem] items-center gap-12 lg:grid-cols-[1.5fr_0.8fr]">
      <div>
        <ChapterHead index={3} />
        <h2 id="chapter-performance-title" className={`${chapterTitle} text-[clamp(3.25rem,8vw,8.5rem)]`}>
          Performance
        </h2>
        <p className="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.375rem)] leading-tight text-mute-l italic">Practice and analyse.</p>
        <figure className="mt-6">
          <svg viewBox="0 0 640 230" className="h-auto w-full overflow-visible" role="img" aria-label="Illustration of a score line rising across a series of mock tests">
            <g stroke="rgb(7 7 6 / 0.1)">
              <line x1="40" y1="30" x2="630" y2="30" />
              <line x1="40" y1="90" x2="630" y2="90" />
              <line x1="40" y1="150" x2="630" y2="150" />
            </g>
            <line x1="40" y1="10" x2="40" y2="200" stroke="rgb(7 7 6 / 0.45)" />
            <line x1="40" y1="200" x2="630" y2="200" stroke="rgb(7 7 6 / 0.45)" />
            <path d={`${points} L630 200 L40 200Z`} fill="rgb(7 7 6 / 0.06)" />
            <path className="score-line" d={points} pathLength={1} fill="none" stroke="#070706" strokeWidth="1.6" />
            <rect x="625" y="39" width="10" height="10" fill="#c8902f" transform="rotate(45 630 44)" />
            <g fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1" fill="#5a5248">
              <text x="40" y="222">FIRST MOCK</text>
              <text x="630" y="222" textAnchor="end">LATEST MOCK</text>
            </g>
          </svg>
          <figcaption className="eyebrow mt-2">Illustration · how analysis tracks your progress</figcaption>
        </figure>
      </div>
      <div className="grid gap-5">
        <p className="eyebrow">Every mock, analysed</p>
        <p className="font-display text-[clamp(2rem,3vw,2.75rem)] leading-[1.05]">Where time went. Which topics leak marks. What to practise next.</p>
        <p className="text-mute-l">Test series with question-level analysis, rank and percentile after every attempt.</p>
        <Button href="/test-series" tone="light" className="justify-self-start">
          Explore test series
        </Button>
      </div>
    </div>
  );
}

/* ---------- 05 Destination ---------- */
function DestinationChapter() {
  return (
    <div className="chapter-inner relative mx-auto grid w-full max-w-[85rem] justify-items-center gap-6 text-center">
      <Star className="size-12" color="#8f6116" />
      <ChapterHead index={4} />
      <p className="font-display text-[clamp(1.5rem,2.6vw,2.375rem)] leading-tight text-mute-l italic">Turn preparation into achievement.</p>
      <h2 id="chapter-destination-title" className="text-[clamp(3.6rem,15.4vw,16.25rem)] leading-[0.82] tracking-[-0.04em]">
        Destination
      </h2>
      <Button href="/courses" tone="light" diamond>
        Find your course
      </Button>
    </div>
  );
}
