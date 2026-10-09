import type { Metadata } from "next";
import Link from "next/link";
import { ArrivalsBoard } from "@/components/results/ArrivalsBoard";
import { FlapText } from "@/components/results/FlapText";
import { StorySpread } from "@/components/results/StorySpread";
import { Star } from "@/components/ui/Star";
import { getResultStories, getResultsBoard } from "@/lib/data/people";

export const metadata: Metadata = {
  alternates: { canonical: "/results" },
  title: "Results · Vidyansh",
  description: "Vidyansh students who reached their destination in SSC JE, RRB JE and State AE / JE. Every result is verified and published only with the student's consent.",
};

export default async function ResultsPage() {
  const [board, stories] = await Promise.all([getResultsBoard(), getResultStories()]);

  return (
    <>
      {/* I. The arrivals hall */}
      <section aria-labelledby="results-title" className="relative overflow-hidden bg-ink pt-[calc(var(--header-h)+clamp(2.5rem,6vw,5rem))] pb-[var(--space-section)]">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_15%_0%,rgb(120_98_64/0.06),transparent_70%)]" />
        <div className="container-v relative">
          {/* The page opens on the board itself: a station sign, then the arrivals. */}
          <div className="grid gap-8 border-b border-ivory/40 pb-8">
            <h1 id="results-title" className="results-sign leading-none">
              <span className="sr-only">Results: </span>
              <FlapText text="Arrivals" />
            </h1>
            <p className="max-w-[44ch] text-[1.1875rem] text-body-d">
              Students who reached the destination they prepared for. Choose a year and an exam, and the board turns over.
            </p>
          </div>

          <div className="mt-12">
            <ArrivalsBoard board={board} />
            {board.isSample && (
              <p className="eyebrow mt-8 max-w-[64ch] leading-relaxed">
                Sample board · names, towns and ranks appear here only once each result is verified and the student agrees
              </p>
            )}
          </div>
        </div>
      </section>

      {/* II. Stories, set like magazine features */}
      <section aria-labelledby="stories-title" className="scene-sheet on-light bg-ivory py-[var(--space-section)] text-ink">
        <div className="container-v">
          <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <p className="eyebrow">Stories</p>
              <h2 id="stories-title" className="settle mt-5 text-[clamp(3.5rem,9vw,9.5rem)] leading-[0.86] tracking-[-0.035em]">
                In their own <em className="font-normal">words</em>
              </h2>
            </div>
            <p className="max-w-[30ch] text-mute-l md:pb-3">One student at a time, with a portrait and the road they took.</p>
          </div>

          <div className="mt-[var(--space-block)] grid gap-[var(--space-section)]">
            {stories.map(({ story, feature }, i) => (
              <StorySpread key={story.id} story={story} feature={feature} index={i} isSample={board.isSample} />
            ))}
          </div>
        </div>
      </section>

      {/* III. Consent and verification */}
      <section aria-labelledby="consent-title" className="scene-surface bg-ink py-[var(--space-section)]">
        <div className="container-v grid gap-12 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-[clamp(2rem,6vw,7rem)]">
          <Star className="size-10 lg:mt-6" />
          <div>
            <h2 id="consent-title" className="settle max-w-[18ch] text-[clamp(2.75rem,6vw,6.25rem)] leading-[0.92] tracking-[-0.025em]">
              Every result here is verified and published with the student&rsquo;s <em className="font-normal">consent.</em>
            </h2>
            <div className="mt-12 grid gap-10 border-t border-[var(--line-d)] pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <p className="max-w-[52ch] text-body-d">
                We check each selection against the official result before it appears on the board. Students choose what is shown: their name, their town, their words. Until then, the board stays a sample.
              </p>
              <Link href="/contact" className="group inline-flex items-baseline gap-3 font-display text-[clamp(1.75rem,2.6vw,2.4rem)] leading-none">
                <span className="link-underline">
                  Selected? <em className="font-normal">Tell us.</em>
                </span>
                <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
