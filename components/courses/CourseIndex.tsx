"use client";

import Link from "next/link";
import { useCallback, useId, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { CoursePlate, plateCaption } from "@/components/courses/CoursePlate";
import { examByCode } from "@/content/exams";
import type { Course } from "@/lib/types";

type Filter = { exam: Course["exam"] | null; mode: Course["mode"] | null };

const PREVIEW_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribePreview(cb: () => void) {
  const mq = window.matchMedia(PREVIEW_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** The prospectus index: a sticky filter column beside one tall ruled row per course. */
export function CourseIndex({ courses }: { courses: Course[] }) {
  const [filter, setFilter] = useState<Filter>({ exam: null, mode: null });
  const [active, setActive] = useState<string | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const countId = useId();
  const canPreview = useSyncExternalStore(subscribePreview, () => window.matchMedia(PREVIEW_QUERY).matches, () => false);

  const examOptions = unique(courses.map((c) => [c.exam, examByCode(c.exam)?.name ?? c.title[0]] as const));
  const modeOptions = unique(courses.map((c) => [c.mode, c.mode] as const));
  const shown = courses.filter((c) => (!filter.exam || c.exam === filter.exam) && (!filter.mode || c.mode === filter.mode));

  const place = useCallback((e: PointerEvent) => {
    const el = frame.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const gap = 36;
    let x = e.clientX + gap;
    if (x + w > window.innerWidth - 16) x = e.clientX - gap - w;
    const y = Math.min(Math.max(e.clientY - h / 2, 16), window.innerHeight - h - 16);
    el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  }, []);

  return (
    <div className="grid gap-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-[clamp(3rem,6vw,7rem)]">
      <aside aria-label="Filter courses" className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
        <div className="grid gap-10 max-lg:grid-cols-1 sm:max-lg:grid-cols-2">
          <ToggleGroup
            label="By exam"
            options={examOptions}
            value={filter.exam}
            onChange={(exam) => setFilter((f) => ({ ...f, exam }))}
          />
          <ToggleGroup
            label="By mode"
            options={modeOptions}
            value={filter.mode}
            onChange={(mode) => setFilter((f) => ({ ...f, mode }))}
          />
        </div>
        <p id={countId} aria-live="polite" className="mt-10 font-mono text-xs tracking-[0.14em] text-mute-l uppercase tabular-nums">
          Showing {pad(shown.length)} of {pad(courses.length)}
        </p>
      </aside>

      <div>
        <ol aria-describedby={countId} className="border-t border-ink" onPointerLeave={() => setActive(null)}>
          {shown.map((c) => {
            const n = courses.indexOf(c);
            return (
              <li
                key={c.slug}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  place(e);
                  setActive(c.slug);
                }}
                onPointerMove={canPreview ? place : undefined}
                className="group relative grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-5 border-b border-[var(--line-l)] py-[clamp(2.25rem,4.5vw,4rem)] md:grid-cols-[3.5rem_minmax(0,1fr)_auto]"
              >
                <span className="font-mono text-xs tracking-[0.12em] text-mute-l tabular-nums">{pad(n + 1)}</span>
                <div className="grid min-w-0 gap-5">
                  <span className="eyebrow">{c.category}</span>
                  <h2 className="font-display text-[clamp(2.75rem,7.2vw,7.25rem)] leading-[0.86] font-normal tracking-[-0.035em] transition-[font-style] duration-300">
                    <Link
                      href={`/courses/${c.slug}`}
                      className="after:absolute after:inset-0 after:content-[''] group-hover:italic"
                    >
                      {c.title[0]} <em className="font-normal">{c.title[1]}</em>
                    </Link>
                  </h2>
                  <p className="max-w-[46ch] text-[1.0625rem] text-mute-l">{c.lead}</p>
                  <dl className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.75rem] tracking-[0.12em] uppercase">
                    {(
                      [
                        ["Mode", c.mode],
                        ["Duration", c.duration],
                        ["Next batch", c.nextBatch],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <dt className="text-mute-l">{k}</dt>
                        <dd className="text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <span
                  aria-hidden="true"
                  className="self-center font-display text-[clamp(2rem,3.5vw,3.25rem)] leading-none transition-transform duration-500 ease-out-expo group-hover:translate-x-3"
                >
                  →
                </span>
              </li>
            );
          })}
        </ol>
        {shown.length === 0 && (
          <div className="grid gap-5 border-b border-[var(--line-l)] py-14">
            <p className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">
              No course matches <em className="font-normal">both</em> filters yet.
            </p>
            <button
              type="button"
              onClick={() => setFilter({ exam: null, mode: null })}
              className="link-underline justify-self-start font-mono text-xs font-medium tracking-[0.16em] uppercase"
            >
              Clear filters →
            </button>
          </div>
        )}
      </div>

      {canPreview && (
        <div
          ref={frame}
          aria-hidden="true"
          className={`pointer-events-none fixed top-0 left-0 z-40 aspect-[4/5] w-[clamp(15rem,20vw,19.5rem)] plate-sheet shadow-[0_2rem_4rem_-1.5rem_rgb(7_7_6/0.45)] transition-opacity duration-300 ease-out-expo ${
            active && shown.some((c) => c.slug === active) ? "opacity-100" : "opacity-0"
          }`}
        >
          {courses.map((c, i) => (
            <div key={c.slug} className={`absolute inset-0 transition-opacity duration-300 ${active === c.slug ? "opacity-100" : "opacity-0"}`}>
              <CoursePlate plate={c.plate} index={i} label={c.title[0]} />
              <span className="absolute top-3 left-3 font-mono text-[0.5625rem] tracking-[0.14em] text-mute-d uppercase">{plateCaption(c.plate)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ToggleGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: (readonly [T, string])[];
  value: T | null;
  onChange: (v: T | null) => void;
}) {
  const items: (readonly [T | null, string])[] = [[null, "All"], ...options];
  return (
    <fieldset className="grid gap-3">
      <legend className="eyebrow mb-3">{label}</legend>
      <div className="grid justify-items-start gap-1 border-t border-ink pt-3">
        {items.map(([v, text]) => {
          const on = value === v;
          return (
            <button
              key={text}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(v)}
              className={`group flex items-baseline gap-3 py-1 text-left font-display text-[1.375rem] leading-tight transition-colors duration-300 ${
                on ? "text-ink italic" : "text-mute-l hover:text-ink"
              }`}
            >
              <span aria-hidden="true" className={`inline-block size-[6px] shrink-0 -translate-y-[0.2em] rotate-45 border border-ink ${on ? "bg-ink" : "bg-transparent"}`} />
              {text}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function unique<T extends string>(pairs: (readonly [T, string])[]) {
  const seen = new Map<T, string>();
  pairs.forEach(([k, v]) => seen.set(k, v));
  return [...seen.entries()] as (readonly [T, string])[];
}

const pad = (n: number) => String(n).padStart(2, "0");
