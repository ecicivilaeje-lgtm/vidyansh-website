import type { Metadata } from "next";
import { Chapter, bookGrid } from "@/components/about/Chapter";
import { Ornament } from "@/components/about/Ornament";
import { Button } from "@/components/ui/Button";
import { Star } from "@/components/ui/Star";
import { aboutTitlePage } from "@/content/about";
import { journeyStages } from "@/content/journey";
import { brand } from "@/content/site";
import { getAboutBook } from "@/lib/data/people";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About · Vidyansh",
  description: "Why Vidyansh exists, what the name means, how we teach from Dream to Destination, and what we will never do. Exam preparation for engineering aspirants, by Shubham Sir.",
};

export default async function AboutPage() {
  const { chapters, stageNotes, nevers, colophon } = await getAboutBook();
  const [why, name, how, never] = chapters;

  return (
    <>
      {/* Title page */}
      <section aria-labelledby="about-title" className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-ink px-[var(--gutter)] pt-[calc(var(--header-h)+3rem)] pb-16 text-center">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_50%_45%,rgb(120_98_64/0.06),transparent_70%)]" />
        <div aria-hidden="true" className="absolute inset-[clamp(1rem,3vw,2.5rem)] top-[calc(var(--header-h)+1rem)] border border-[var(--line-d)]" />
        <div className="relative grid justify-items-center">
          <p className="eyebrow">{aboutTitlePage.eyebrow}</p>
          <h1 id="about-title" className="mt-10 text-[clamp(4.5rem,15vw,12rem)] leading-[0.82] tracking-[-0.045em]">
            {brand.name}
          </h1>
          <p lang="hi" className="mt-6 font-deva text-[clamp(2.5rem,6vw,5rem)] leading-none text-ivory/80">
            {brand.devanagari}
          </p>
          <p className="mt-6 font-display text-[clamp(1.5rem,2.4vw,2.1rem)] italic text-body-d">{brand.meaning}</p>
          <Star className="my-10 size-5" />
          <p className="font-mono text-[0.8125rem] tracking-[0.2em] text-ivory uppercase">{brand.tagline}</p>
          <p className="eyebrow mt-3">{brand.byline}</p>
        </div>
        <p className="eyebrow absolute bottom-[clamp(1.75rem,4vw,3.5rem)] left-1/2 -translate-x-1/2 whitespace-nowrap">{aboutTitlePage.edition}</p>
      </section>

      {/* The book */}
      <article aria-label="About Vidyansh" className="scene-sheet on-light bg-ivory py-[var(--space-section)] text-ink">
        <div className="container-v">
          <Chapter chapter={why} />
          <Ornament />
          <Chapter chapter={name} />
          <Ornament />
          <Chapter chapter={how}>
            <ol aria-label="The five stages" className="relative border-l border-ink/30">
              {journeyStages.map((s, i) => {
                const last = i === journeyStages.length - 1;
                return (
                  <li key={s.id} className="relative grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 pb-10 pl-6 last:pb-0 sm:grid-cols-[6rem_minmax(0,1fr)]">
                    {last ? (
                      <Star className="absolute top-[0.9rem] -left-[9px] size-[17px]" />
                    ) : (
                      <span aria-hidden="true" className="absolute top-[1.15rem] -left-[5px] size-[9px] rotate-45 border border-ink bg-ivory" />
                    )}
                    <span className="font-display text-[clamp(2.5rem,4vw,3.5rem)] leading-none text-mute-l tabular-nums">{s.number}</span>
                    <div>
                      <h3 className={`text-[clamp(1.75rem,2.6vw,2.25rem)] leading-tight ${last ? "italic" : ""}`}>{s.title}</h3>
                      <p className="mt-2 text-mute-l">{stageNotes[s.id]}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Chapter>
          <Ornament />
          <Chapter chapter={never}>
            <ol className="border-t border-ink">
              {nevers.map((n, i) => (
                <li key={n.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-[var(--line-l)] py-6">
                  <span className="pt-1 font-mono text-[0.6875rem] tracking-[0.14em] text-mute-l">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-[clamp(1.6rem,2.4vw,2rem)] leading-tight">{n.title}</h3>
                    <p className="mt-2 text-mute-l">{n.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Chapter>

          <div className={`${bookGrid} mt-[var(--space-block)]`}>
            <p className="font-display text-[1.5rem] italic lg:col-start-2">The rest of this book is written by our students.</p>
          </div>
        </div>
      </article>

      {/* Colophon */}
      <section aria-labelledby="colophon-title" className="scene-surface bg-ink py-[var(--space-section)]">
        <div className="container-v grid justify-items-center text-center">
          <Star className="size-4" />
          <h2 id="colophon-title" className="mt-8 text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.02em]">
            Vidyansh, <em className="font-normal">in short</em>
          </h2>
          <div className="mt-8 max-w-[34rem] font-display text-[clamp(1.35rem,2vw,1.7rem)] leading-[1.45] text-body-d">
            <p>{colophon.note}</p>
          </div>
          <dl className="mt-12 grid w-full max-w-[34rem] grid-cols-3 border-y border-[var(--line-d)] font-mono text-[0.75rem] tracking-[0.14em] uppercase">
            {[
              ["Founded", colophon.founded],
              ["Place", colophon.place],
              ["Mentor", "Shubham Sir"],
            ].map(([k, v], i) => (
              <div key={k} className={`grid gap-2 py-5 ${i > 0 ? "border-l border-[var(--line-d)]" : ""}`}>
                <dt className="text-mute-d">{k}</dt>
                <dd className="text-ivory">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-[var(--space-block)] flex flex-wrap justify-center gap-3">
            <Button href="/courses" diamond>
              Explore courses
            </Button>
            <Button href="/contact" variant="ghost">
              Talk to us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
