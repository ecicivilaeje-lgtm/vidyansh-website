"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { dailyQuestion, freeResources, notices } from "@/content/free-learning";
import { blogPosts } from "@/content/blog";
import { ChapterMark } from "@/components/ui/ChapterMark";

/** Free learning laid out like the front page of a study journal: ticker, lead story, index, question of the day. */
export function FreeLearning() {
  const lead = blogPosts[0];
  return (
    <section id="free-learning" aria-labelledby="free-title" className="scene-sheet on-light bg-ivory text-ink">
      <div className="ticker overflow-hidden border-y border-[var(--line-l)] bg-ink py-3 text-ivory" aria-label="Latest notices">
        <ul className="ticker-run flex w-max gap-12 pl-12">
          {[...notices, ...notices].map((n, i) => (
            <li key={i} aria-hidden={i >= notices.length} className="flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.14em] whitespace-nowrap uppercase">
              <span className="text-ivory">{n.tag}</span>
              <span className="text-mute-d">{n.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-v py-[var(--space-section)]">
        <ChapterMark numeral="VII" name="Free learning" className="mb-[var(--space-block)]" />
        <div className="flex flex-wrap items-end justify-between gap-6 pb-8">
          <h2 id="free-title" className="settle text-[clamp(3.75rem,8.4vw,9rem)] leading-[0.86] tracking-[-0.03em]">
            Free <em className="font-normal">learning</em>
          </h2>
          <p className="eyebrow">Open to every aspirant · no sign-up needed</p>
        </div>

        <div className="grid gap-16 border-t border-ink pt-12 lg:grid-cols-[1.35fr_1fr] lg:gap-[clamp(3rem,6vw,7rem)]">
          <article className="grid content-start gap-6">
            <CalendarArt />
            <p className="eyebrow">
              From the journal · {lead.category}
            </p>
            <h3 className="font-display text-[clamp(2.4rem,4.4vw,4.25rem)] leading-[1] text-balance">
              <Link href={`/blog/${lead.slug}`} className="link-underline">
                {lead.title}
              </Link>
            </h3>
            <p className="max-w-[56ch] text-mute-l">{lead.description}</p>
            <p className="font-hand text-[1.75rem] text-ink/75">By {lead.author}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button href={`/blog/${lead.slug}`} tone="light" diamond>
                Read the guide
              </Button>
              <Button href="/blog" tone="light" variant="ghost">
                All exam guides
              </Button>
            </div>
          </article>

          <div className="grid content-start gap-12">
            <div>
              <p className="eyebrow border-b border-[var(--line-l)] pb-3">Index</p>
              <ul>
                {freeResources.map((r) => (
                  <li key={r.title}>
                    <Link
                      href={r.href}
                      className="group grid grid-cols-[4rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-[var(--line-l)] py-5 transition-colors hover:text-mute-l"
                    >
                      <span className="font-mono text-[0.625rem] tracking-[0.14em] text-mute-l uppercase">{r.type}</span>
                      <span className="font-display text-[1.5rem] leading-tight">{r.title}</span>
                      <span className="font-mono text-[0.6875rem] whitespace-nowrap text-mute-l">{r.meta}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <QuestionOfTheDay />
          </div>
        </div>
      </div>
    </section>
  );
}

function QuestionOfTheDay() {
  const [picked, setPicked] = useState<string | null>(null);
  const answer = dailyQuestion.options.find((o) => o.correct);

  return (
    <fieldset className="border-t border-ink pt-5">
      <legend className="eyebrow float-left mb-4 w-full">Question of the day</legend>
      <p className="clear-both font-display text-[1.5rem] leading-snug">{dailyQuestion.prompt}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {dailyQuestion.options.map((o) => {
          const state = picked === null ? "idle" : o.correct ? "right" : picked === o.key ? "wrong" : "idle";
          return (
            <button
              key={o.key}
              type="button"
              disabled={picked !== null}
              aria-pressed={picked === o.key}
              onClick={() => setPicked(o.key)}
              className={`flex items-center gap-2.5 border px-3 py-2.5 text-left font-display text-base transition-colors disabled:cursor-default ${
                state === "right"
                  ? "border-[#4f6a3c] bg-[#4f6a3c]/10"
                  : state === "wrong"
                    ? "border-[#9b4a33] bg-[#9b4a33]/10"
                    : "border-[var(--line-l)] enabled:hover:border-ink"
              }`}
            >
              <span className="font-mono text-[0.6875rem] text-mute-l">{o.key}</span>
              {o.text}
            </button>
          );
        })}
      </div>
      <div aria-live="polite" className="mt-4 text-sm text-mute-l">
        {picked !== null && (
          <p>
            <strong className="font-semibold text-ink">{picked === answer?.key ? "Correct." : `The answer is ${answer?.key}.`}</strong> {dailyQuestion.explanation}
          </p>
        )}
      </div>
    </fieldset>
  );
}

/** Ninety days drawn as a study calendar: revision weeks, mock days and the paper itself. */
function CalendarArt() {
  return (
    <svg viewBox="0 0 390 182" className="w-full max-w-[38rem]" role="img" aria-label="A 90-day plan drawn as a calendar, ending at the exam day">
      {Array.from({ length: 90 }, (_, i) => {
        const col = i % 15;
        const row = Math.floor(i / 15);
        const mock = i % 7 === 6;
        const last = i === 89;
        const revise = i >= 70 && !mock && !last;
        return (
          <rect
            key={i}
            x={20 + col * 23.5}
            y={18 + row * 23.5}
            width="17"
            height="17"
            fill={last ? "#c8902f" : mock ? "#070706" : revise ? "rgb(7 7 6 / 0.18)" : "none"}
            stroke={last ? "#8f6116" : "rgb(7 7 6 / 0.25)"}
          />
        );
      })}
      <text x="20" y="13" fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1.4" fill="#5a5248">DAY 1</text>
      <text x="370" y="13" textAnchor="end" fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1.4" fill="#070706">PAPER</text>
    </svg>
  );
}
