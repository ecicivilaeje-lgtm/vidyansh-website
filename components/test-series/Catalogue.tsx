"use client";

import Link from "next/link";
import { useState } from "react";
import { testSeriesFormats } from "@/content/test-series";
import { useExam } from "@/components/providers/ExamProvider";
import { orDash } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { TestSeries } from "@/lib/types";
import { Difficulty } from "./Difficulty";
import { PaperCover } from "./PaperCover";

/**
 * The catalogue as a ledger. Every row links to its series; on large screens,
 * hovering or focusing a row also opens its cover beside the list.
 */
export function Catalogue({ series, heading }: { series: TestSeries[]; heading: string }) {
  const { exam } = useExam();
  const [selectedId, setSelectedId] = useState(() => (series.find((s) => s.exam === exam) ?? series[0])?.id);
  const selected = series.find((s) => s.id === selectedId) ?? series[0];

  if (!selected) {
    return <p className="py-16 text-body-d">No series in this category yet. New series are announced on this page first.</p>;
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-[clamp(2rem,4vw,4rem)]">
      <div>
        <div className="flex items-end justify-between gap-4 border-b border-ivory/60 pb-3">
          <h2 className="font-display text-[clamp(1.6rem,2.4vw,2.1rem)] leading-tight">{heading}</h2>
          <span className="eyebrow">
            {series.length} {series.length === 1 ? "series" : "series"}
          </span>
        </div>
        <div className="eyebrow hidden grid-cols-[6.5rem_minmax(0,1fr)_4.5rem_5.5rem_1.5rem] gap-4 border-b border-[var(--line-d)] py-2.5 md:grid" aria-hidden="true">
          <span>Code</span>
          <span>Series</span>
          <span>Tests</span>
          <span>Difficulty</span>
          <span />
        </div>
        <ol>
          {series.map((s) => {
            const active = s.id === selected.id;
            const mine = exam !== null && s.exam === exam;
            return (
              <li key={s.id}>
                <Link
                  href={routes.series(s.slug)}
                  onMouseEnter={() => setSelectedId(s.id)}
                  onFocus={() => setSelectedId(s.id)}
                  className={`group relative grid grid-cols-[minmax(0,1fr)_1.5rem] items-center gap-x-4 gap-y-2 border-b border-[var(--line-d)] py-5 transition-colors md:grid-cols-[6.5rem_minmax(0,1fr)_4.5rem_5.5rem_1.5rem] ${
                    active ? "lg:bg-ivory/[0.035]" : "hover:bg-ivory/[0.02]"
                  }`}
                >
                  <span aria-hidden="true" className={`absolute top-0 bottom-0 -left-3 w-0.5 transition-colors ${active ? "lg:bg-ivory" : ""}`} />
                  <span className="hidden font-mono text-[0.6875rem] tracking-[0.12em] text-mute-d md:block">{s.id}</span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className={`font-display text-[clamp(1.4rem,2vw,1.75rem)] leading-tight transition-colors ${active ? "lg:text-ivory" : ""}`}>{s.name}</span>
                      {mine && <span className="border border-ivory/40 px-1.5 py-0.5 font-mono text-[0.5625rem] tracking-[0.14em] text-ivory uppercase">Your exam</span>}
                    </span>
                    <span className="eyebrow mt-1 block">
                      {s.examLabel} · {s.formats.map((f) => testSeriesFormats.find((x) => x.id === f)?.short).join(" · ")}
                    </span>
                    <span className="mt-2 flex items-center gap-5 md:hidden">
                      <span className="font-mono text-[0.6875rem] text-body-d">{orDash(s.testCount)} tests</span>
                      <Difficulty level={s.difficulty} />
                    </span>
                  </span>
                  <span className="hidden font-mono text-[0.8125rem] text-body-d tabular-nums md:block">{orDash(s.testCount)}</span>
                  <span className="hidden md:block">
                    <Difficulty level={s.difficulty} />
                  </span>
                  <span aria-hidden="true" className="text-mute-d transition-[color,transform] group-hover:translate-x-1 group-hover:text-ivory">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="hidden lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:block">
        <PaperCover key={selected.id} series={selected} freeTestHref={routes.freeTest(selected)} compact />
      </div>
    </div>
  );
}
