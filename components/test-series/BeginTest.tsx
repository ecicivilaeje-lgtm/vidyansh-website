"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAttempt, loadAttempt } from "@/lib/attempt";
import { routes } from "@/lib/routes";

/** The readiness declaration and start button. Offers to resume if an attempt is already saved on this device. */
export function BeginTest({ slug, testId, languages }: { slug: string; testId: string; languages: string[] }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<"none" | "in_progress" | "submitted">("none");

  useEffect(() => {
    const a = loadAttempt(testId);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- saved attempts live in localStorage, readable only after hydration
    setSaved(a ? (a.submittedAt ? "submitted" : "in_progress") : "none");
  }, [testId]);

  const begin = () => {
    if (saved !== "in_progress") clearAttempt(testId);
    router.push(routes.attempt(slug, testId));
  };

  return (
    <div className="grid gap-5">
      <label className="grid gap-2">
        <span className="eyebrow">Language</span>
        <select className="border-b border-ink/30 bg-transparent py-2 font-display text-xl outline-none focus:border-ink" defaultValue={languages[0]}>
          {languages.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </label>

      {saved === "in_progress" && (
        <p className="border-l-2 border-ink bg-ink/5 px-3 py-2 text-sm">You have an unfinished attempt saved on this device. Beginning will resume it where you left off.</p>
      )}
      {saved === "submitted" && (
        <p className="border-l-2 border-ink bg-ink/5 px-3 py-2 text-sm">
          You have already submitted this test.{" "}
          <Link href={routes.result(slug, testId)} className="underline underline-offset-4">
            See your result
          </Link>{" "}
          or begin again for a fresh attempt.
        </p>
      )}

      <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem]">
        <input type="checkbox" checked={ready} onChange={(e) => setReady(e.target.checked)} className="mt-1 size-4 shrink-0 accent-[#070706]" />
        <span>I have read the instructions. I will not refresh or close the window during the test, and I understand the timer will not stop once I begin.</span>
      </label>

      <button
        type="button"
        onClick={begin}
        disabled={!ready}
        className="inline-flex items-center justify-center gap-3 border border-ink bg-ink px-6 py-4 font-mono text-[0.75rem] font-medium tracking-[0.17em] text-ivory uppercase transition-colors enabled:hover:bg-transparent enabled:hover:text-ink disabled:cursor-not-allowed disabled:border-ink/20 disabled:bg-ink/10 disabled:text-mute-l"
      >
        {saved === "in_progress" ? "Resume test" : "I am ready, begin"}
      </button>
    </div>
  );
}
