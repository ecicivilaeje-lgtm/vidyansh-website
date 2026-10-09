import type { DaySlot, ProgrammeEntry, Weekday } from "@/lib/learning-types";

interface Props {
  entries: ProgrammeEntry[];
  days: Weekday[];
  dayNames: Record<Weekday, string>;
  sampleNote: string;
}

const slots: { id: DaySlot; label: string }[] = [
  { id: "morning", label: "Morning" },
  { id: "evening", label: "Evening" },
];

/** The weekly programme as an open timetable: a ruled table on wide screens, a day-by-day list on narrow ones. */
export function Programme({ entries, days, dayNames, sampleNote }: Props) {
  const at = (d: Weekday, s: DaySlot) => entries.find((e) => e.day === d && e.slot === s);

  return (
    <>
      <table className="hidden w-full table-fixed border-collapse lg:table">
        <caption className="eyebrow pb-5 text-left">Weekly programme · {sampleNote}</caption>
        <thead>
          <tr className="border-y border-ivory/40">
            <th scope="col" className="w-[7.5rem]"><span className="sr-only">Time of day</span></th>
            {days.map((d) => (
              <th key={d} scope="col" className="border-l border-[var(--line-d)] px-3 py-4 text-left font-mono text-[0.6875rem] font-medium tracking-[0.17em] text-mute-d uppercase">
                <abbr title={dayNames[d]} className="no-underline">
                  {d}
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((s) => (
            <tr key={s.id} className="border-b border-[var(--line-d)]">
              <th scope="row" className="py-6 pr-3 text-left align-top font-display text-[1.5rem] leading-none font-normal italic">
                {s.label}
              </th>
              {days.map((d) => {
                const e = at(d, s.id);
                return (
                  <td key={d} className="h-[11.5rem] border-l border-[var(--line-d)] px-3 py-6 align-top">
                    {e ? (
                      <div className="grid gap-2">
                        <span className="font-display text-[1.3125rem] leading-[1.05]">{e.subject}</span>
                        <span className="text-[0.875rem] leading-snug text-body-d">{e.topic}</span>
                        <span className="font-mono text-[0.625rem] tracking-[0.14em] text-mute-d uppercase">{e.exam}</span>
                      </div>
                    ) : (
                      <span className="text-mute-d">
                        <span aria-hidden="true">—</span>
                        <span className="sr-only">No class</span>
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="lg:hidden">
        <p className="eyebrow pb-5">Weekly programme · {sampleNote}</p>
        <ul className="border-t border-ivory/40">
          {days.map((d) => {
            const list = slots.map((s) => ({ s, e: at(d, s.id) }));
            return (
              <li key={d} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b border-[var(--line-d)] py-5 sm:grid-cols-[9rem_minmax(0,1fr)]">
                <h3 className="font-display text-[1.6rem] leading-none">{dayNames[d]}</h3>
                <dl className="grid gap-4">
                  {list.map(({ s, e }) => (
                    <div key={s.id} className="grid gap-1">
                      <dt className="font-mono text-[0.625rem] tracking-[0.16em] text-mute-d uppercase">{s.label}</dt>
                      <dd>
                        {e ? (
                          <>
                            <span className="font-display text-[1.25rem] leading-tight">{e.subject}</span>
                            <span className="block text-[0.9375rem] text-body-d">
                              {e.topic} · <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-mute-d uppercase">{e.exam}</span>
                            </span>
                          </>
                        ) : (
                          <span className="text-mute-d">No class</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
