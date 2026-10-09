import { Reveal } from "@/components/ui/Reveal";
import type { getFounder } from "@/lib/data/people";

type Founder = Awaited<ReturnType<typeof getFounder>>;

/** The lead feature on the masthead: a tall chalkboard portrait slot beside a long, multi-column profile. */
export function FounderFeature({ founder }: { founder: Founder }) {
  return (
    <article aria-labelledby="founder-name" className="grid gap-12 lg:grid-cols-12 lg:gap-[clamp(2rem,4vw,4.5rem)]">
      <figure className="plate-sheet relative min-h-[34rem] overflow-hidden bg-[radial-gradient(ellipse_70%_60%_at_40%_35%,#dcd3c2,#eee8dc)] lg:col-span-5 lg:min-h-[48rem]">
        <div aria-hidden="true" className="absolute inset-0">
          {founder.chalk.map((c) => (
            <span
              key={c.text}
              className={`absolute font-hand whitespace-nowrap text-ivory/20 ${c.small ? "text-[clamp(1.1rem,1.6vw,1.5rem)]" : "text-[clamp(1.4rem,2.2vw,2.1rem)]"}`}
              style={{ left: c.x, top: c.y, transform: `rotate(${c.rotate}deg)` }}
            >
              {c.text}
            </span>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-x-[16%] bottom-0 h-[55%] rounded-t-[50%] bg-gradient-to-b from-[#cdc3b0] to-[#e7e0d2] opacity-90" />
        <span aria-hidden="true" className="crosshair top-5 left-5" />
        <span aria-hidden="true" className="crosshair top-5 right-5" />
        <figcaption className="absolute bottom-6 left-6 grid gap-1">
          <span className="eyebrow text-ivory">Portrait to come</span>
          <span className="font-mono text-[0.625rem] tracking-[0.14em] text-mute-d uppercase">{founder.name}, at the board</span>
        </figcaption>
      </figure>

      <div className="grid content-start gap-10 lg:col-span-7">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink pb-4">
          <span className="eyebrow">Lead feature</span>
          <span className="eyebrow">{founder.subjects}</span>
        </div>
        <div>
          <h2 id="founder-name" className="settle text-[clamp(3.5rem,7.5vw,8.5rem)] leading-[0.82] tracking-[-0.045em]">
            Shubham <em className="font-normal">Sir</em>
          </h2>
          <p className="mt-5 font-mono text-[0.8125rem] tracking-[0.17em] text-ink uppercase">{founder.role} · Vidyansh</p>
        </div>

        <Reveal as="blockquote" className="border-l border-ink/30 pl-6">
          <p className="font-display text-[clamp(1.75rem,2.8vw,2.6rem)] leading-[1.08] text-balance italic">
            &ldquo;{founder.quote[0]}
            <span className="not-italic">{founder.quote[1]}</span>
            {founder.quote[2]}&rdquo;
          </p>
        </Reveal>

        <div className="gap-10 text-[1.0625rem] leading-[1.7] text-mute-l md:columns-2">
          {founder.bio.map((p, i) => (
            <p key={i} className={`mb-5 break-inside-avoid ${i === 0 ? "text-ink" : ""}`}>
              {p}
            </p>
          ))}
        </div>
        <p className="eyebrow -mt-4">Placeholder profile · to be written with Shubham Sir</p>

        <div>
          <h3>
            <span className="eyebrow">Teaching principles</span>
          </h3>
          <ol className="mt-4 border-t border-ink">
            {founder.principles.map((p) => (
              <li key={p.numeral} className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 border-b border-[var(--line-l)] py-5 sm:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)]">
                <span className="font-display text-xl text-mute-l italic">{p.numeral}</span>
                <span className="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-tight">{p.title}</span>
                <span className="col-start-2 text-mute-l sm:col-start-3">{p.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}
