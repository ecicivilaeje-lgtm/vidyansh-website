"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadAttempt, scoreAttempt } from "@/lib/attempt";
import { formatINR, orDash } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Paper, SeriesAccess, SeriesProgress, SeriesTest, TestSeries, TestStatus } from "@/lib/types";

type View = "not_purchased" | "purchased" | "in_progress" | "completed";

const views: { id: View; label: string }[] = [
  { id: "not_purchased", label: "Not purchased" },
  { id: "purchased", label: "Purchased" },
  { id: "in_progress", label: "Test in progress" },
  { id: "completed", label: "Test completed" },
];

interface Props {
  series: TestSeries;
  tests: SeriesTest[];
  progress: SeriesProgress;
  paper: Paper | null;
  /** Show the state switcher so the five states can be reviewed before accounts exist. */
  preview: boolean;
}

interface LocalAttempt {
  status: TestStatus;
  score: string | null;
}

/**
 * The access panel and the list of tests for one series. Status comes from the API
 * (progress) and, for the free test, from attempts saved on this device.
 */
export function SeriesView({ series, tests, progress, paper, preview }: Props) {
  const [view, setView] = useState<View | null>(null);
  const [local, setLocal] = useState<Record<string, LocalAttempt>>({});

  useEffect(() => {
    if (!paper) return;
    const found: Record<string, LocalAttempt> = {};
    for (const t of tests) {
      if (t.paperId !== paper.id) continue;
      const a = loadAttempt(t.id);
      if (!a) continue;
      if (a.submittedAt) {
        const s = scoreAttempt(paper, a);
        found[t.id] = { status: "completed", score: `${s.score} / ${s.maxScore}` };
      } else found[t.id] = { status: "in_progress", score: null };
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- saved attempts live in localStorage, readable only after hydration
    setLocal(found);
  }, [paper, tests]);

  const access: SeriesAccess = view === null || view === "not_purchased" ? progress.access : "purchased";
  const statusOf = (t: SeriesTest): TestStatus => {
    if (view === "in_progress" && t.number === 1) return "in_progress";
    if (view === "completed" && t.number === 1) return "completed";
    if (local[t.id] && (view === null || view === "not_purchased")) return local[t.id].status;
    if (access === "purchased") return t.paperId ? "available" : "locked";
    return progress.testStatus[t.id] ?? "locked";
  };
  const resumable = tests.find((t) => statusOf(t) === "in_progress");

  return (
    <>
      {preview && (
        <div className="border-b border-[var(--line-d)] bg-charcoal">
          <div className="container-v flex flex-wrap items-center gap-x-5 gap-y-2 py-3">
            <span className="eyebrow text-ivory">Preview state</span>
            <div role="group" aria-label="Preview the series page as" className="flex flex-wrap gap-1.5">
              {views.map((v) => {
                const on = (view ?? "not_purchased") === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setView(v.id)}
                    className={`border px-2.5 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-colors ${
                      on ? "border-ivory text-ivory" : "border-[var(--line-d)] text-mute-d hover:text-ivory"
                    }`}
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>
            <span className="text-xs text-mute-d">For review only. On the live site this comes from the student&rsquo;s account; personal figures stay &ldquo;—&rdquo; until real attempts exist.</span>
          </div>
        </div>
      )}

      {resumable && (
        <div className="border-b border-ivory/30 bg-ivory/[0.05]">
          <div className="container-v flex flex-wrap items-center justify-between gap-3 py-3">
            <p className="text-sm">
              <span className="mr-2 inline-block size-2 animate-pulse rounded-full bg-ivory align-middle" aria-hidden="true" />
              {resumable.title} is in progress. Your answers are saved.
            </p>
            <Link href={routes.attempt(series.slug, resumable.id)} className="font-mono text-[0.6875rem] font-medium tracking-[0.16em] text-ivory uppercase underline-offset-4 hover:underline">
              Resume test →
            </Link>
          </div>
        </div>
      )}

      <section aria-labelledby="contents-title" className="bg-ink py-[clamp(3.5rem,7vw,6rem)]">
        <div className="container-v grid items-start gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-[clamp(2rem,4vw,4rem)]">
          <div>
            <div className="flex items-end justify-between gap-4 border-b border-ivory/60 pb-3">
              <h2 id="contents-title" className="font-display text-[clamp(1.75rem,2.6vw,2.25rem)] leading-tight">
                Contents
              </h2>
              <span className="eyebrow">{orDash(series.testCount)} tests in series</span>
            </div>
            <ol>
              {tests.map((t) => (
                <TestRow key={t.id} test={t} status={statusOf(t)} score={local[t.id]?.score ?? null} slug={series.slug} />
              ))}
            </ol>
            <p className="eyebrow mt-5 leading-relaxed normal-case tracking-[0.06em]">Further tests appear here as they are released. Each test opens on its release date.</p>
          </div>

          <AccessPanel series={series} access={access} progress={progress} />
        </div>
      </section>
    </>
  );
}

const statusStyle: Record<TestStatus, { label: string; cls: string }> = {
  locked: { label: "Locked", cls: "text-mute-d border-[var(--line-d)]" },
  available: { label: "Available", cls: "text-ivory border-ivory/40" },
  in_progress: { label: "In progress", cls: "text-mark border-mark/50" },
  completed: { label: "Completed", cls: "text-ok border-ok/50" },
};

function TestRow({ test, status, score, slug }: { test: SeriesTest; status: TestStatus; score: string | null; slug: string }) {
  const s = statusStyle[status];
  const action =
    status === "available"
      ? { href: routes.test(slug, test.id), label: test.isFree ? "Start free" : "Start" }
      : status === "in_progress"
        ? { href: routes.attempt(slug, test.id), label: "Resume" }
        : status === "completed"
          ? { href: routes.result(slug, test.id), label: "Result" }
          : null;

  return (
    <li className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-b border-[var(--line-d)] py-5 md:grid-cols-[3rem_minmax(0,1fr)_7.5rem_7.5rem]">
      <span className="font-mono text-xs text-mute-d tabular-nums">{String(test.number).padStart(2, "0")}</span>
      <span className="min-w-0">
        <span className={`block font-display text-[1.45rem] leading-tight ${status === "locked" ? "text-ivory/60" : ""}`}>{test.title}</span>
        <span className="eyebrow mt-1 block">
          {test.questions !== null && `${test.questions} questions · ${orDash(test.durationMin, " min")} · `}
          {test.releaseNote}
        </span>
        {status === "completed" && (
          <span className="mt-1 block font-mono text-[0.6875rem] tracking-[0.1em] text-body-d">Score {score ?? "—"} · Rank — · Percentile —</span>
        )}
      </span>
      <span className="col-start-2 row-start-2 md:col-start-auto md:row-start-auto">
        <span className={`inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[0.5625rem] tracking-[0.14em] uppercase ${s.cls}`}>
          {status === "locked" && (
            <svg viewBox="0 0 12 12" aria-hidden="true" className="size-2.5">
              <rect x="2" y="5.5" width="8" height="5.5" fill="none" stroke="currentColor" />
              <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" />
            </svg>
          )}
          {s.label}
        </span>
      </span>
      <span className="col-start-3 row-span-2 row-start-1 justify-self-end md:col-start-auto md:row-span-1 md:row-start-auto">
        {action ? (
          <Link
            href={action.href}
            aria-label={`${action.label}: ${test.title}`}
            className={`inline-flex border px-3.5 py-2.5 whitespace-nowrap font-mono text-[0.625rem] font-medium tracking-[0.16em] uppercase transition-colors ${
              status === "available" ? "border-ivory bg-ivory text-ink hover:bg-transparent hover:text-ivory" : "border-ivory/30 hover:border-ivory hover:text-ivory"
            }`}
          >
            {action.label}
          </Link>
        ) : (
          <span className="font-mono text-[0.625rem] tracking-[0.14em] text-mute-d uppercase">—</span>
        )}
      </span>
    </li>
  );
}

function AccessPanel({ series, access, progress }: { series: TestSeries; access: SeriesAccess; progress: SeriesProgress }) {
  const purchased = access === "purchased";
  return (
    <aside id="access" aria-labelledby="access-title" className="on-light on-parchment scroll-mt-28 bg-parchment text-ink lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
      <div className="flex items-center justify-between border border-b-0 border-[var(--hair)] bg-charcoal px-5 py-2.5 text-ivory">
        <span className="font-mono text-[0.625rem] tracking-[0.18em] uppercase">{purchased ? "Your series" : "Access"}</span>
        <span className={`font-mono text-[0.625rem] tracking-[0.18em] uppercase ${purchased ? "text-ok" : "text-ivory"}`}>{purchased ? "Purchased" : "Not purchased"}</span>
      </div>
      <div className="grid gap-5 p-[clamp(1.25rem,2.6vw,1.75rem)]">
        <h2 id="access-title" className="font-display text-[1.9rem] leading-tight">
          {purchased ? "Your progress" : "Unlock every test"}
        </h2>

        {purchased ? (
          <>
            <dl className="grid grid-cols-3 border-t border-l border-[var(--line-l)]">
              {[
                ["Attempted", orDash(progress.attempted)],
                ["Remaining", orDash(progress.remaining)],
                ["Validity left", orDash(progress.validityLeftDays, " d")],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 border-r border-b border-[var(--line-l)] px-3 py-3">
                  <dt className="font-mono text-[0.5625rem] tracking-[0.14em] text-mute-l uppercase">{k}</dt>
                  <dd className="font-display text-3xl leading-none tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <div>
              <div className="flex justify-between font-mono text-[0.5625rem] tracking-[0.14em] text-mute-l uppercase">
                <span>Series progress</span>
                <span>{progress.attempted === null ? "—" : ""}</span>
              </div>
              <div className="mt-2 h-1.5 bg-ink/10" role="img" aria-label="Series progress not available yet">
                <div className="h-full w-0 bg-ink" />
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-4 border-t border-[var(--line-l)] pt-4">
              <div>
                <dt className="font-mono text-[0.5625rem] tracking-[0.14em] text-mute-l uppercase">Average accuracy</dt>
                <dd className="mt-1 font-display text-3xl leading-none tabular-nums">{progress.avgAccuracy === null ? "—" : `${Math.round(progress.avgAccuracy * 100)}%`}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.5625rem] tracking-[0.14em] text-mute-l uppercase">Best rank</dt>
                <dd className="mt-1 font-display text-3xl leading-none tabular-nums">{orDash(progress.bestRank)}</dd>
              </div>
            </dl>
            <p className="text-xs text-mute-l">Figures fill in from your attempts. Ranks compare you with every Vidyansh student who took the same test.</p>
          </>
        ) : (
          <>
            <div>
              <p className="font-mono text-[0.5625rem] tracking-[0.14em] text-mute-l uppercase">Price</p>
              <p className="mt-1 flex items-baseline gap-3">
                <span className="font-display text-5xl leading-none tabular-nums">{formatINR(series.price)}</span>
                {series.originalPrice !== null && <s className="text-mute-l">{formatINR(series.originalPrice)}</s>}
              </p>
              <p className="mt-2 text-sm text-mute-l">
                Validity {orDash(series.validityDays, " days")} · Tests {orDash(series.testCount)}
              </p>
            </div>
            <ul className="grid gap-2 border-t border-[var(--line-l)] pt-4 text-[0.9375rem]">
              {["Every test in the series, as it releases", "Detailed solution for every question", "Rank, percentile and topic analysis", "Hindi and English, where the exam allows"].map((x) => (
                <li key={x} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rotate-45 bg-ink" />
                  {x}
                </li>
              ))}
            </ul>
            <div className="grid gap-2.5">
              <Link
                href={routes.freeTest(series)}
                className="inline-flex justify-center border border-ink bg-ink px-5 py-3.5 font-mono text-[0.6875rem] font-medium tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-transparent hover:text-ink"
              >
                Start free test
              </Link>
              <button
                type="button"
                aria-disabled="true"
                aria-describedby="buy-note"
                className="inline-flex cursor-not-allowed justify-center border border-ink/25 px-5 py-3.5 font-mono text-[0.6875rem] font-medium tracking-[0.16em] text-mute-l uppercase"
              >
                Buy now
              </button>
              <p id="buy-note" className="text-xs text-mute-l">
                Checkout opens when this series is published. The free test is open now.
              </p>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
