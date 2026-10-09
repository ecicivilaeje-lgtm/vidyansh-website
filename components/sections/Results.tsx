import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ChapterMark } from "@/components/ui/ChapterMark";
import { Reveal } from "@/components/ui/Reveal";
import { orDash } from "@/lib/format";
import type { ResultsData } from "@/lib/types";

/** ACHIEVE: results as an open arrivals ledger, then one story told large. Sample content is labelled as such. */
export function Results({ data }: { data: ResultsData }) {
  const [lead, ...rest] = data.stories;
  return (
    <section id="results" aria-labelledby="results-title" className="scene-surface relative overflow-hidden bg-ink py-[var(--space-section)]">
      <div className="container-v">
        <ChapterMark numeral="VI" name="Achieve" note="Results" className="mb-[var(--space-block)]" />
        <h2 id="results-title" className="settle text-[clamp(4rem,11vw,12rem)] leading-[0.82] tracking-[-0.04em]">
          They <em className="font-normal">arrived</em>
        </h2>

        <dl className="mt-[var(--space-block)] grid gap-10 sm:grid-cols-3">
          {data.stats.map((s) => (
            <div key={s.label} className="grid content-start gap-3 border-t border-ivory/40 pt-5">
              <dt className="order-2 max-w-[22ch] text-mute-d">{s.label}</dt>
              <dd className="order-1 font-display text-[clamp(3.5rem,6vw,6rem)] leading-none tabular-nums">{orDash(s.value)}</dd>
            </div>
          ))}
        </dl>

        {data.isSample && <p className="eyebrow mt-10">Sample layout · verified results will be published with each student&rsquo;s consent</p>}

        <div className="mt-[var(--space-block)]">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ivory/40 pb-4">
            <span className="font-display text-[clamp(1.75rem,2.6vw,2.4rem)] leading-none">Arrivals, {data.year}</span>
            <span className="eyebrow">Dream → Destination</span>
          </div>
          <table className="stack-table w-full border-collapse font-mono text-[0.8125rem]">
            <caption className="sr-only">Results board{data.isSample ? ", sample rows" : ""}</caption>
            <thead>
              <tr className="eyebrow text-left">
                {["Student", "From", "Destination", "Rank"].map((h) => (
                  <th key={h} scope="col" className="border-b border-[var(--line-d)] py-3 pr-4 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.arrivals.map((a, i) => (
                <tr key={i} className={data.isSample ? "text-mute-d" : "text-ivory"}>
                  <td className="border-b border-[var(--line-d)] py-5 pr-4 tracking-[0.06em] uppercase">{a.student}</td>
                  <td data-label="From" className="border-b border-[var(--line-d)] py-5 pr-4 tracking-[0.06em] uppercase">{a.from}</td>
                  <td data-label="Destination" className="border-b border-[var(--line-d)] py-5 pr-4 tracking-[0.06em] text-body-d uppercase">{a.destination}</td>
                  <td data-label="Rank" className="border-b border-[var(--line-d)] py-5 tracking-[0.06em] text-ivory uppercase">{a.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {lead && (
          <figure className="mt-[var(--space-section)] grid gap-10 lg:grid-cols-[1fr_2.6fr]">
            <figcaption className="grid content-start gap-2 border-t border-ivory/40 pt-5">
              <span className="eyebrow">{lead.firstName}</span>
              <span className="text-mute-d">{lead.byline}</span>
              <span className="font-mono text-xs tracking-[0.12em] text-ivory">{lead.rank}</span>
            </figcaption>
            <Reveal as="blockquote">
              <p className="font-display text-[clamp(2.25rem,4.6vw,4.75rem)] leading-[1.04] tracking-[-0.015em] text-balance italic">&ldquo;{lead.quote}&rdquo;</p>
            </Reveal>
          </figure>
        )}

        {rest.length > 0 && (
          <ul className="mt-[var(--space-block)] grid gap-8 lg:ml-[calc((100%-2.5rem)/3.6+2.5rem)] lg:grid-cols-2" aria-label="More stories">
            {rest.map((s) => (
              <li key={s.id} className="border-t border-[var(--line-d)] pt-5">
                <p className="font-display text-[1.5rem] leading-snug text-body-d italic">&ldquo;{s.quote}&rdquo;</p>
                <p className="eyebrow mt-4">
                  {s.byline} · {s.rank}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-[var(--space-block)] flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[var(--line-d)] pt-8">
          <Button href="/results" variant="ghost">
            See every arrival
          </Button>
          <Link href="/contact" className="link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase">
            Selected? Tell us →
          </Link>
        </div>
      </div>
    </section>
  );
}
