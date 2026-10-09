"use client";

import { useEffect, useRef } from "react";
import { community } from "@/content/community";
import { ChapterMark } from "@/components/ui/ChapterMark";

/** A night sky of aspirants: each point of light is someone studying. Static under reduced motion. */
export function Community() {
  return (
    <section
      id="community"
      aria-labelledby="community-title"
      className="scene-surface relative overflow-hidden bg-ink py-[var(--space-section)]"
    >
      <Constellation />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_30%_50%,rgb(244_238_226/0.85),transparent_75%)]"
      />
      <div className="container-v relative">
        <ChapterMark
          numeral="VIII"
          name="Together"
          note="Student community"
          className="mb-[var(--space-block)]"
        />
        <div className="grid gap-16 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <div>
            <h2
              id="community-title"
              className="settle text-[clamp(3.75rem,9vw,10rem)] leading-[0.84] tracking-[-0.035em]"
            >
              {community.heading[0]}
              <em className="font-normal">{community.heading[1]}</em>
              {community.heading[2]}
            </h2>
            <p className="mt-10 max-w-[44ch] text-[1.1875rem] text-body-d">
              {community.body}
            </p>
            <ul className="mt-14 grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {community.channels.map((c) => (
                <li
                  key={c.title}
                  className="border-t border-[var(--line-d)] pt-3"
                >
                  <span className="font-display text-[1.75rem]">{c.title}</span>
                  <span className="mt-1 block text-sm text-mute-d">
                    {c.body}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid gap-12" aria-label="Example conversations">
            {community.threads.map((t, i) => (
              <li
                key={t.text}
                className={`border-l border-ivory/40 pl-6 ${i === 1 ? "lg:ml-16" : ""}`}
              >
                <span className="eyebrow">{t.meta}</span>
                <p className="mt-3 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-snug italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                {t.note && (
                  <p className="mt-3 font-mono text-[0.6875rem] tracking-[0.12em] text-ok uppercase">
                    ✓ {t.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0,
      h = 0,
      raf = 0,
      visible = false;
    let stars: { x: number; y: number; r: number; p: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 9000);
      let seed = 7;
      const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      stars = Array.from({ length: n }, () => ({
        x: rand() * w,
        y: rand() * h,
        r: rand() * 1.3 + 0.3,
        p: rand() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(244,238,226,0.07)";
      ctx.lineWidth = 0.6;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < Math.min(i + 6, stars.length); j++) {
          const a = stars[i],
            b = stars[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const s of stars) {
        const tw = still
          ? 0.7
          : 0.45 + 0.55 * Math.abs(Math.sin(t / 1400 + s.p));
        ctx.fillStyle =
          s.r > 1.25
            ? `rgba(244,238,226,${tw})`
            : `rgba(244,238,226,${tw * 0.7})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      draw(t);
      if (visible && !still) raf = requestAnimationFrame(loop);
    };

    resize();
    draw(0);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !still) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    const onResize = () => {
      resize();
      draw(performance.now());
    };
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 size-full"
    />
  );
}
