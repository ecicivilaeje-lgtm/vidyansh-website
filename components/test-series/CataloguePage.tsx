import Link from "next/link";
import { testSeriesFormats, testSeriesPage } from "@/content/test-series";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";
import type { TestSeries } from "@/lib/types";
import { Catalogue } from "./Catalogue";
import { CategoryRail } from "./CategoryRail";
import { OmrPattern } from "./OmrPattern";

interface Props {
  series: TestSeries[];
  /** Path of the current category, used to mark the rail. */
  current: string;
  /** Heading above the ledger, e.g. "All test series" or "SSC JE". */
  heading: string;
  /** Series whose free test the hero button opens. */
  freeSeries: TestSeries;
}

/** The Test Series catalogue: an examination hall, not a shop. Shared by the all, by-exam and by-format pages. */
export function CataloguePage({ series, current, heading, freeSeries }: Props) {
  const t = testSeriesPage.title;
  const isAll = current === "/test-series";
  return (
    <>
      <header className="relative overflow-hidden bg-ink pt-[calc(var(--header-h)+clamp(3.5rem,8vw,7rem))] pb-[var(--space-block)]">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_88%_40%,rgb(200_144_47/0.08),transparent_70%)]" />
        <div className="container-v relative grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="eyebrow text-ivory">{isAll ? testSeriesPage.eyebrow : heading}</p>
            <h1 className="mt-6 max-w-[14ch] text-[clamp(3.6rem,9vw,10rem)] leading-[0.84] tracking-[-0.035em]">
              {!isAll && <span className="sr-only">{heading}: </span>}
              {t[0]}
              <em className="font-normal text-ivory">{t[1]}</em>
              {t[2]}
            </h1>
            <p className="mt-8 max-w-[52ch] text-body-d">{testSeriesPage.intro}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={routes.freeTest(freeSeries)}>
                Take a free test
              </Button>
              <Button href="#how-it-works" variant="ghost">
                How it works
              </Button>
            </div>
          </div>
          <OmrPattern rows={10} className="hidden w-[11rem] text-ivory/40 lg:block" />
        </div>
      </header>

      <CategoryRail current={current} />

      <section aria-label="Series" className="bg-ink py-[var(--space-block)]">
        <div className="container-v">
          <Catalogue series={series} heading={heading} />
          <p className="eyebrow mt-8 max-w-[60ch] leading-relaxed normal-case tracking-[0.06em]">{testSeriesPage.catalogueNote}</p>
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="how-title" className="border-t border-[var(--line-d)] bg-night py-[var(--space-section)]">
        <div className="container-v">
          <p className="eyebrow">How it works</p>
          <h2 id="how-title" className="mt-5 settle text-[clamp(3.25rem,7vw,7.5rem)] leading-[0.88] tracking-[-0.025em]">
            See the analysis <em className="font-normal text-ivory">before</em> you pay.
          </h2>
          <ol className="mt-12 grid border-t border-[var(--line-d)] sm:grid-cols-2 lg:grid-cols-4">
            {testSeriesPage.steps.map((s, i) => (
              <li key={s.n} className={`grid content-start gap-3 border-b border-[var(--line-d)] py-6 sm:pr-6 lg:border-b-0 ${i > 0 ? "lg:border-l lg:pl-6" : ""} ${i % 2 === 1 ? "sm:border-l sm:pl-6 lg:pl-6" : ""}`}>
                <span className="font-mono text-xs tracking-[0.14em] text-mute-d">{s.n}</span>
                <span className="font-display text-[1.65rem] leading-tight">{s.title}</span>
                <span className="text-[0.9375rem] text-body-d">{s.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="formats-title" className="scene-sheet on-light bg-ivory py-[var(--space-section)] text-ink">
        <div className="container-v grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">Four ways to practise</p>
            <h2 id="formats-title" className="mt-5 settle text-[clamp(3.25rem,7vw,7.5rem)] leading-[0.88] tracking-[-0.025em]">
              Choose the <em className="font-normal text-ink">format</em>
            </h2>
          </div>
          <ul className="border-t border-ink">
            {testSeriesFormats.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/test-series/format/${f.id}`}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 border-b border-[var(--line-l)] py-6 transition-[padding] duration-500 ease-out-expo hover:pl-3 md:grid-cols-[16rem_minmax(0,1fr)_auto]"
                >
                  <span className="font-display text-[clamp(1.75rem,2.6vw,2.4rem)] leading-tight transition-colors group-hover:text-ink group-hover:italic">{f.label}</span>
                  <span className="col-start-1 text-mute-l md:col-start-2">{f.note}</span>
                  <span aria-hidden="true" className="col-start-2 row-start-1 md:col-start-3">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
