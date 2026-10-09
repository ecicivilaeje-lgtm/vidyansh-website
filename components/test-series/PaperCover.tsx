import Link from "next/link";
import { testSeriesFormats } from "@/content/test-series";
import { discountPercent, formatINR, orDash } from "@/lib/format";
import type { TestSeries } from "@/lib/types";
import { Difficulty } from "./Difficulty";
import { routes } from "@/lib/routes";

const formatLabel = (s: TestSeries) => s.formats.map((f) => testSeriesFormats.find((x) => x.id === f)?.short).join(" · ");

/**
 * A series shown as the cover of an examination booklet: every catalogue field in a ruled
 * grid, the price block and the two actions. Null values print as "—".
 */
export function PaperCover({ series, freeTestHref, compact = false }: { series: TestSeries; freeTestHref: string; compact?: boolean }) {
  const off = discountPercent(series.price, series.originalPrice);
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Exam", value: series.examLabel },
    { label: "Format", value: formatLabel(series) },
    { label: "Tests", value: orDash(series.testCount) },
    { label: "Questions / test", value: orDash(series.questionsPerTest) },
    { label: "Duration", value: orDash(series.durationMin, " min") },
    { label: "Validity", value: orDash(series.validityDays, " days") },
    { label: "Solutions", value: series.hasSolutions ? "Detailed, every question" : "—" },
    { label: "Analysis", value: series.hasAnalysis ? "Rank, accuracy, time" : "—" },
  ];

  return (
    <article aria-labelledby={`cover-${series.id}`} className="on-light on-parchment relative bg-parchment text-ink shadow-[0_40px_90px_-40px_rgb(60_45_20/0.35)]">
      <div className="flex items-center justify-between gap-4 border border-b-0 border-[var(--hair)] bg-charcoal px-5 py-2.5 text-ivory">
        <span className="font-mono text-[0.625rem] tracking-[0.18em] uppercase">Vidyansh · Test Series</span>
        <span className="font-mono text-[0.625rem] tracking-[0.18em] text-ivory uppercase">{series.id}</span>
      </div>

      <div className="grid gap-5 p-[clamp(1.25rem,2.6vw,2rem)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{series.subjects.join(" · ")}</p>
            <h2 id={`cover-${series.id}`} className={`mt-3 leading-[0.95] tracking-[-0.02em] ${compact ? "text-[clamp(2rem,3vw,2.75rem)]" : "text-[clamp(2.4rem,4.4vw,4rem)]"}`}>
              {series.name}
            </h2>
          </div>
          <span
            aria-hidden="true"
            className="grid size-[5.25rem] shrink-0 rotate-[-12deg] place-items-center rounded-full border-2 border-double border-ink/70 p-2 text-center font-mono text-[0.5rem] leading-tight tracking-[0.14em] text-ink uppercase"
          >
            Free test included
          </span>
        </div>

        <dl className="grid grid-cols-2 border-t border-l border-[var(--line-l)]">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-1 border-r border-b border-[var(--line-l)] px-3 py-2.5">
              <dt className="font-mono text-[0.59375rem] tracking-[0.16em] text-mute-l uppercase">{r.label}</dt>
              <dd className="text-[0.9375rem] leading-snug tabular-nums">{r.value}</dd>
            </div>
          ))}
          <div className="col-span-2 flex items-center justify-between gap-3 border-r border-b border-[var(--line-l)] px-3 py-2.5">
            <dt className="font-mono text-[0.59375rem] tracking-[0.16em] text-mute-l uppercase">Difficulty</dt>
            <dd>
              <Difficulty level={series.difficulty} showLabel tone="light" />
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[0.59375rem] tracking-[0.16em] text-mute-l uppercase">Price</p>
            <p className="mt-1 flex items-baseline gap-3">
              <span className="font-display text-4xl leading-none tabular-nums">{formatINR(series.price)}</span>
              {series.originalPrice !== null && <s className="text-mute-l tabular-nums">{formatINR(series.originalPrice)}</s>}
              {off !== null && <span className="bg-ink px-1.5 py-0.5 font-mono text-[0.625rem] tracking-[0.12em] text-ivory">{off}% off</span>}
            </p>
            {series.price === null && <p className="mt-1.5 text-xs text-mute-l">Price is announced when the series is published.</p>}
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href={freeTestHref}
              className="inline-flex items-center gap-2.5 border border-ink bg-ink px-4 py-3 font-mono text-[0.6875rem] font-medium tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-transparent hover:text-ink"
            >
              Start free test
            </Link>
            <Link
              href={`${routes.series(series.slug)}#access`}
              className="inline-flex items-center border border-ink/30 px-4 py-3 font-mono text-[0.6875rem] font-medium tracking-[0.16em] uppercase transition-colors hover:border-ink hover:text-ink"
            >
              {compact ? "View series" : "Buy now"}
            </Link>
          </div>
        </div>
      </div>
      <p className="border-t border-dashed border-[var(--line-l)] px-5 py-2.5 font-mono text-[0.5625rem] tracking-[0.16em] text-mute-l uppercase">
        Schedule · {series.schedule}
      </p>
    </article>
  );
}
