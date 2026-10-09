import type { Course } from "@/lib/types";

/** Seven days on one line: a horizontal timeline on wide screens (xl), a vertical one on phones. */
export function WeekStrip({ week }: { week: NonNullable<Course["week"]> }) {
  return (
    <ol className="grid xl:grid-cols-7">
      {week.map((d, i) => (
        <li key={d.day} className="relative grid content-start gap-2 border-l border-ink pb-7 pl-6 xl:border-t xl:border-l-0 xl:pt-7 xl:pr-4 xl:pb-0 xl:pl-0">
          <span
            aria-hidden="true"
            className={`absolute top-1.5 -left-[4.5px] size-2 rotate-45 border border-ink xl:-top-[4.5px] xl:left-0 ${i === week.length - 1 ? "bg-ivory" : "bg-ink"}`}
          />
          <span className="font-mono text-xs tracking-[0.14em] text-mute-l uppercase">{d.day}</span>
          <span className="font-display text-[1.5rem] leading-tight xl:text-[1.375rem]">{d.focus}</span>
          <span className="text-[0.9375rem] leading-snug text-mute-l">{d.note}</span>
        </li>
      ))}
    </ol>
  );
}
