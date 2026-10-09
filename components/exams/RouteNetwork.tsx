import type { Exam } from "@/lib/types";

/**
 * The masthead drawing: one line per exam, each with its own stations,
 * all converging on a single terminus. Decorative; the real content is the list below.
 */
export function RouteNetwork({ exams }: { exams: Exam[] }) {
  const W = 1200;
  const H = 440;
  const ty = H / 2;
  const gap = 340 / Math.max(exams.length - 1, 1);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="route-network h-auto w-full overflow-visible text-ivory">
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        {/* Construction grid */}
        <path d={`M0 ${ty}H${W}`} strokeWidth="0.75" strokeDasharray="14 4 2 4" opacity="0.18" />
        <path d="M640 20V420M980 20V420" strokeWidth="0.75" strokeDasharray="2 6" opacity="0.18" />
        {exams.map((e, i) => {
          const y = 50 + i * gap;
          const stations = (e.stages?.length ?? 3) - 1;
          const step = 520 / Math.max(stations, 1);
          return (
            <g key={e.code}>
              <path pathLength={1} className="route-network__line" d={`M60 ${y}H600C760 ${y} 820 ${ty} 980 ${ty}`} strokeWidth="1.2" opacity="0.75" />
              {Array.from({ length: stations + 1 }, (_, k) => (
                <circle key={k} cx={80 + k * step} cy={y} r="5" fill="var(--color-ink)" strokeWidth="1.2" opacity="0.9" />
              ))}
            </g>
          );
        })}
        <path d={`M980 ${ty}H1140`} strokeWidth="1.6" />
        <circle cx="1140" cy={ty} r="22" strokeWidth="0.75" opacity="0.35" />
        <circle cx="1140" cy={ty} r="40" strokeWidth="0.75" strokeDasharray="2 5" opacity="0.25" />
      </g>
      <path d={`M1140 ${ty - 14} L1142.2 ${ty - 2.2} L1154 ${ty} L1142.2 ${ty + 2.2} L1140 ${ty + 14} L1137.8 ${ty + 2.2} L1126 ${ty} L1137.8 ${ty - 2.2}Z`} fill="var(--color-gold)" />
      <g className="max-md:hidden" fill="currentColor" fontFamily="var(--font-mono), monospace" fontSize="12" letterSpacing="2.2">
        {exams.map((e, i) => (
          <text key={e.code} x="60" y={50 + i * gap - 16} opacity="0.7">
            {`L${i + 1} · ${e.name.toUpperCase()}`}
          </text>
        ))}
        <text x="1140" y={ty + 66} textAnchor="middle" opacity="0.7">
          DESTINATION
        </text>
      </g>
    </svg>
  );
}
