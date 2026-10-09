"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { formatClock, loadAttempt, newAttempt, saveAttempt } from "@/lib/attempt";
import { routes } from "@/lib/routes";
import type { AttemptState, Paper } from "@/lib/types";

type Cell = "answered" | "marked-answered" | "marked" | "visited" | "unseen";

const cellOf = (a: AttemptState, i: number): Cell => {
  const answered = a.answers[i] !== null;
  if (a.marked[i]) return answered ? "marked-answered" : "marked";
  if (answered) return "answered";
  return a.visited[i] ? "visited" : "unseen";
};

const cellStyle: Record<Cell, string> = {
  answered: "border-ok bg-ok text-ink",
  "marked-answered": "border-mark bg-mark text-ink",
  marked: "border-mark text-mark",
  visited: "border-mute-d bg-ivory/15 text-ivory",
  unseen: "border-mute-d/70 text-mute-d",
};

const cellLabel: Record<Cell, string> = {
  answered: "answered",
  "marked-answered": "answered and marked for review",
  marked: "marked for review",
  visited: "visited, not answered",
  unseen: "not seen",
};

/**
 * State 4, "test in progress": the full-screen examination console. Answers autosave
 * on this device after every change, so a closed tab can be resumed.
 */
export function TestConsole({ paper, slug, testId, seriesName, testTitle }: { paper: Paper; slug: string; testId: string; seriesName: string; testTitle: string }) {
  const router = useRouter();
  const [a, setA] = useState<AttemptState | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const submitted = useRef(false);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadAttempt(testId);
    if (saved?.submittedAt) {
      router.replace(routes.result(slug, testId));
      return;
    }
    const start = saved && saved.paperId === paper.id ? saved : newAttempt(paper);
    saveAttempt(testId, start);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the attempt lives in localStorage, readable only after hydration
    setA(start);
  }, [paper, router, slug, testId]);

  const update = useCallback(
    (fn: (prev: AttemptState) => AttemptState) =>
      setA((prev) => {
        if (!prev) return prev;
        const next = fn(prev);
        saveAttempt(testId, next);
        return next;
      }),
    [testId],
  );

  const submit = useCallback(() => {
    if (submitted.current) return;
    submitted.current = true;
    setA((prev) => {
      if (!prev) return prev;
      const done = { ...prev, submittedAt: Date.now() };
      saveAttempt(testId, done);
      return done;
    });
    router.push(routes.result(slug, testId));
  }, [router, slug, testId]);

  const total = paper.durationMin * 60;
  const left = a ? Math.max(0, total - Math.floor((now - a.startedAt) / 1000)) : total;

  useEffect(() => {
    if (!a) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [a]);

  useEffect(() => {
    if (a && left === 0) submit();
  }, [a, left, submit]);

  useEffect(() => {
    if (!confirming) return;
    dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setConfirming(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirming]);

  if (!a) {
    return (
      <div className="grid min-h-svh place-items-center bg-ink">
        <p className="eyebrow" role="status">
          Preparing your paper…
        </p>
      </div>
    );
  }

  const i = a.current;
  const q = paper.questions[i];
  const n = paper.questions.length;
  const go = (to: number) => {
    update((p) => {
      const visited = [...p.visited];
      visited[to] = true;
      return { ...p, current: to, visited };
    });
    setSheetOpen(false);
    requestAnimationFrame(() => questionRef.current?.focus());
  };
  const choose = (opt: number) =>
    update((p) => {
      const answers = [...p.answers];
      answers[p.current] = opt;
      return { ...p, answers };
    });
  const clear = () =>
    update((p) => {
      const answers = [...p.answers];
      answers[p.current] = null;
      return { ...p, answers };
    });
  const markAndNext = () => {
    update((p) => {
      const marked = [...p.marked];
      marked[p.current] = !marked[p.current];
      return { ...p, marked };
    });
    if (i < n - 1) go(i + 1);
  };

  const counts = paper.questions.reduce(
    (c, _, k) => {
      const cell = cellOf(a, k);
      c[cell] += 1;
      return c;
    },
    { answered: 0, "marked-answered": 0, marked: 0, visited: 0, unseen: 0 } as Record<Cell, number>,
  );
  const answeredTotal = counts.answered + counts["marked-answered"];
  const low = left <= 60;

  const sheet = (
    <div className="grid content-start gap-5">
      <div className="flex items-center justify-between">
        <h2 className="eyebrow text-ivory">Answer sheet</h2>
        <span className="font-mono text-[0.6875rem] text-mute-d tabular-nums">
          {answeredTotal} / {n} answered
        </span>
      </div>
      <ol className="grid grid-cols-5 gap-2.5">
        {paper.questions.map((qq, k) => {
          const cell = cellOf(a, k);
          return (
            <li key={qq.id}>
              <button
                type="button"
                onClick={() => go(k)}
                aria-current={k === i ? "step" : undefined}
                aria-label={`Question ${k + 1}, ${cellLabel[cell]}`}
                className={`grid aspect-square w-full place-items-center rounded-full border font-mono text-[0.6875rem] tabular-nums transition-shadow ${cellStyle[cell]} ${
                  k === i ? "ring-2 ring-ivory ring-offset-2 ring-offset-charcoal" : "hover:ring-1 hover:ring-ivory/40"
                }`}
              >
                {k + 1}
              </button>
            </li>
          );
        })}
      </ol>
      <ul className="grid gap-2 border-t border-[var(--line-d)] pt-4 text-[0.75rem] text-body-d">
        {(
          [
            ["answered", "Answered"],
            ["marked-answered", "Answered, marked"],
            ["marked", "Marked for review"],
            ["visited", "Not answered"],
            ["unseen", "Not seen"],
          ] as [Cell, string][]
        ).map(([c, label]) => (
          <li key={c} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2.5">
              <span aria-hidden="true" className={`size-3.5 rounded-full border ${cellStyle[c]}`} />
              {label}
            </span>
            <span className="font-mono tabular-nums">{counts[c]}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="border border-ivory px-4 py-3.5 font-mono text-[0.6875rem] font-medium tracking-[0.17em] uppercase transition-colors hover:bg-ivory hover:text-ink"
      >
        Submit test
      </button>
    </div>
  );

  return (
    <div className="flex min-h-svh flex-col overflow-x-clip bg-ink">
      <header className="sticky top-0 z-30 border-b border-[var(--line-d)] bg-ink/95 backdrop-blur pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between gap-4 px-[var(--gutter)] py-2.5">
          <div className="flex min-w-0 items-center gap-3.5">
            <Logo size={40} decorative className="size-9 shrink-0" />
            <div className="min-w-0">
              <p className="truncate font-display text-lg leading-tight">{testTitle}</p>
              <p className="truncate font-mono text-[0.5625rem] tracking-[0.14em] text-mute-d uppercase">{seriesName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={routes.series(slug)} className="hidden font-mono text-[0.625rem] tracking-[0.14em] text-mute-d uppercase hover:text-ivory sm:block">
              Save & exit
            </Link>
            <div
              role="timer"
              aria-label={`Time remaining ${Math.floor(left / 60)} minutes ${left % 60} seconds`}
              className={`flex items-center gap-2 border px-3 py-2 font-mono text-lg tabular-nums sm:text-xl ${low ? "border-bad text-bad" : "border-[var(--hair)] text-ivory"}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
                <circle cx="12" cy="13" r="8.5" fill="none" stroke="currentColor" />
                <path d="M12 13V8.5M10 2.5h4" stroke="currentColor" fill="none" />
              </svg>
              {formatClock(left)}
            </div>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="border border-[var(--hair)] px-3 py-2.5 font-mono text-[0.625rem] tracking-[0.14em] uppercase lg:hidden"
              aria-haspopup="dialog"
            >
              Sheet {answeredTotal}/{n}
            </button>
          </div>
        </div>
        <div className="h-0.5 bg-ivory/5" aria-hidden="true">
          <div className="h-full bg-ivory/60 transition-[width] duration-1000 ease-linear" style={{ width: `${(left / total) * 100}%` }} />
        </div>
      </header>

      <div className="flex flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_21rem]">
        <main id="main" className="flex min-w-0 flex-1 flex-col">
          <div className="mx-auto w-full max-w-3xl flex-1 px-[var(--gutter)] py-[clamp(1.75rem,4vw,3rem)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-mute-d uppercase">
                Question <span className="text-ivory tabular-nums">{String(i + 1).padStart(2, "0")}</span> of {n}
              </p>
              <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ivory uppercase">{q.subject}</p>
            </div>
            <div className="mt-3 h-px bg-[var(--line-d)]" />
            <fieldset className="mt-7">
              <legend className="contents">
                <h1 ref={questionRef} tabIndex={-1} className="font-display text-[clamp(1.5rem,2.6vw,2.15rem)] leading-snug font-normal outline-none">
                  {q.text}
                </h1>
              </legend>
              <div className="mt-8 grid gap-3">
                {q.options.map((o, k) => {
                  const on = a.answers[i] === k;
                  return (
                    <label
                      key={o}
                      className={`flex cursor-pointer items-center gap-4 border px-4 py-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ivory ${
                        on ? "border-ivory bg-ivory/[0.06]" : "border-[var(--line-d)] hover:border-ivory/35"
                      }`}
                    >
                      <input type="radio" name={`q-${q.id}`} checked={on} onChange={() => choose(k)} className="sr-only" />
                      <span
                        aria-hidden="true"
                        className={`grid size-7 shrink-0 place-items-center rounded-full border font-mono text-[0.6875rem] ${on ? "border-ivory bg-ivory text-ink" : "border-mute-d text-mute-d"}`}
                      >
                        {String.fromCharCode(65 + k)}
                      </span>
                      <span className="font-display text-[1.3rem] leading-snug">{o}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <p className="mt-5 flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.12em] text-mute-d uppercase" aria-live="polite">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ok" />
              Saved on this device
            </p>
          </div>

          <div className="sticky bottom-0 border-t border-[var(--line-d)] bg-charcoal/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
            <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-2.5 px-[var(--gutter)] py-3">
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={markAndNext} className="border border-mark/60 px-3.5 py-2.5 font-mono text-[0.625rem] tracking-[0.14em] text-mark uppercase transition-colors hover:bg-mark/10">
                  {a.marked[i] ? "Unmark" : "Mark for review"}
                  {i < n - 1 ? " & next" : ""}
                </button>
                <button
                  type="button"
                  onClick={clear}
                  disabled={a.answers[i] === null}
                  className="border border-[var(--line-d)] px-3.5 py-2.5 font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-colors enabled:hover:border-ivory/40 disabled:text-mute-d/60"
                >
                  Clear
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(i - 1)}
                  disabled={i === 0}
                  className="border border-[var(--line-d)] px-3.5 py-2.5 font-mono text-[0.625rem] tracking-[0.14em] uppercase enabled:hover:border-ivory/40 disabled:text-mute-d/60"
                >
                  ← Prev
                </button>
                {i < n - 1 ? (
                  <button type="button" onClick={() => go(i + 1)} className="border border-ivory bg-ivory px-4 py-2.5 font-mono text-[0.625rem] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:bg-transparent hover:text-ivory">
                    Save & next →
                  </button>
                ) : (
                  <button type="button" onClick={() => setConfirming(true)} className="border border-ivory bg-ivory px-4 py-2.5 font-mono text-[0.625rem] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:bg-transparent hover:text-ivory">
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>

        <aside aria-label="Answer sheet" className="hidden border-l border-[var(--line-d)] bg-charcoal p-6 lg:block">
          <div className="sticky top-24">{sheet}</div>
        </aside>
      </div>

      {sheetOpen && (
        <div role="dialog" aria-modal="true" aria-label="Answer sheet" className="fixed inset-0 z-50 flex justify-end bg-ink/70 lg:hidden" onClick={() => setSheetOpen(false)}>
          <div className="h-full w-[min(22rem,88vw)] overflow-y-auto bg-charcoal p-6" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setSheetOpen(false)} className="eyebrow mb-5 hover:text-ivory" autoFocus>
              Close ✕
            </button>
            {sheet}
          </div>
        </div>
      )}

      {confirming && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/80 p-4 backdrop-blur-sm">
          <div ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc" className="w-full max-w-md border border-[var(--hair)] bg-charcoal p-6">
            <h2 id="confirm-title" className="text-[2rem] leading-tight">
              Submit the test?
            </h2>
            <p id="confirm-desc" className="mt-2 text-sm text-body-d">
              You cannot change answers after submitting. {formatClock(left)} remains on the clock.
            </p>
            <dl className="mt-5 grid grid-cols-3 border-t border-l border-[var(--line-d)] text-center">
              {[
                ["Answered", answeredTotal],
                ["Marked", counts.marked + counts["marked-answered"]],
                ["Not answered", n - answeredTotal],
              ].map(([k, v]) => (
                <div key={k} className="border-r border-b border-[var(--line-d)] p-3">
                  <dt className="font-mono text-[0.5625rem] tracking-[0.12em] text-mute-d uppercase">{k}</dt>
                  <dd className="mt-1 font-display text-3xl tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap justify-end gap-2.5">
              <button type="button" onClick={() => setConfirming(false)} className="border border-[var(--line-d)] px-4 py-3 font-mono text-[0.6875rem] tracking-[0.14em] uppercase hover:border-ivory/40">
                Back to test
              </button>
              <button type="button" onClick={submit} className="border border-ivory bg-ivory px-4 py-3 font-mono text-[0.6875rem] font-medium tracking-[0.14em] text-ink uppercase hover:bg-transparent hover:text-ivory">
                Submit now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
