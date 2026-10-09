import Link from "next/link";
import { testSeriesExams, testSeriesFormats } from "@/content/test-series";

/** Two labelled rails, By exam and By format, linking to their own catalogue pages. */
export function CategoryRail({ current }: { current: string }) {
  const item = (href: string, label: string) => {
    const active = current === href;
    return (
      <li key={href}>
        <Link
          href={href}
          aria-current={active ? "page" : undefined}
          className={`block border-b-2 px-0.5 py-3 font-mono text-[0.71875rem] font-medium tracking-[0.14em] whitespace-nowrap uppercase transition-colors ${
            active ? "border-ivory text-ivory" : "border-transparent text-mute-d hover:text-ivory"
          }`}
        >
          {label}
        </Link>
      </li>
    );
  };
  return (
    <nav aria-label="Test series categories" className="border-y border-[var(--line-d)]">
      <div className="container-v flex gap-x-10 max-lg:flex-col">
        <div className="flex min-w-0 items-center gap-6 overflow-x-auto">
          <span className="eyebrow shrink-0 text-ivory">By exam</span>
          <ul className="flex gap-6">
            {item("/test-series", "All")}
            {testSeriesExams.map((e) => item(`/test-series/${e.code}`, e.label))}
          </ul>
        </div>
        <span aria-hidden="true" className="my-3 w-px bg-[var(--line-d)] max-lg:hidden" />
        <div className="flex min-w-0 items-center gap-6 overflow-x-auto max-lg:border-t max-lg:border-[var(--line-d)]">
          <span className="eyebrow shrink-0 text-ivory">By format</span>
          <ul className="flex gap-6">{testSeriesFormats.map((f) => item(`/test-series/format/${f.id}`, f.short))}</ul>
        </div>
      </div>
    </nav>
  );
}
