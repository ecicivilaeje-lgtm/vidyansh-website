import type { Department } from "@/lib/people-types";

/** A ruled masthead row: the department in display type, its subjects in mono, and empty faculty slots. */
export function DepartmentRow({ dept, index }: { dept: Department; index: number }) {
  return (
    <li id={dept.id} className="group grid gap-8 border-b border-[var(--line-l)] py-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-12 lg:gap-[clamp(1.5rem,3vw,3rem)]">
      <div className="lg:col-span-5">
        <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-mute-l">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="mt-3 text-[clamp(2.6rem,5vw,4.75rem)] leading-[0.9] tracking-[-0.025em] group-hover:italic">{dept.name}</h3>
        <p className="mt-5 max-w-[36ch] text-mute-l">{dept.summary}</p>
      </div>

      <div className="lg:col-span-4">
        <p className="eyebrow">Subjects</p>
        <ul className="mt-4 grid gap-2 font-mono text-[0.8125rem] tracking-[0.04em] text-ink">
          {dept.subjects.map((s) => (
            <li key={s} className="flex gap-3">
              <span aria-hidden="true" className="text-mute-l">
                —
              </span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-3">
        <p className="eyebrow">Faculty</p>
        <ul className="mt-4 grid gap-3">
          {Array.from({ length: dept.slots }, (_, i) => (
            <li key={i} className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-4 border-t border-[var(--line-l)] pt-3">
              <span aria-hidden="true" className="relative block aspect-[4/5] border border-ink/20 bg-[repeating-linear-gradient(135deg,rgb(7_7_6/0.06)_0_1px,transparent_1px_7px)]" />
              <span className="grid gap-0.5">
                <span className="font-display text-[1.25rem] leading-tight italic">Faculty profile to come</span>
                <span className="font-mono text-[0.625rem] tracking-[0.14em] text-mute-l uppercase">{dept.name}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
