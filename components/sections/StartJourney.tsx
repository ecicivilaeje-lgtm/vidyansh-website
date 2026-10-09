"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { exams } from "@/content/exams";
import { useExam } from "@/components/providers/ExamProvider";
import { Button } from "@/components/ui/Button";
import { Star } from "@/components/ui/Star";
import { ChapterMark } from "@/components/ui/ChapterMark";
import type { ExamCode } from "@/lib/types";

type Errors = Partial<Record<"name" | "phone", string>>;

/** Final call: a dawn that rises as you scroll in, and a short enquiry form. */
export function StartJourney() {
  const { exam, setExam } = useExam();
  const ref = useRef<HTMLElement>(null);
  const [rise, setRise] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(
        Math.max(
          (window.innerHeight - r.top) / (window.innerHeight + r.height * 0.4),
          0,
        ),
        1,
      );
      setRise(p);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    if (String(data.get("name") ?? "").trim().length < 2)
      next.name = "Please enter your name.";
    if (
      !/^[6-9]\d{9}$/.test(
        String(data.get("phone") ?? "")
          .replace(/[\s-]/g, "")
          .replace(/^(\+?91)/, ""),
      )
    )
      next.phone = "Enter a 10-digit Indian mobile number.";
    setErrors(next);
    if (Object.keys(next).length === 0) setDone(true);
    else
      e.currentTarget
        .querySelector<HTMLInputElement>(`[name="${Object.keys(next)[0]}"]`)
        ?.focus();
  };

  return (
    <section
      ref={ref}
      id="start"
      aria-labelledby="start-title"
      className="relative overflow-hidden bg-ink py-[var(--space-section)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[130%] bg-[radial-gradient(ellipse_70%_45%_at_50%_100%,rgb(232_170_80/0.26),rgb(200_144_47/0.07)_45%,transparent_72%)]"
        style={{
          transform: `translateY(${(1 - rise) * 35}%)`,
          opacity: 0.35 + rise * 0.65,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[18%] h-px bg-gradient-to-r from-transparent via-ivory/30 to-transparent"
      />

      <div className="container-v relative">
        <ChapterMark
          numeral="IX"
          name="Begin"
          className="mb-[var(--space-block)]"
        />
        <div className="grid items-end gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-[clamp(3rem,7vw,8rem)]">
          <div>
            <Star className="size-6" />
            <h2
              id="start-title"
              className="settle mt-8 text-[clamp(4rem,10vw,11rem)] leading-[0.84] tracking-[-0.04em]"
            >
              Start your
              <br />
              <em className="font-normal">journey.</em>
            </h2>
            <p className="mt-10 max-w-[36ch] text-[1.1875rem] text-body-d">
              Tell us where you are headed. A counsellor from the Vidyansh team
              will call you to plan the route, at no cost.
            </p>
          </div>

          <div>
            {done ? (
              <div role="status" className="grid gap-4 py-6">
                <Star className="size-5" />
                <p className="font-display text-3xl leading-tight">
                  Thank you. Your route starts here.
                </p>
                <p className="text-sm text-mute-d">
                  This preview does not send your details anywhere yet. When
                  enquiries go live, this form will connect to the Vidyansh
                  team.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-self-start"
                  onClick={() => setDone(false)}
                >
                  Edit details
                </Button>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} className="grid gap-8">
                <Field
                  label="Your name"
                  name="name"
                  autoComplete="name"
                  error={errors.name}
                />
                <Field
                  label="Mobile number"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  error={errors.phone}
                />
                <label className="grid gap-2">
                  <span className="eyebrow">Destination exam</span>
                  <select
                    name="exam"
                    value={exam ?? ""}
                    onChange={(e) =>
                      setExam((e.target.value || null) as ExamCode | null)
                    }
                    className="border-b border-ivory/30 bg-transparent py-3 font-display text-2xl outline-none focus:border-ivory"
                  >
                    <option value="" className="bg-ink">
                      Not decided yet
                    </option>
                    {exams.map((x) => (
                      <option key={x.code} value={x.code} className="bg-ink">
                        {x.name}
                      </option>
                    ))}
                  </select>
                </label>
                <Button type="submit" diamond className="mt-2 w-full">
                  Begin your journey
                </Button>
                <p className="text-xs text-mute-d">
                  We only use your number to call you about Vidyansh courses.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  error,
  ...rest
}: {
  label: string;
  name: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `f-${name}`;
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`border-b bg-transparent py-3 font-display text-2xl outline-none placeholder:text-mute-d ${error ? "border-bad" : "border-ivory/30 focus:border-ivory"}`}
        {...rest}
      />
      {error && (
        <p id={`${id}-err`} className="text-sm text-bad">
          {error}
        </p>
      )}
    </div>
  );
}
