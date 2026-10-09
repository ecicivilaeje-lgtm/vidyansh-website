import type { ReactNode } from "react";
import type { BookChapter } from "@/lib/people-types";

/** Three-column book grid: marginalia, the measure, and air. Pull quotes break out across the measure. */
export const bookGrid = "grid gap-x-[clamp(2rem,4vw,4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,36rem)_minmax(0,1fr)]";

interface Props {
  chapter: BookChapter;
  /** Set the opening paragraph with a large drop cap. */
  dropCap?: boolean;
  /** Extra matter set inside the measure after the paragraphs (sequences, lists). */
  children?: ReactNode;
}

export function Chapter({ chapter, dropCap = true, children }: Props) {
  const headingId = `chapter-${chapter.id}`;
  return (
    <section aria-labelledby={headingId}>
      <header className={bookGrid}>
        <div className="lg:col-start-2">
          <p className="eyebrow">Chapter {chapter.numeral}</p>
          <h2 id={headingId} className="settle mt-5 text-[clamp(2.75rem,5.5vw,5rem)] leading-[0.92] tracking-[-0.025em]">
            {chapter.title}
          </h2>
          <span aria-hidden="true" className="mt-8 block h-px w-16 bg-ink" />
        </div>
      </header>

      <div className="mt-10 grid gap-7">
        {chapter.paragraphs.map((p, i) => (
          <div key={i} className="contents">
            <div className={`${bookGrid} items-start`}>
              {p.margin && (
                <aside className="mb-3 font-mono text-[0.6875rem] leading-relaxed tracking-[0.1em] text-mute-l uppercase lg:col-start-1 lg:row-start-1 lg:mb-0 lg:max-w-[20ch] lg:justify-self-end lg:border-r lg:border-[var(--line-l)] lg:pt-1.5 lg:pr-5 lg:text-right">
                  <span className="sr-only">Margin note: </span>
                  {p.margin}
                </aside>
              )}
              <p
                className={`text-[1.1875rem] leading-[1.75] text-ink lg:col-start-2 lg:row-start-1 ${
                  dropCap && i === 0
                    ? "first-letter:float-left first-letter:mt-[0.06em] first-letter:mr-3 first-letter:font-display first-letter:text-[5.4em] first-letter:leading-[0.78] first-letter:font-medium"
                    : ""
                }`}
              >
                {p.text}
              </p>
            </div>
            {chapter.pullQuote?.after === i && (
              <blockquote className={`${bookGrid} my-[clamp(2rem,5vw,4rem)]`}>
                <p className="border-y border-ink py-8 font-display text-[clamp(2.25rem,4.8vw,4.75rem)] leading-[1] tracking-[-0.02em] text-balance italic lg:col-span-2 lg:col-start-2 lg:pr-[10%]">
                  {chapter.pullQuote.text}
                </p>
              </blockquote>
            )}
          </div>
        ))}
      </div>

      {children && (
        <div className={`${bookGrid} mt-10`}>
          <div className="lg:col-start-2">{children}</div>
        </div>
      )}
    </section>
  );
}
