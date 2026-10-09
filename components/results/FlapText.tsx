import type { CSSProperties } from "react";

interface Props {
  text: string;
  /** Offset for the staggered flip, so a row turns over left to right. */
  start?: number;
}

/**
 * A word set as split-flap characters. The readable text is given once to
 * assistive technology; the character blocks themselves are decorative.
 */
export function FlapText({ text, start = 0 }: Props) {
  // Words stay whole when the row wraps; spaces between them are blank flaps.
  const words = text.toUpperCase().split(" ");
  let i = start;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="flap-row">
        {words.map((w, wi) => (
          <span key={wi} className="inline-flex gap-[2px] whitespace-nowrap">
            {wi > 0 && (
              <span className="flap flap--blank" style={{ "--i": i++ } as CSSProperties}>
                {" "}
              </span>
            )}
            {Array.from(w).map((c, ci) => (
              <span key={ci} className="flap" style={{ "--i": i++ } as CSSProperties}>
                {c}
              </span>
            ))}
          </span>
        ))}
      </span>
    </>
  );
}
