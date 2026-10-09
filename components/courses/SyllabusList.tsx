import type { CourseModule } from "@/lib/types";

/** Numbered module list. Each subject is a native disclosure that opens onto its topics. */
export function SyllabusList({ modules }: { modules: CourseModule[] }) {
  return (
    <ol className="border-t border-ink">
      {modules.map((m, i) => (
        <li key={`${m.stage ?? ""}-${m.subject}`} className="border-b border-[var(--line-l)]">
          <details className="group">
            <summary className="grid cursor-pointer list-none grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 py-5 md:grid-cols-[3rem_minmax(0,1fr)_12rem_auto] [&::-webkit-details-marker]:hidden">
              <span className="font-mono text-xs tracking-[0.12em] text-mute-l tabular-nums">M{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-[clamp(1.375rem,2.2vw,1.875rem)] leading-tight transition-[font-style] group-hover:italic group-open:italic">
                {m.subject}
              </span>
              {m.stage ? (
                <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-mute-l uppercase max-md:col-start-2 max-md:row-start-2">{m.stage}</span>
              ) : (
                <span className="max-md:hidden" />
              )}
              <span aria-hidden="true" className="relative size-3 self-center max-md:col-start-3 max-md:row-start-1">
                <span className="absolute inset-x-0 top-1/2 h-px bg-ink" />
                <span className="absolute inset-y-0 left-1/2 w-px bg-ink transition-transform duration-300 group-open:scale-y-0" />
              </span>
            </summary>
            <ul className="grid gap-x-8 gap-y-2 pb-6 pl-[calc(2.5rem+1rem)] sm:grid-cols-2 md:pl-[calc(3rem+1rem)]">
              {m.topics.map((t) => (
                <li key={t} className="flex items-baseline gap-3 text-[1rem] text-mute-l">
                  <span aria-hidden="true" className="inline-block h-px w-3 shrink-0 -translate-y-[0.3em] bg-mute-l" />
                  {t}
                </li>
              ))}
            </ul>
          </details>
        </li>
      ))}
    </ol>
  );
}
