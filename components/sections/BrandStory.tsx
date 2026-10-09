import { brand } from "@/content/site";
import { manifesto, storyStair } from "@/content/journey";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterMark } from "@/components/ui/ChapterMark";

/* Each step of the stair brightens and steps further right: Dream to Destination as a rising line. */
const stairStyles = [
  "text-[#5b554d]",
  "text-[#8a8277] md:pl-[4vw]",
  "text-[#b9b0a2] md:pl-[8vw]",
  "text-[#e3dacb] md:pl-[12vw]",
  "text-champagne italic font-normal md:pl-[16vw]",
];

export function BrandStory() {
  return (
    <section aria-labelledby="story-title" className="relative overflow-hidden bg-gradient-to-b from-ink to-night py-[var(--space-section)]">
      <div className="container-v">
        <ChapterMark numeral="I" name={manifesto.eyebrow} className="mb-[var(--space-block)] text-ivory" />
        <div className="grid items-start gap-8 md:grid-cols-[1fr_2.4fr] md:gap-[clamp(1.5rem,5vw,5rem)]">
          <div className="grid justify-items-start gap-4">
            <span lang="hi" className="font-deva text-[clamp(3.25rem,8vw,7.5rem)] leading-none text-ivory/[0.16] md:[writing-mode:vertical-rl]">
              {brand.devanagari}
            </span>
            <span className="eyebrow">
              {brand.name} · {brand.meaning}
            </span>
          </div>
          <div>

            <Reveal as="p" delay={80}>
              <span id="story-title" className="block font-display text-[clamp(2.25rem,5.2vw,5.5rem)] leading-[1.04] tracking-[-0.015em] text-balance">
                {manifesto.text[0]}
                <em>{manifesto.text[1]}</em>
                {manifesto.text[2]}
              </span>
            </Reveal>
            <Reveal delay={160} className="mt-9 flex items-center gap-4">
              <span className="font-hand text-[2.4rem] leading-none text-ivory/80">{manifesto.signature}</span>
              <span className="eyebrow">{manifesto.role}</span>
            </Reveal>
          </div>
        </div>

        <ol aria-label="The five stages of the Vidyansh journey" className="mt-[var(--space-section)] border-b border-[var(--line-d)]">
          {storyStair.map((s, i) => (
            <Reveal
              as="li"
              key={s.word}
              delay={i * 70}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 border-t border-[var(--line-d)] py-[clamp(0.6rem,1.4vw,1.1rem)] md:grid-cols-[4.5rem_auto_minmax(0,1fr)] md:gap-x-7"
            >
              <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-mute-d">{String(i + 1).padStart(2, "0")}</span>
              <span className={`font-display text-[clamp(2.9rem,8vw,8rem)] leading-[0.9] font-medium tracking-[-0.03em] whitespace-nowrap ${stairStyles[i]}`}>
                {s.word}
              </span>
              <span className="col-start-2 font-display text-[clamp(1.0625rem,1.6vw,1.5rem)] leading-snug text-mute-d italic md:col-start-3 md:justify-self-end md:text-right">
                {s.note}
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
