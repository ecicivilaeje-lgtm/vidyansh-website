/** A column of OMR answer bubbles, a few filled: the Test Series motif. Decorative only. */
export function OmrPattern({ rows = 12, className = "" }: { rows?: number; className?: string }) {
  // Deterministic "answers" so server and client render the same marks.
  const filled = Array.from({ length: rows }, (_, i) => (i * 7 + 3) % 4);
  return (
    <svg viewBox={`0 0 170 ${rows * 26 + 10}`} aria-hidden="true" className={className}>
      {filled.map((pick, r) => (
        <g key={r} transform={`translate(0 ${r * 26 + 14})`}>
          <text x="0" y="4" fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1" fill="currentColor" opacity="0.5">
            {String(r + 1).padStart(2, "0")}
          </text>
          {[0, 1, 2, 3].map((o) => (
            <circle
              key={o}
              cx={40 + o * 34}
              cy="0"
              r="8.5"
              fill={o === pick && r < rows - 4 ? "currentColor" : "none"}
              stroke="currentColor"
              strokeOpacity={o === pick && r < rows - 4 ? 1 : 0.35}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
