"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { ExamCode } from "@/lib/types";
import type { ResultsBoard } from "@/lib/people-types";
import { FlapText } from "./FlapText";

const columns = ["Student", "From", "Destination", "Rank", "Year"] as const;

/** The arrivals board: year tabs, an exam filter and a split-flap table. */
export function ArrivalsBoard({ board }: { board: ResultsBoard }) {
  const [year, setYear] = useState(board.years[0]);
  const [exam, setExam] = useState<ExamCode | "all">("all");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  const rows = board.rows.filter((r) => r.year === year && (exam === "all" || r.exam === exam));
  const examLabel = exam === "all" ? "all exams" : (board.exams.find((e) => e.code === exam)?.label ?? exam);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = board.years.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    setYear(board.years[next]);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <div className="grid gap-8 border-b border-ivory/40 pb-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div>
          <p className="eyebrow" id={`${id}-years`}>
            Year
          </p>
          <div role="tablist" aria-labelledby={`${id}-years`} className="mt-3 flex gap-8">
            {board.years.map((y, i) => (
              <button
                key={y}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${y}`}
                aria-selected={year === y}
                aria-controls={`${id}-panel`}
                tabIndex={year === y ? 0 : -1}
                onClick={() => setYear(y)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`border-b pb-1 font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-none tabular-nums transition-colors duration-500 ease-out-expo ${
                  year === y ? "border-ivory text-ivory italic" : "border-transparent text-mute-d hover:text-ivory"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div role="group" aria-label="Filter by exam" className="flex flex-wrap gap-x-6 gap-y-3 lg:justify-self-end">
          {[{ code: "all" as const, label: "All exams" }, ...board.exams].map((e) => (
            <button
              key={e.code}
              type="button"
              aria-pressed={exam === e.code}
              onClick={() => setExam(e.code)}
              className={`border-b py-1 font-mono text-[0.75rem] font-medium tracking-[0.17em] uppercase transition-colors duration-300 ${
                exam === e.code ? "border-ivory text-ivory" : "border-transparent text-mute-d hover:text-ivory"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="eyebrow mt-5">
        {rows.length} {board.isSample ? "sample " : ""}
        {rows.length === 1 ? "arrival" : "arrivals"} · {year} · {examLabel}
      </p>

      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${year}`} tabIndex={0} className="mt-6 outline-offset-8">
        <table className="arrivals stack-table w-full border-collapse font-mono">
          <caption className="sr-only">
            Arrivals board for {year}, {examLabel}
            {board.isSample ? ". Sample rows; verified results will replace them" : ""}
          </caption>
          <thead>
            <tr className="eyebrow text-left">
              {columns.map((h) => (
                <th key={h} scope="col" className={`border-b border-[var(--line-d)] py-3 pr-4 font-medium ${h === "Year" ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          {/* Keyed so the characters turn over again whenever the board changes. */}
          <tbody key={`${year}-${exam}`}>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="border-b border-[var(--line-d)] py-10 text-body-d">
                  No arrivals on this board yet.
                </td>
              </tr>
            ) : (
              rows.map((r, ri) => (
                <tr key={r.id}>
                  <td className="border-b border-[var(--line-d)] py-4 pr-4 align-middle">
                    <FlapText text={r.student} start={ri * 3} />
                  </td>
                  <td data-label="From" className="border-b border-[var(--line-d)] py-4 pr-4 align-middle">
                    <FlapText text={r.from} start={ri * 3 + 6} />
                  </td>
                  <td data-label="Destination" className="border-b border-[var(--line-d)] py-4 pr-4 align-middle">
                    <FlapText text={r.destination} start={ri * 3 + 8} />
                  </td>
                  <td data-label="Rank" className="border-b border-[var(--line-d)] py-4 pr-4 align-middle">
                    <FlapText text={r.rank} start={ri * 3 + 20} />
                  </td>
                  <td data-label="Year" className="border-b border-[var(--line-d)] py-4 text-right align-middle">
                    <FlapText text={r.year} start={ri * 3 + 22} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
