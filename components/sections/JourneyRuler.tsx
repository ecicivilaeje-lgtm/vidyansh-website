"use client";

import { useEffect, useRef } from "react";
import type { JourneyStage } from "@/lib/types";

/** The five-stage measured scale at the foot of the hero. The gold diamond tracks scroll progress to the end of the journey. */
export function JourneyRuler({ stages }: { stages: JourneyStage[] }) {
  const gem = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const journey = document.getElementById("journey");
    if (!journey || !gem.current) return;
    const onScroll = () => {
      const end = journey.offsetTop + journey.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, end)));
      if (gem.current) gem.current.style.left = `${p * 100}%`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <div className="flex justify-between gap-3">
        <span className="eyebrow">The journey</span>
        <span className="eyebrow">Scroll to begin</span>
      </div>
      <div className="dimension mt-3.5">
        <span ref={gem} aria-hidden="true" className="absolute top-[-5px] left-0 size-2.5 -translate-x-1/2 rotate-45 bg-gold shadow-[0_0_16px_var(--color-gold)]" />
      </div>
      <nav aria-label="Journey chapters" className="grid grid-cols-5">
        {stages.map((s, i) => (
          <a
            key={s.id}
            href={`#chapter-${s.id}`}
            data-chapter={i}
            className="relative pt-4 font-mono text-[0.65625rem] font-medium tracking-[0.16em] text-mute-d uppercase transition-colors before:absolute before:top-[-5px] before:left-0 before:h-2.5 before:w-px before:bg-[var(--hair)] hover:text-ivory"
          >
            {s.number}
            <span className="hidden sm:inline"> {s.title}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
