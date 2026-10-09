import { Reveal } from "@/components/ui/Reveal";
import { Star } from "@/components/ui/Star";
import type { SuccessStory } from "@/lib/types";
import type { StoryFeature } from "@/lib/people-types";

interface Props {
  story: SuccessStory;
  feature: StoryFeature | null;
  index: number;
  isSample: boolean;
}

/** One student per spread, like a magazine feature: portrait, headline, a quote set large, and their own Dream to Destination. */
export function StorySpread({ story, feature, index, isSample }: Props) {
  const flip = index % 2 === 1;
  const headingId = `story-${story.id}`;
  return (
    <article aria-labelledby={headingId} className="border-t border-ink pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="eyebrow">
          Feature {String(index + 1).padStart(2, "0")}
          {isSample && " · Sample"}
        </span>
        <span className="eyebrow">{story.firstName}</span>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-[clamp(2rem,4vw,4.5rem)]">
        {/* Portrait placeholder: art-directed, labelled, no stock photography. */}
        <figure className={`relative aspect-[4/5] overflow-hidden bg-parchment lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_38%,rgb(7_7_6/0.08),transparent_70%)]" />
          <div aria-hidden="true" className="absolute inset-x-[22%] bottom-0 h-[52%] rounded-t-[50%] border border-b-0 border-ink/15" />
          <div aria-hidden="true" className="absolute top-[18%] left-1/2 size-[26%] -translate-x-1/2 rounded-full border border-ink/15" />
          <span aria-hidden="true" className="absolute top-4 left-4 h-6 w-px bg-ink/25" />
          <span aria-hidden="true" className="absolute top-4 left-4 h-px w-6 bg-ink/25" />
          <span aria-hidden="true" className="absolute right-4 bottom-4 h-6 w-px bg-ink/25" />
          <span aria-hidden="true" className="absolute right-4 bottom-4 h-px w-6 bg-ink/25" />
          <figcaption className="absolute bottom-5 left-5 grid gap-1">
            <span className="eyebrow text-ink">Portrait to come</span>
            <span className="font-mono text-[0.625rem] tracking-[0.14em] text-mute-l uppercase">Published with consent</span>
          </figcaption>
        </figure>

        <div className={`grid content-start gap-8 lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
          <h3 id={headingId} className="text-[clamp(2.4rem,4.4vw,4.25rem)] leading-[0.92] tracking-[-0.02em]">
            {feature?.headline ?? story.firstName}
          </h3>
          {feature && <p className="max-w-[46ch] text-[1.1875rem] text-mute-l">{feature.standfirst}</p>}
          <Reveal as="blockquote" className="border-l border-ink/30 pl-6 sm:pl-8">
            <p className="font-display text-[clamp(2.1rem,4.2vw,4.4rem)] leading-[1.02] tracking-[-0.015em] text-balance italic">&ldquo;{story.quote}&rdquo;</p>
            <footer className="mt-6 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[0.75rem] tracking-[0.14em] uppercase">
              <span className="text-mute-l">{story.byline}</span>
              <span className="text-ink tabular-nums">{story.rank}</span>
            </footer>
          </Reveal>
        </div>
      </div>

      {feature && (
        <ol aria-label={`${feature.headline}: Dream to Destination`} className="relative mt-[clamp(3rem,6vw,5rem)] grid gap-6 md:grid-cols-5 md:gap-4">
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-[4px] w-px bg-[var(--line-l)] md:top-[4px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto" />
          {feature.journey.map((s, i) => {
            const last = i === feature.journey.length - 1;
            return (
              <li key={s.stage} className="relative grid gap-2 pl-8 md:pl-0 md:pt-8 md:pr-3">
                {last ? (
                  <Star className="absolute top-[-4px] left-[-3px] size-4 md:top-[-4px] md:left-[-3px]" />
                ) : (
                  <span aria-hidden="true" className="absolute top-0 left-0 size-[9px] rotate-45 border border-ink bg-ivory" />
                )}
                <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-mute-l">{String(i + 1).padStart(2, "0")}</span>
                <span className={`font-display text-[clamp(1.5rem,2vw,1.9rem)] leading-tight ${last ? "italic" : ""}`}>{s.stage}</span>
                <span className="text-[0.9375rem] text-mute-l">{s.note}</span>
              </li>
            );
          })}
        </ol>
      )}
    </article>
  );
}
