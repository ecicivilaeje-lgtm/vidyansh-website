"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { MaterialFormat, SpineTone, StudyMaterial } from "@/lib/learning-types";
import { orDash } from "@/lib/format";

interface Props {
  materials: StudyMaterial[];
  examOptions: { code: string; name: string }[];
  formats: Record<MaterialFormat, string>;
}

const tones: Record<SpineTone, string> = {
  ink: "bg-ink text-ivory border-ink",
  graphite: "bg-graphite text-ivory border-graphite",
  charcoal: "bg-charcoal text-ivory border-charcoal",
  parchment: "bg-parchment text-ink border-ink/30",
};

const shelfLetters = "ABCDEFGHIJ";

/**
 * The library: material stands on ruled shelves as book spines, grouped by subject.
 * Spines are buttons with a roving tabindex (arrow keys move, Enter or Space opens).
 */
export function Bookshelf({ materials, examOptions, formats }: Props) {
  const [exam, setExam] = useState<string>("all");
  const [format, setFormat] = useState<MaterialFormat | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(materials[0]?.id ?? null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const refs = useRef(new Map<string, HTMLButtonElement>());

  const examName = useMemo(() => Object.fromEntries(examOptions.map((e) => [e.code, e.name])), [examOptions]);
  const usedExams = useMemo(() => examOptions.filter((e) => materials.some((m) => (m.exams as string[]).includes(e.code))), [examOptions, materials]);

  const visible = materials.filter((m) => (exam === "all" || (m.exams as string[]).includes(exam)) && (format === "all" || m.format === format));
  const groups: { subject: string; items: StudyMaterial[] }[] = [];
  for (const m of visible) {
    const g = groups.find((x) => x.subject === m.subject);
    if (g) g.items.push(m);
    else groups.push({ subject: m.subject, items: [m] });
  }
  const order = groups.flatMap((g) => g.items);
  const ids = order.map((m) => m.id);
  const selected = order.find((m) => m.id === selectedId) ?? null;
  const tabId = focusId && ids.includes(focusId) ? focusId : selected ? selected.id : (ids[0] ?? null);

  const move = (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
    const i = ids.indexOf(id);
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % ids.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + ids.length) % ids.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = ids.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setFocusId(ids[next]);
    refs.current.get(ids[next])?.focus();
  };

  return (
    <div>
      {/* Filters: plain text toggles */}
      <div className="grid gap-5 border-t border-ink pt-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-x-10">
        <Toggles
          label="Exam"
          options={[{ value: "all", label: "All exams" }, ...usedExams.map((e) => ({ value: e.code, label: e.name }))]}
          value={exam}
          onChange={setExam}
        />
        <Toggles
          label="Format"
          options={[{ value: "all", label: "Every format" }, ...(Object.keys(formats) as MaterialFormat[]).map((f) => ({ value: f, label: formats[f] }))]}
          value={format}
          onChange={(v) => setFormat(v as MaterialFormat | "all")}
        />
      </div>
      <p aria-live="polite" className="eyebrow mt-6">
        {visible.length} of {materials.length} titles on the shelf
      </p>

      {/* The shelf */}
      <div role="group" aria-label="Bookshelf" aria-describedby="shelf-keys" className="mt-[clamp(2.5rem,5vw,4rem)]">
        <p id="shelf-keys" className="sr-only">
          Use the arrow keys to move between books, and Enter or Space to open one.
        </p>
        {groups.length === 0 ? (
          <div className="border-b-[3px] border-ink py-16">
            <p className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">
              Nothing on this shelf <em className="font-normal">yet.</em>
            </p>
            <p className="mt-3 text-mute-l">Try another exam or format.</p>
          </div>
        ) : (
          <div className="flex flex-wrap">
            {groups.map((g, gi) => (
              <section key={g.subject} aria-label={g.subject} className="min-w-0 pt-2">
                <div className="flex items-baseline gap-3 pr-[clamp(1.75rem,4vw,3.5rem)] pb-4">
                  <span className="font-mono text-[0.625rem] tracking-[0.16em] text-mute-l uppercase">Shelf {shelfLetters[gi] ?? gi + 1}</span>
                  <span className="font-display text-[1.375rem] leading-none italic">{g.subject}</span>
                </div>
                <div className="flex h-[19.5rem] items-end gap-[3px] pr-[clamp(1.75rem,4vw,3.5rem)]">
                  {g.items.map((m) => {
                    const isSel = selected?.id === m.id;
                    return (
                      <button
                        key={m.id}
                        ref={(el) => {
                          if (el) refs.current.set(m.id, el);
                          else refs.current.delete(m.id);
                        }}
                        type="button"
                        tabIndex={m.id === tabId ? 0 : -1}
                        aria-pressed={isSel}
                        aria-controls="book-detail"
                        aria-label={`${m.title}, ${m.subject}, ${formats[m.format]}, ${m.code}`}
                        onClick={() => {
                          setSelectedId(m.id);
                          setFocusId(m.id);
                        }}
                        onFocus={() => setFocusId(m.id)}
                        onKeyDown={(e) => move(e, m.id)}
                        style={{ height: `${m.spine.height}rem`, width: `${m.spine.width}rem` }}
                        className={`relative flex shrink-0 cursor-pointer flex-col items-center justify-between border px-1 pt-3 pb-2.5 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out-expo ${tones[m.spine.tone]} ${
                          isSel ? "-translate-y-5" : "hover:-translate-y-2"
                        }`}
                      >
                        <span aria-hidden="true" className="grid w-full gap-[3px] px-0.5">
                          <span className="h-px bg-current opacity-35" />
                          <span className="h-px bg-current opacity-35" />
                        </span>
                        <span aria-hidden="true" className="min-h-0 flex-1 overflow-hidden py-3 text-ellipsis font-display text-[clamp(0.95rem,1.2vw,1.125rem)] leading-none whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
                          {m.title}
                        </span>
                        <span aria-hidden="true" className="font-mono text-[0.5625rem] tracking-[0.14em] [writing-mode:vertical-rl] rotate-180">
                          {m.code}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div aria-hidden="true" className="h-[3px] bg-ink" />
                <div aria-hidden="true" className="h-2.5 border-b border-[var(--line-l)]" />
              </section>
            ))}
          </div>
        )}
      </div>

      {/* The open book */}
      <p aria-live="polite" className="sr-only">{selected ? `Opened ${selected.title}, ${selected.code}` : ""}</p>
      <div id="book-detail" className="mt-[var(--space-block)] border-t border-ink pt-8">
        {selected ? (
          <article className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-[clamp(3rem,6vw,7rem)]">
            <div>
              <p className="eyebrow">
                Open on the desk · <span className="tabular-nums">{selected.code}</span>
              </p>
              <h2 className="mt-5 text-[clamp(2.6rem,5.4vw,5.25rem)] leading-[0.9] tracking-[-0.025em]">{selected.title}</h2>
              <p className="mt-6 max-w-[48ch] text-mute-l">
                {selected.availability === "free"
                  ? "Free for every aspirant. The file will be available to download here once it is published."
                  : "Part of the course material. Students receive it with their course."}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <button
                  type="button"
                  disabled
                  aria-describedby="download-note"
                  className="inline-flex cursor-not-allowed items-center gap-3 border border-ink/25 px-6 py-[1.1rem] font-mono text-[0.75rem] font-medium tracking-[0.17em] text-ink uppercase"
                >
                  Download · Coming soon
                </button>
                {selected.availability === "course" && (
                  <Link href="/courses" className="group inline-flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.16em] uppercase">
                    <span className="link-underline">See the courses</span>
                    <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">→</span>
                  </Link>
                )}
              </div>
              <p id="download-note" className="mt-4 text-sm text-mute-l">
                Downloads open when the library is published.
              </p>
            </div>
            <dl className="grid content-start border-t border-[var(--line-l)] lg:border-t-0">
              {[
                ["Subject", selected.subject],
                ["Exam", selected.exams.map((c) => examName[c] ?? c).join(" · ")],
                ["Format", formats[selected.format]],
                ["Pages", orDash(selected.pages)],
                ["Availability", selected.availability === "free" ? "Free download" : "Included with course"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-[var(--line-l)] py-4">
                  <dt className="eyebrow">{k}</dt>
                  <dd className="font-display text-[1.375rem] leading-snug">{v}</dd>
                </div>
              ))}
            </dl>
          </article>
        ) : (
          <p className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-mute-l">
            Choose a spine to <em className="font-normal">open it.</em>
          </p>
        )}
      </div>
    </div>
  );
}

function Toggles({ label, options, value, onChange }: { label: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  const id = `filter-${label.toLowerCase()}`;
  return (
    <>
      <p id={id} className="eyebrow pt-1.5">
        {label}
      </p>
      <div role="group" aria-labelledby={id} className="flex flex-wrap gap-x-6 gap-y-2">
        {options.map((o) => {
          const on = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.value)}
              className={`py-1 font-display text-[1.3125rem] leading-tight transition-colors duration-300 ${on ? "italic underline decoration-1 underline-offset-[6px]" : "text-mute-l hover:text-ink"}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
