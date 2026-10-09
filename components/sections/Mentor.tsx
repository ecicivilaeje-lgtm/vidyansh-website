import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { mentor } from "@/content/mentor";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterMark } from "@/components/ui/ChapterMark";

/** Split composition: a chalkboard half (where the portrait will sit) against ivory copy. */
export function Mentor() {
  return (
    <section id="mentor" aria-labelledby="mentor-title" className="scene-sheet on-light grid bg-ivory text-ink lg:grid-cols-[1fr_1.15fr]">
      <div className="plate-sheet relative min-h-[28rem] overflow-hidden bg-[radial-gradient(ellipse_70%_60%_at_40%_40%,#dcd3c2,#eee8dc)] lg:min-h-[56rem]">
        <div aria-hidden="true" className="absolute inset-0">
          {mentor.chalk.map((c) => (
            <span
              key={c.text}
              className={`absolute font-hand whitespace-nowrap text-ivory/25 ${c.small ? "text-[clamp(1.25rem,2vw,1.75rem)]" : "text-[clamp(1.6rem,2.8vw,2.5rem)]"}`}
              style={{ left: c.x, top: c.y, transform: `rotate(${c.rotate}deg)` }}
            >
              {c.text}
            </span>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-x-[12%] bottom-0 h-[58%] rounded-t-[50%] bg-gradient-to-b from-[#cdc3b0] to-[#e7e0d2] opacity-90" />
        <div className="absolute bottom-6 left-6 grid gap-1">
          <span className="eyebrow text-ivory">Portrait</span>
          <span className="font-mono text-[0.625rem] tracking-[0.14em] text-mute-d uppercase">Shubham Sir, at the board · photograph to come</span>
        </div>
        <span aria-hidden="true" className="crosshair top-5 left-5" />
        <span aria-hidden="true" className="crosshair top-5 right-5" />
      </div>

      <div className="grid content-center gap-14 px-[var(--gutter)] py-[var(--space-section)] lg:pr-[max(var(--gutter),calc((100vw-88rem)/2))] lg:pl-[clamp(2.5rem,5vw,6rem)]">
        <ChapterMark numeral="V" name="The mentor" note={mentor.name} />
        <Reveal as="blockquote">
          <p id="mentor-title" className="settle font-display text-[clamp(2.4rem,4.4vw,4.6rem)] leading-[1.02] tracking-[-0.015em] text-balance">
            &ldquo;{mentor.quote[0]}
            <em>{mentor.quote[1]}</em>
            {mentor.quote[2]}&rdquo;
          </p>
          <footer className="mt-6 flex items-center gap-4">
            <span className="font-hand text-[2.25rem] leading-none text-ink/80">Shubham</span>
            <span className="eyebrow">Founder, Vidyansh</span>
          </footer>
        </Reveal>
        <p className="max-w-[52ch] text-[1.1875rem] text-mute-l">{mentor.bio}</p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button href="/faculty" tone="light">
            Meet the faculty
          </Button>
          <Link href="/about" className="link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase">
            Why Vidyansh exists →
          </Link>
        </div>

        <ol className="border-t border-ink/70">
          {mentor.principles.map((p) => (
            <li key={p.numeral} className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 border-b border-[var(--line-l)] py-5 sm:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)]">
              <span className="font-display text-xl italic text-mute-l">{p.numeral}</span>
              <span className="font-display text-[clamp(1.6rem,2.4vw,2.1rem)] leading-tight">{p.title}</span>
              <span className="col-start-2 text-mute-l sm:col-start-3">{p.body}</span>
            </li>
          ))}
        </ol>

        <ol aria-label="Timeline" className="relative grid grid-cols-2 gap-y-6 sm:grid-cols-4">
          <span aria-hidden="true" className="absolute top-[0.3rem] right-0 left-0 hidden h-px bg-[var(--line-l)] sm:block" />
          {mentor.timeline.map((t) => (
            <li key={t.label} className="relative grid gap-1 pr-3">
              <span aria-hidden="true" className="relative size-2.5 rotate-45 border border-ink bg-ivory" />
              <span className="mt-2 font-mono text-xs tracking-[0.12em] text-ink uppercase">{t.year}</span>
              <span className="text-sm text-mute-l">{t.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
