import { Star } from "@/components/ui/Star";

/** A section break, set like a printer's ornament between chapters. */
export function Ornament() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-5 py-[var(--space-block)]">
      <span className="h-px w-16 bg-[var(--line-l)]" />
      <Star className="size-4" />
      <span className="h-px w-16 bg-[var(--line-l)]" />
    </div>
  );
}
