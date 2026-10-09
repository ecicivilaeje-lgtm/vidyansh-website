"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAttempt, formatDuration, loadAttempt, scoreAttempt } from "@/lib/attempt";
import { routes } from "@/lib/routes";
import type { AttemptState, Paper } from "@/lib/types";

type Filter = "all" | "wrong" | "skipped";

const pct = (v: number | null) => (v === null ? "—" : `${Math.round(v * 100)}%`);

/**
 * State 5, "test completed": the report card. Score, accuracy, time and subject accuracy are
 * computed from this student's own answers. Rank and percentile need every candidate's
 * results, so they stay empty until the results API exists.
 */
export function ResultView({ paper, slug, testId, testTitle, seriesName }: { paper: Paper; slug: string; testId: string; testTitle: string; seriesName: string }) {
  const router = useRouter();
  const [a, setA] = useState<AttemptState | null | undefined>(undefined);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const saved = loadAttempt(testId);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the attempt lives in localStorage, readable only after hydration
    setA(saved?.submittedAt ? saved : null);
  }, [testId]);

  if (a === undefined) {
    return (
      <p className="eyebrow py-24 text-center" role="status">
        Loading your result…
      </p>
    );
  }

  if (a === null) {
    return (
      <div className="container-v max-w-2xl py-20">
        <h1 className="text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.92]">No result yet</h1>
        <p className="mt-6 text-body-d">There is no submitted attempt for {testTitle} on this device. Results from your account will appear here once student sign-in is live.</p>
        <Link href={routes.test(slug, testId)} className="link-underline mt-8 inline-block font-mono text-xs tracking-[0.16em] uppercase">
          Take the test →
        </Link>
      </div>
    );
  }

  const s = scoreAttempt(paper, a);
  const n = paper.questions.length;
  const weakest = [...s.bySubject].sort((x, y) => x.correct / x.total - y.correct / y.total || y.total - x.total)[0];
  const reattempt = () => {
    clearAttempt(testId);
    router.push(routes.test(slug, testId));
  };
  const shown = paper.questions
    .map((q, i) => ({ q, i, given: a.answers[i] }))
    .filter(({ q, given }) => (filter === "all" ? true : filter === "skipped" ? given === null : given !== null && given !== q.answer));

  return (
    <>
      <section aria-labelledby="report-title" className="bg-ink pb-[clamp(3.5rem,7vw,6rem)]">
        <div className="container-v">
          <p className="eyebrow text-ivory">Report card · {seriesName}</p>
          <h1 id="report-title" className="mt-4 text-[clamp(2.75rem,5.6vw,5.25rem)] leading-[0.9] tracking-[-0.025em]">
            {testTitle}
          </h1>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
            <div className="grid content-between gap-6 border-t border-ivory/40 pt-5">
              <span className="eyebrow">Score</span>
              <p className="flex items-baseline gap-3 font-display leading-none tabular-nums">
                <span className="text-[clamp(4.5rem,9vw,7.5rem)] text-ivory">{s.score}</span>
                <span className="text-3xl text-mute-d">/ {s.maxScore}</span>
              </p>
              <div>
                <div className="flex h-2 overflow-hidden" role="img" aria-label={`${s.correct} correct, ${s.wrong} wrong, ${s.skipped} skipped`}>
                  <span className="bg-ok" style={{ width: `${(s.correct / n) * 100}%` }} />
                  <span className="bg-bad" style={{ width: `${(s.wrong / n) * 100}%` }} />
                  <span className="bg-ivory/15" style={{ width: `${(s.skipped / n) * 100}%` }} />
                </div>
                <p className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[0.6875rem] tracking-[0.1em] uppercase">
                  <span className="text-ok">{s.correct} correct</span>
                  <span className="text-bad">{s.wrong} wrong</span>
                  <span className="text-mute-d">{s.skipped} skipped</span>
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 lg:grid-cols-4">
              {[
                { k: "Accuracy", v: pct(s.accuracy), note: "Correct out of attempted" },
                { k: "Time taken", v: formatDuration(s.timeTakenSec), note: `of ${paper.durationMin} min` },
                { k: "Rank", v: "—", note: "When the series is live" },
                { k: "Percentile", v: "—", note: "When the series is live" },
              ].map((m) => (
                <div key={m.k} className="grid content-between gap-6 border-t border-ivory/40 pt-5 pb-8">
                  <dt className="eyebrow">{m.k}</dt>
                  <dd>
                    <span className={`block font-display text-[clamp(2.25rem,3.4vw,3rem)] leading-none tabular-nums ${m.v === "—" ? "text-ivory/40" : ""}`}>{m.v}</span>
                    <span className="mt-2 block text-xs text-mute-d">{m.note}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-4 max-w-[70ch] text-xs text-mute-d">Rank and percentile compare you with every Vidyansh student who took the same test, so they appear once the series is live. Everything else above comes from your own answers.</p>
        </div>
      </section>

      <section aria-labelledby="subjects-title" className="border-t border-[var(--line-d)] bg-night py-[clamp(3.5rem,7vw,6rem)]">
        <div className="container-v grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 id="subjects-title" className="text-[clamp(2.25rem,4vw,3.5rem)] leading-[0.95]">
              By <em className="font-normal text-ivory">subject</em>
            </h2>
            {weakest && (
              <div className="mt-8 border-l-2 border-ivory pl-4">
                <p className="eyebrow">Recommended next</p>
                <p className="mt-2 font-display text-[1.5rem] leading-snug">Revise {weakest.subject.toLowerCase()} with Shubham Sir&rsquo;s concept class, then take the next test.</p>
                <Link href="/#courses" className="link-underline mt-3 inline-block font-mono text-[0.6875rem] tracking-[0.16em] text-ivory uppercase">
                  Find the course →
                </Link>
              </div>
            )}
          </div>
          <ul className="border-t border-[var(--line-d)]">
            {s.bySubject.map((b) => {
              const acc = b.attempted ? b.correct / b.attempted : null;
              return (
                <li key={b.subject} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2.5 border-b border-[var(--line-d)] py-4">
                  <span className="font-display text-[1.35rem]">{b.subject}</span>
                  <span className="font-mono text-[0.75rem] tabular-nums text-body-d">
                    {b.correct}/{b.total} correct · {pct(acc)} accuracy
                  </span>
                  <span className="col-span-2 h-1.5 bg-ivory/10" aria-hidden="true">
                    <span className="block h-full bg-ivory" style={{ width: `${(b.correct / b.total) * 100}%` }} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="solutions" aria-labelledby="solutions-title" className="border-t border-[var(--line-d)] bg-ink py-[clamp(3.5rem,7vw,6rem)]">
        <div className="container-v max-w-4xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="solutions-title" className="text-[clamp(2.25rem,4vw,3.5rem)] leading-[0.95]">
              Solutions
            </h2>
            <div role="group" aria-label="Show" className="flex gap-1.5">
              {(
                [
                  ["all", `All ${n}`],
                  ["wrong", `Wrong ${s.wrong}`],
                  ["skipped", `Skipped ${s.skipped}`],
                ] as [Filter, string][]
              ).map(([f, label]) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`border px-3 py-2 font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-colors ${filter === f ? "border-ivory text-ivory" : "border-[var(--line-d)] text-mute-d hover:text-ivory"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <ol className="mt-8 border-t border-[var(--line-d)]">
            {shown.map(({ q, i, given }) => {
              const verdict = given === null ? "Skipped" : given === q.answer ? "Correct" : "Wrong";
              const tone = given === null ? "text-mute-d border-[var(--line-d)]" : given === q.answer ? "text-ok border-ok/50" : "text-bad border-bad/50";
              return (
                <li key={q.id} className="border-b border-[var(--line-d)] py-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-mute-d">Q{String(i + 1).padStart(2, "0")}</span>
                    <span className="eyebrow">{q.subject}</span>
                    <span className={`border px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.14em] uppercase ${tone}`}>{verdict}</span>
                  </div>
                  <p className="mt-3 font-display text-[1.4rem] leading-snug">{q.text}</p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {q.options.map((o, k) => {
                      const right = k === q.answer;
                      const picked = k === given;
                      return (
                        <li
                          key={o}
                          className={`flex items-center gap-3 border px-3 py-2.5 ${right ? "border-ok/60 bg-ok/[0.08]" : picked ? "border-bad/60 bg-bad/[0.08]" : "border-[var(--line-d)]"}`}
                        >
                          <span className="font-mono text-[0.6875rem] text-mute-d">{String.fromCharCode(65 + k)}</span>
                          <span className="font-display text-lg">{o}</span>
                          {(right || picked) && (
                            <span className={`ml-auto font-mono text-[0.5625rem] tracking-[0.12em] uppercase ${right ? "text-ok" : "text-bad"}`}>{right ? (picked ? "Your answer · correct" : "Correct") : "Your answer"}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-4 border-l border-ivory/40 pl-4 text-[0.9375rem] text-body-d">{q.explanation}</p>
                </li>
              );
            })}
            {shown.length === 0 && <li className="py-8 text-body-d">Nothing to show here.</li>}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reattempt}
              className="inline-flex items-center border border-ivory/30 px-5 py-3.5 font-mono text-[0.6875rem] font-medium tracking-[0.16em] uppercase transition-colors hover:border-ivory hover:text-ivory"
            >
              Reattempt
            </button>
            <Link
              href={`${routes.series(slug)}#access`}
              className="inline-flex items-center gap-3 border border-ivory bg-ivory px-5 py-3.5 font-mono text-[0.6875rem] font-medium tracking-[0.16em] text-ink uppercase transition-colors hover:bg-transparent hover:text-ivory"
            >
              Unlock the full series
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
