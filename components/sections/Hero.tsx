import { brand } from "@/content/site";
import { journeyStages } from "@/content/journey";
import { Button } from "@/components/ui/Button";
import { JourneyRuler } from "@/components/sections/JourneyRuler";

/**
 * The opening title card. The phrase is the whole composition: "From Dream" in roman
 * capitals, a quiet "to", and "Destination" in a large italic that catches the light.
 * No imagery; only type, black and a single warm glow.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero relative grid min-h-[max(40rem,100svh)] grid-rows-[auto_1fr_auto] overflow-hidden bg-ink">
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />

      <div className="container-v relative flex items-center justify-between gap-6 pt-[calc(var(--header-h)+clamp(1.5rem,4vh,3rem)+env(safe-area-inset-top))]">
        <p className="hero-fade eyebrow text-ivory">
          {brand.name} <span className="text-mute-d">· {brand.byline}</span>
        </p>
        <p className="hero-fade eyebrow hidden sm:block">SSC JE · RRB JE · State AE / JE</p>
      </div>

      <div className="container-v relative grid content-center py-[clamp(2.5rem,6vh,4.5rem)]">
        <h1 id="hero-title" aria-label="From Dream to Destination" className="hero-title @container font-display font-normal">
          <span className="hero-mask block">
            <span className="hero-rise block text-[28cqi] leading-[0.8] tracking-[-0.03em] whitespace-nowrap uppercase lg:text-[15.6cqi]">
              From <br className="lg:hidden" />
              Dream
            </span>
          </span>{" "}
          <span className="flex items-center gap-[clamp(0.75rem,2vw,2rem)] py-[clamp(0.75rem,2.2cqi,2rem)]">
            <span aria-hidden="true" className="hero-rule h-px flex-1 bg-ivory/30" />
            <span className="hero-mask block">
              <span className="hero-rise hero-rise-2 block font-display text-[clamp(1.75rem,4.2cqi,4.25rem)] leading-none text-mute-d italic">to</span>
            </span>{" "}
            <span aria-hidden="true" className="hero-rule h-px w-[18%] bg-ivory/30" />
          </span>
          <span className="hero-mask block text-right">
            <span className="hero-rise hero-rise-3 hero-sheen inline-block text-[25cqi] leading-[0.9] tracking-[-0.035em] whitespace-nowrap italic lg:text-[17.6cqi]">
              Destination
            </span>
          </span>
        </h1>
      </div>

      <div className="container-v hero-fade-late relative grid gap-10 pb-[calc(1.75rem+env(safe-area-inset-bottom))]">
        <div className="grid items-end gap-7 md:grid-cols-[minmax(0,1fr)_auto]">
          <p className="max-w-[34ch] text-[clamp(1.125rem,1.45vw,1.375rem)] leading-relaxed text-body-d">{brand.promise}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/courses" diamond>
              Explore courses
            </Button>
            <Button href="/test-series" variant="ghost">
              Try a free mock test
            </Button>
          </div>
        </div>
        <JourneyRuler stages={journeyStages} />
      </div>
    </section>
  );
}
