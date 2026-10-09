"use client";

import { useEffect, useRef, useState } from "react";
import { methodLayers, type MethodIcon } from "@/content/method";
import { ChapterMark } from "@/components/ui/ChapterMark";

const icons: Record<MethodIcon, string> = {
  play: "M-8 -6 L8 0 L-8 6 Z",
  notes: "M-9 -6 H9 M-9 -2 H9 M-9 2 H5 M-9 6 H2",
  graph: "M-10 6 L-4 0 L1 3 L10 -6",
  clock: "M0 -7 A7 7 0 1 1 -0.01 -7 M0 -4 V0 L3 2",
  chat: "M-9 -6 H9 V3 H-2 L-6 7 V3 H-9 Z",
};

/** Five layers of the method, drawn as stacked axonometric plates that separate as the section scrolls in. */
export function Methodology() {
  const [active, setActive] = useState(0);
  const [exploded, setExploded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setExploded(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="method" aria-labelledby="method-title" className="scene-surface relative overflow-hidden bg-night py-[var(--space-section)]">
      <div aria-hidden="true" className="drafting-grid absolute inset-0 opacity-40" />
      <div className="container-v relative">
        <ChapterMark numeral="IV" name="The method" className="mb-[var(--space-block)]" />
        <div className="grid items-end gap-8 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 id="method-title" className="settle text-[clamp(3.75rem,8.4vw,9rem)] leading-[0.86] tracking-[-0.03em]">
              Built in <em className="font-normal">layers</em>
            </h2>
          </div>
          <p className="max-w-[36ch] text-[1.1875rem] text-body-d md:justify-self-end">
            A week at Vidyansh is five layers working together. Each one carries the next; take one away and the structure leans.
          </p>
        </div>

        <div ref={ref} className="mt-[var(--space-block)] grid items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-[clamp(2rem,5vw,5rem)]">
          <ol className="border-t border-[var(--line-d)]">
            {methodLayers.map((l, i) => (
              <li key={l.code} className="border-b border-[var(--line-d)]">
                <button
                  type="button"
                  aria-pressed={active === i}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group grid w-full grid-cols-[3rem_minmax(0,1fr)] gap-x-4 py-6 text-left"
                >
                  <span className={`font-mono text-xs tracking-[0.12em] transition-colors ${active === i ? "text-ivory" : "text-mute-d"}`}>{l.code}</span>
                  <span className={`font-display text-[clamp(1.9rem,3vw,2.75rem)] leading-tight transition-colors ${active === i ? "text-ivory italic" : "text-ivory/70 group-hover:text-ivory"}`}>
                    {l.title}
                  </span>
                  <span
                    className={`col-start-2 grid text-[0.9375rem] text-body-d transition-[grid-template-rows,opacity] duration-500 ease-out-expo ${
                      active === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span className="block max-w-[44ch] pt-2">{l.body}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <figure aria-label="Axonometric drawing of the five method layers" className="relative">
            <svg viewBox="0 0 520 520" className="mx-auto w-full max-w-[34rem]" role="img" aria-labelledby="plates-desc">
              <desc id="plates-desc">Five stacked plates, from L1 Concept class at the bottom to L5 Doubt desk at the top.</desc>
              {methodLayers.map((l, i) => {
                const gap = exploded ? 74 : 26;
                const y = 365 - i * gap;
                return (
                  <g key={l.code} className="plate" data-active={active === i} style={{ transform: `translateY(${y}px)` }}>
                    <path className="plate-side" d="M70 40 L260 135 L260 150 L70 55 Z" />
                    <path className="plate-side" d="M260 135 L450 40 L450 55 L260 150 Z" />
                    <path className="plate-top" d="M260 -55 L450 40 L260 135 L70 40 Z" />
                    <g transform="translate(260 40) scale(1.6 0.92)">
                      <path className="plate-icon" d={icons[l.icon]} strokeWidth="1.2" />
                    </g>
                    <text x="470" y="46" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.5">
                      {l.code}
                    </text>
                  </g>
                );
              })}
              <g stroke="rgb(7 7 6 / 0.22)" fill="none">
                <path d="M30 470 L30 90" strokeDasharray="2 4" />
                <path d="M24 470 h12 M24 90 h12" />
              </g>
              <text x="18" y="290" fill="var(--color-mute-d)" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2" transform="rotate(-90 18 290)">
                ONE WEEK
              </text>
            </svg>
            <figcaption className="eyebrow mt-4 text-center">Fig. 05 · Method, exploded view</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
