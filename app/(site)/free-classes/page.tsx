import type { Metadata } from "next";
import Link from "next/link";
import { weekdayNames, weekdays } from "@/content/free-classes";
import { Button } from "@/components/ui/Button";
import { LecturePoster } from "@/components/free-classes/LecturePoster";
import { Programme } from "@/components/free-classes/Programme";
import { getFreeClassesPage, getNextLiveClass, getProgramme, getRecordedLectures } from "@/lib/data/learning";
import { orDash } from "@/lib/format";

export const metadata: Metadata = {
  alternates: { canonical: "/free-classes" },
  title: "Free classes · Vidyansh",
  description:
    "Free live classes and recorded lectures for SSC JE, RRB JE and State AE / JE aspirants, with Shubham Sir. See the weekly programme and ask for class reminders.",
};

const countdown = ["Days", "Hours", "Minutes", "Seconds"];

export default async function FreeClassesPage() {
  const [page, next, programme, lectures] = await Promise.all([getFreeClassesPage(), getNextLiveClass(), getProgramme(), getRecordedLectures()]);
  const tickerItems = next ? [`Next live · ${next.title}`, next.subject, next.exam, "Schedule to be announced"] : [];

  return (
    <>
      {/* Opens on what is on air next: the class itself is the headline. */}
      <header aria-labelledby="free-title" className="relative overflow-hidden bg-ink pt-[calc(var(--header-h)+clamp(2.5rem,6vw,5rem))]">
        <div aria-hidden="true" className="drafting-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_80%_30%,#000,transparent_75%)]" />
        <div className="container-v relative">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-ivory/40 pb-5">
            <h1 id="free-title" className="text-[clamp(1.75rem,2.6vw,2.5rem)] leading-tight">
              Free classes, <em className="font-normal">live and recorded</em>
            </h1>
            <p className="flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.17em] text-mute-d uppercase">
              <span aria-hidden="true" className="inline-block size-2 rounded-full border border-ivory/60" />
              Channel not live yet
            </p>
          </div>

          {next && (
            <div className="grid gap-12 pt-[clamp(3rem,7vw,6rem)] pb-[var(--space-block)] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-[clamp(3rem,7vw,8rem)]">
              <div>
                <p className="eyebrow text-ivory">Next live class</p>
                <p className="mt-6 font-display text-[clamp(3.25rem,8vw,8.5rem)] leading-[0.86] tracking-[-0.035em] text-balance">{next.title}</p>
                <p className="mt-8 font-mono text-[0.75rem] tracking-[0.16em] text-mute-d uppercase">
                  {next.subject} · {next.exam}
                </p>
                <p className="mt-10 max-w-[44ch] text-[1.1875rem] text-body-d">{page.intro}</p>
              </div>

              <div className="grid content-end gap-8">
                <div className="border-t border-ivory/40 pt-5">
                  <p className="eyebrow">Goes live</p>
                  <p className="mt-3 font-display text-[clamp(2rem,3.4vw,3rem)] leading-[1] italic">{next.startsAt ?? "Schedule to be announced"}</p>
                </div>
                <div>
                  <p className="sr-only">The countdown starts when the date is announced.</p>
                  <dl aria-hidden="true" className="grid grid-cols-4 border-y border-[var(--line-d)]">
                    {countdown.map((u, i) => (
                      <div key={u} className={`grid gap-1 py-4 ${i > 0 ? "border-l border-[var(--line-d)] pl-4" : ""}`}>
                        <dt className="font-mono text-[0.5625rem] tracking-[0.16em] text-mute-d uppercase">{u}</dt>
                        <dd className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-none tabular-nums">—</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button href="/contact?topic=free-classes" diamond>
                    Remind me
                  </Button>
                  <Button href="#programme" variant="ghost">
                    See this week
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {next && (
          <div aria-hidden="true" className="ticker relative overflow-hidden border-y border-ivory/40 py-3">
            <ul className="ticker-run flex w-max gap-12 pl-12">
              {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((t, i) => (
                <li key={i} className="flex items-center gap-12 font-mono text-[0.6875rem] tracking-[0.16em] whitespace-nowrap text-mute-d uppercase">
                  <span className={i % tickerItems.length === 0 ? "text-ivory" : undefined}>{t}</span>
                  <span>·</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Weekly programme */}
      <section id="programme" aria-labelledby="programme-title" className="border-t border-[var(--line-d)] bg-night py-[var(--space-section)]">
        <div className="container-v">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="programme-title" className="settle text-[clamp(3.25rem,7vw,7.5rem)] leading-[0.88] tracking-[-0.025em]">
              The <em className="font-normal">week</em> ahead
            </h2>
            <p className="eyebrow">Sample schedule</p>
          </div>
          <p className="mt-6 max-w-[52ch] text-body-d">{page.sampleNote}</p>
          <div className="mt-[clamp(3rem,6vw,5rem)]">
            <Programme entries={programme} days={weekdays} dayNames={weekdayNames} sampleNote="Sample schedule" />
          </div>
        </div>
      </section>

      {/* Recorded lectures */}
      <section aria-labelledby="recorded-title" className="bg-ink py-[var(--space-section)]">
        <div className="container-v">
          <p className="eyebrow">Recorded lectures</p>
          <h2 id="recorded-title" className="settle mt-5 text-[clamp(3.25rem,7vw,7.5rem)] leading-[0.88] tracking-[-0.025em]">
            Watch it <em className="font-normal">again</em>
          </h2>
          <p className="mt-6 max-w-[48ch] text-body-d">{page.channelNote}</p>

          <ol className="mt-[clamp(3rem,6vw,5rem)] border-t border-ivory/40">
            {lectures.map((l, i) => {
              const no = String(i + 1).padStart(2, "0");
              return (
                <li
                  key={l.id}
                  className="grid grid-cols-[minmax(0,1fr)] items-center gap-x-[clamp(1.25rem,3vw,3rem)] gap-y-5 border-b border-[var(--line-d)] py-8 sm:grid-cols-[auto_13rem_minmax(0,1fr)] lg:grid-cols-[6.5rem_15rem_minmax(0,1fr)_auto]"
                >
                  <span aria-hidden="true" className="font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-none text-mute-d tabular-nums">
                    {no}
                  </span>
                  <div className="aspect-[8/5] w-full max-w-[18rem] sm:max-w-none">
                    <LecturePoster kind={l.poster} no={no} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.02]">{l.title}</h3>
                    <p className="mt-3 font-mono text-[0.6875rem] tracking-[0.15em] text-mute-d uppercase">
                      {l.subject} · {l.exam} · {orDash(l.durationMin, " min")}
                      <span className="sr-only"> duration</span>
                    </p>
                  </div>
                  <div className="sm:col-start-3 lg:col-start-auto">
                    {l.href ? (
                      <Link href={l.href} className="group inline-flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.16em] uppercase">
                        <span className="link-underline">Watch</span>
                        <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">→</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex cursor-not-allowed items-center border border-ivory/30 px-4 py-3 font-mono text-[0.6875rem] font-medium tracking-[0.17em] whitespace-nowrap text-mute-d uppercase"
                      >
                        Coming soon<span className="sr-only">: {l.title}</span>
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Opt-in */}
      <section aria-labelledby="optin-title" className="border-t border-[var(--line-d)] bg-ink pb-[var(--space-section)]">
        <div className="container-v pt-[var(--space-block)]">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <h2 id="optin-title" className="text-[clamp(3.25rem,8vw,8.5rem)] leading-[0.86] tracking-[-0.03em]">
              Never miss a <em className="font-normal">class</em>
            </h2>
            <Button href="/contact?topic=free-classes" diamond className="justify-self-start md:mb-3">
              Get class reminders
            </Button>
          </div>
          <p className="mt-8 max-w-[52ch] text-body-d">We will tell you when the schedule is announced and the channel opens. No spam, and no fee.</p>
        </div>
      </section>
    </>
  );
}
