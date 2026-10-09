import type { Metadata } from "next";
import Link from "next/link";
import { exams } from "@/content/exams";
import { Bookshelf } from "@/components/library/Bookshelf";
import { getFreeStudyMaterials, getStudyMaterialPage, getStudyMaterials } from "@/lib/data/learning";

export const metadata: Metadata = {
  alternates: { canonical: "/study-material" },
  title: "Study material · Vidyansh",
  description:
    "Notes, formula sheets, solved previous year papers and practice books for SSC JE, RRB JE and State AE / JE, arranged by subject. Free titles open to every aspirant.",
};

export default async function StudyMaterialPage() {
  const [materials, free, page] = await Promise.all([getStudyMaterials(), getFreeStudyMaterials(), getStudyMaterialPage()]);
  const examOptions = exams.map((e) => ({ code: e.code, name: e.name }));

  return (
    <>
      {/* An ink head band keeps the fixed header legible above the ivory page. */}
      <div aria-hidden="true" className="h-[calc(var(--header-h)+env(safe-area-inset-top))] bg-ink" />

      <section aria-labelledby="library-title" className="on-light bg-ivory pb-[var(--space-section)] text-ink">
        {/* The shelf is the page: a compact heading, then the books within the first screen. */}
        <div className="container-v pt-[clamp(2.5rem,5vw,4.5rem)]">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
            <h1 id="library-title" className="text-[clamp(3.25rem,7.5vw,7.5rem)] leading-[0.86] tracking-[-0.035em]">
              Study <em className="font-normal">material</em>
            </h1>
            <div className="grid gap-4 lg:pb-2">
              <p className="text-[1.0625rem] text-mute-l">{page.intro}</p>
              <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-ink uppercase">{page.sampleNote}</p>
            </div>
          </div>

          <div className="mt-12">
            <Bookshelf materials={materials} examOptions={examOptions} formats={page.formats} />
          </div>
        </div>
      </section>

      <section aria-labelledby="free-title" className="scene-surface bg-ink py-[var(--space-section)]">
        <div className="container-v grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-[clamp(3rem,7vw,8rem)]">
          <div>
            <p className="eyebrow">Open to every aspirant</p>
            <h2 id="free-title" className="settle mt-5 text-[clamp(3.25rem,7vw,7.5rem)] leading-[0.88] tracking-[-0.025em]">
              Free to <em className="font-normal">download</em>
            </h2>
            <p className="mt-8 max-w-[38ch] text-body-d">
              Formula sheets, short notes and a solved paper, free for every aspirant. They will be ready to download here once published.
            </p>
            <p className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[0.75rem] tracking-[0.16em] uppercase">
              <Link href="/free-classes" className="group inline-flex items-center gap-2">
                <span className="link-underline">Free classes</span>
                <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">→</span>
              </Link>
              <Link href="/test-series" className="group inline-flex items-center gap-2">
                <span className="link-underline">Free tests</span>
                <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">→</span>
              </Link>
            </p>
          </div>

          <ol className="border-t border-ivory/40">
            {free.map((m, i) => (
              <li key={m.id} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 border-b border-[var(--line-d)] py-6 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto]">
                <span className="font-mono text-xs tabular-nums text-mute-d">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <p className="font-display text-[clamp(1.6rem,2.6vw,2.25rem)] leading-tight">
                    {m.subject} <em className="font-normal">· {m.title.toLowerCase()}</em>
                  </p>
                  <p className="mt-1.5 font-mono text-[0.6875rem] tracking-[0.14em] text-mute-d uppercase">
                    {m.code} · {page.formats[m.format]} · Pages —
                  </p>
                </div>
                <span className="col-start-2 font-mono text-[0.6875rem] tracking-[0.16em] text-mute-d uppercase sm:col-start-3">Coming soon</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="container-v eyebrow mt-12 normal-case tracking-[0.06em]">{page.sampleNote}</p>
      </section>
    </>
  );
}
