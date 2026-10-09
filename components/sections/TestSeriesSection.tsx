"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { testSeriesPromise } from "@/content/test-series";
import { useExam } from "@/components/providers/ExamProvider";
import { Button } from "@/components/ui/Button";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { orDash } from "@/lib/format";
import type { TestSeries } from "@/lib/types";

/** PRACTICE: Test Series as a first-class product. Headline, a live-looking test console, then a schedule board. */
export function TestSeriesSection({ series }: { series: TestSeries[] }) {
  const { exam } = useExam();

  return (
    <section id="test-series" aria-labelledby="ts-title" className="scene-surface relative overflow-hidden bg-ink py-[var(--space-section)]">
            <div className="container-v relative">
        <ChapterMark numeral="III" name="Practice" note="Test Series" className="mb-[var(--space-block)]" />
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-[clamp(2rem,4vw,4rem)]">
          <div>
            <h2 id="ts-title" className="settle text-[clamp(4.25rem,10vw,10.5rem)] leading-[0.84] tracking-[-0.04em]">
              Practice
              <br />
              with <em className="font-normal">purpose</em>
            </h2>
            <p className="mt-10 max-w-[24ch] font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight text-body-d italic">
              &ldquo;Test yourself before the exam tests you.&rdquo;
            </p>
            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5">
              {testSeriesPromise.map((p) => (
                <div key={p.label} className="grid gap-1">
                  <dt className="eyebrow">{p.label}</dt>
                  <dd className="font-mono text-[0.8125rem] tracking-[0.06em]">{p.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <TestConsole />
        </div>

        <div className="mt-[var(--space-block)] border-t border-ivory/40">
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <p className="eyebrow text-ivory">Now running</p>
            <p className="eyebrow">Counts and dates appear as the catalogue is published</p>
          </div>
          <div className="overflow-x-auto">
            <table className="stack-table w-full border-collapse md:min-w-[46rem]">
              <caption className="sr-only">Current Vidyansh test series</caption>
              <thead>
                <tr className="eyebrow text-left">
                  {["Test series", "Exam", "Tests", "Duration", "Schedule", "Action"].map((h, i) => (
                    <th key={i} scope="col" className="border-b border-[var(--line-d)] py-2.5 pr-4 font-medium">
                      {i === 5 ? <span className="sr-only">{h}</span> : h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {series.map((s) => {
                  const mine = exam !== null && s.exam === exam;
                  return (
                    <tr key={s.id} className={`transition-colors hover:bg-ivory/[0.025] ${mine ? "bg-ivory/[0.04]" : ""}`}>
                      <td className={`border-b border-[var(--line-d)] py-7 pr-4 ${mine ? "pl-4 shadow-[inset_1px_0_0_var(--color-ivory)]" : ""}`}>
                        <span className="block font-display text-[clamp(1.75rem,2.4vw,2.25rem)] leading-tight">{s.name}</span>
                        <span className="eyebrow mt-1.5 block">{s.subjects.join(" · ")}</span>
                      </td>
                      <td data-label="Exam" className="border-b border-[var(--line-d)] py-7 pr-4 font-mono text-[0.8125rem] text-body-d">{s.examLabel}</td>
                      <td data-label="Tests" className="border-b border-[var(--line-d)] py-7 pr-4 font-mono text-[0.8125rem] text-body-d tabular-nums">{orDash(s.testCount)}</td>
                      <td data-label="Duration" className="border-b border-[var(--line-d)] py-7 pr-4 font-mono text-[0.8125rem] text-body-d tabular-nums">{orDash(s.durationMin, " min")}</td>
                      <td data-label="Schedule" className="border-b border-[var(--line-d)] py-7 pr-4">
                        <span className="font-mono text-[0.6875rem] tracking-[0.12em] whitespace-nowrap text-body-d uppercase">{s.schedule}</span>
                      </td>
                      <td className="stack-action border-b border-[var(--line-d)] py-7 text-right">
                        <Link
                          href={`/test-series/series/${s.slug}`}
                          aria-label={`View ${s.name}`}
                          className="link-underline font-mono text-[0.6875rem] tracking-[0.16em] whitespace-nowrap uppercase"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-5 pt-7">
            <p className="eyebrow">Full-length · Subject-wise · Chapter-wise · Previous year papers</p>
            <Button href="/test-series">
              Explore test series
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const palette: ("answered" | "marked" | "visited" | "current" | "unseen")[] = [
  "answered", "answered", "visited", "answered", "marked", "answered", "current", "unseen", "unseen", "unseen", "unseen", "unseen", "unseen", "unseen", "unseen",
];
const bubble = {
  answered: "border-ok bg-ok text-ink",
  marked: "border-mark text-mark",
  visited: "border-mute-d bg-ivory/10 text-mute-d",
  current: "border-ivory text-ivory ring-2 ring-ivory/25",
  unseen: "border-mute-d/70 text-mute-d",
};
const options = ["wL² / 2", "wL² / 4", "wL² / 8", "wL² / 12"];

/** An illustrative test console: the clock counts down, the answer sheet fills as you choose. */
function TestConsole() {
  const [seconds, setSeconds] = useState(2 * 3600);
  const [choice, setChoice] = useState<number | null>(2);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 7200)), 1000);
    return () => window.clearInterval(id);
  }, []);

  const clock = [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map((n) => String(n).padStart(2, "0")).join(":");

  return (
    <figure className="border border-[var(--hair)] bg-charcoal font-mono shadow-[0_40px_80px_-40px_rgb(60_45_20/0.25)]" aria-label="Preview of the Vidyansh test console">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line-d)] px-4 py-3">
        <span className="text-[0.6875rem] tracking-[0.12em] text-mute-d uppercase">Sample paper · Question 07</span>
        <span className="flex items-center gap-2.5 text-lg tracking-[0.06em] tabular-nums" aria-label="Time remaining in this preview">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
            <circle cx="12" cy="13" r="9" fill="none" stroke="currentColor" />
            <path d="M12 13 V8 M10 2h4" stroke="currentColor" fill="none" />
          </svg>
          <span suppressHydrationWarning>{clock}</span>
        </span>
      </div>
      <div className="grid sm:grid-cols-[1.5fr_1fr]">
        <fieldset className="grid content-start gap-3 border-b border-[var(--line-d)] p-5 sm:border-r sm:border-b-0">
          <legend className="contents">
            <span className="block text-[0.65625rem] tracking-[0.14em] text-mute-d uppercase">Strength of materials</span>
            <span className="mt-3 block font-display text-[1.2rem] leading-snug text-ivory">
              Maximum bending moment in a simply supported beam with a uniformly distributed load w over span L:
            </span>
          </legend>
          {options.map((o, i) => (
            <label
              key={o}
              className={`flex cursor-pointer items-center gap-3 border px-3 py-2 font-display text-base transition-colors ${
                choice === i ? "border-ivory" : "border-[var(--line-d)] hover:border-ivory/30"
              }`}
            >
              <input type="radio" name="console-q7" checked={choice === i} onChange={() => setChoice(i)} className="peer sr-only" />
              <span
                aria-hidden="true"
                className={`size-4 shrink-0 rounded-full border ${choice === i ? "border-ivory bg-ivory shadow-[inset_0_0_0_3px_var(--color-charcoal)]" : "border-mute-d"} peer-focus-visible:ring-2 peer-focus-visible:ring-ivory`}
              />
              {o}
            </label>
          ))}
        </fieldset>
        <div className="grid content-start gap-4 p-5">
          <span className="eyebrow">Answer sheet</span>
          <ol className="grid max-w-[15rem] grid-cols-5 gap-2" aria-label="Question palette">
            {palette.map((state, i) => {
              const s = i === 6 && choice !== null ? "answered" : state;
              return (
                <li key={i} className={`grid aspect-square place-items-center rounded-full border text-[0.5625rem] ${bubble[s]}`}>
                  <span className="sr-only">Question </span>
                  {i + 1}
                  <span className="sr-only">, {s}</span>
                </li>
              );
            })}
          </ol>
          <ul className="grid grid-cols-2 gap-1.5 text-[0.59375rem] tracking-[0.08em] text-mute-d uppercase" aria-label="Legend">
            <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-ok" />Answered</li>
            <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full border border-mark" />Marked</li>
            <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full bg-ivory/15" />Visited</li>
            <li className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-full border border-mute-d" />Not seen</li>
          </ul>
        </div>
      </div>
    </figure>
  );
}
