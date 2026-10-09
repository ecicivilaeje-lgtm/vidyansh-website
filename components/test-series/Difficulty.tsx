import type { Difficulty as Level } from "@/lib/types";

const words = ["", "Gentle", "Moderate", "Exam level", "Demanding", "Toughest"];

/** Five rising bars instead of a badge. */
export function Difficulty({ level, showLabel = false, tone = "dark" }: { level: Level; showLabel?: boolean; tone?: "dark" | "light" }) {
  const off = tone === "dark" ? "bg-ivory/15" : "bg-ink/15";
  const on = tone === "dark" ? "bg-ivory" : "bg-ink";
  return (
    <span className="inline-flex items-center gap-2.5">
      <span aria-hidden="true" className="flex items-end gap-[3px]">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`w-[5px] ${n <= level ? on : off}`} style={{ height: `${5 + n * 2.5}px` }} />
        ))}
      </span>
      <span className={showLabel ? "font-mono text-[0.6875rem] tracking-[0.12em] uppercase" : "sr-only"}>
        {showLabel ? words[level] : `Difficulty ${level} of 5, ${words[level].toLowerCase()}`}
      </span>
    </span>
  );
}
