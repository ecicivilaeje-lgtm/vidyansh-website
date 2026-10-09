import type { CSSProperties } from "react";
import { Star } from "@/components/ui/Star";

/**
 * One exam drawn as a transit line: a fine ivory rule with a station per stage,
 * ending at the destination star. Horizontal from md up, vertical on phones.
 * Each station draws the segment to the next one, so the line stops at the terminus.
 */
export function ExamLine({ stages, label }: { stages: string[]; label: string }) {
  const style = { "--stops": stages.length + 1 } as CSSProperties;
  return (
    <ol aria-label={`${label} stages, in order`} style={style} className="exam-line grid gap-7 md:grid-cols-[repeat(var(--stops),minmax(0,1fr))] md:gap-4">
      {stages.map((s, i) => (
        <li key={s} className="relative grid content-start gap-2 pl-9 md:pt-9 md:pl-0">
          <span
            aria-hidden="true"
            className="exam-line__seg absolute top-3.5 -bottom-7 left-[0.4375rem] w-px bg-ivory/55 md:top-[0.4375rem] md:right-[-1rem] md:bottom-auto md:left-3.5 md:h-px md:w-auto"
          />
          <span aria-hidden="true" className="absolute top-0 left-0 size-3.5 rounded-full border border-ivory bg-ink" />
          <span className="font-mono text-[0.625rem] tracking-[0.16em] text-mute-d tabular-nums">STOP {String(i + 1).padStart(2, "0")}</span>
          <span className="max-w-[18ch] font-mono text-[0.8125rem] leading-snug tracking-[0.1em] text-ivory uppercase">{s}</span>
        </li>
      ))}
      <li className="relative grid content-start gap-2 pl-9 md:pt-9 md:pl-0">
        <Star className="absolute -top-[0.1875rem] -left-[0.1875rem] size-5" />
        <span className="font-mono text-[0.625rem] tracking-[0.16em] text-mute-d">TERMINUS</span>
        <span className="font-display text-[1.375rem] leading-tight text-ivory italic">Destination</span>
      </li>
    </ol>
  );
}
