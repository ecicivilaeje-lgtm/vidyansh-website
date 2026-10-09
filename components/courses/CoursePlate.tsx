import type { Course } from "@/lib/types";

/**
 * A course's image until photography is supplied: one engineering drawing per course,
 * drawn in fine ivory line on black, in the same drafting language as the rest of the site.
 * Lines carry pathLength=1 so CSS can draw them in as the panel scrolls into view.
 */

const W = 480;
const H = 600;

const captions: Record<Course["plate"], string> = {
  beam: "Simply supported beam · bending moment",
  track: "Permanent way · perspective",
  bridge: "Arch bridge · elevation",
  gear: "Spur gear · 24 teeth",
};

export function plateCaption(plate: Course["plate"]) {
  return captions[plate];
}

export function CoursePlate({ plate, index, label }: { plate: Course["plate"]; index: number; label: string }) {
  const no = String(index + 1).padStart(2, "0");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" className="plate-art size-full">
      <defs>
        <radialGradient id={`plate-glow-${plate}`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#f4eee2" stopOpacity="0.075" />
          <stop offset="100%" stopColor="#f4eee2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#plate-glow-${plate})`} />

      {/* Drafting sheet: border, centre marks */}
      <g stroke="currentColor" fill="none" strokeWidth="0.75" opacity="0.22">
        <rect x="18" y="18" width={W - 36} height={H - 36} />
        <path d="M240 18v10M240 572v10M18 300h10M452 300h10" />
      </g>

      <clipPath id={`plate-sheet-${plate}`}>
        <rect x="18" y="18" width={W - 36} height={H - 36} />
      </clipPath>
      <g clipPath={`url(#plate-sheet-${plate})`} className="plate-drawing" stroke="currentColor" fill="none" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        {plate === "beam" && <Beam />}
        {plate === "track" && <Track />}
        {plate === "bridge" && <Bridge />}
        {plate === "gear" && <Gear />}
      </g>

      {/* Title block */}
      <g fontFamily="var(--font-mono), monospace" fill="currentColor" fontSize="8.5" letterSpacing="1.6">
        <g stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.35">
          <rect x="318" y="520" width="134" height="52" />
          <path d="M318 538h134M392 538v34" />
        </g>
        <text x="326" y="532" opacity="0.7">VIDYANSH · {label.toUpperCase()}</text>
        <text x="326" y="556" opacity="0.55">PLATE</text>
        <text x="326" y="566" opacity="0.9">{no}</text>
        <text x="400" y="556" opacity="0.55">SCALE</text>
        <text x="400" y="566" opacity="0.9">NTS</text>
      </g>
    </svg>
  );
}

const faint = { opacity: 0.35, strokeWidth: 0.75 };
const L = { pathLength: 1 };

function Beam() {
  const arrows = Array.from({ length: 11 }, (_, i) => 92 + i * 29.6);
  return (
    <>
      {/* Distributed load */}
      <path {...L} d="M92 150H388" />
      {arrows.map((x) => (
        <path key={x} {...L} d={`M${x} 150V226M${x - 5} 218L${x} 226L${x + 5} 218`} opacity="0.8" />
      ))}
      <text x="240" y="138" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="var(--font-display), serif" fontStyle="italic" fontSize="20" opacity="0.8">
        w
      </text>
      {/* Beam */}
      <rect {...L} x="78" y="230" width="324" height="20" />
      {/* Pin and roller supports */}
      <path {...L} d="M92 250L76 278H108Z" />
      <path {...L} d="M70 284H114" {...faint} />
      <path {...L} d="M388 250L372 274H404Z" />
      <circle {...L} cx="378" cy="280" r="5" />
      <circle {...L} cx="398" cy="280" r="5" />
      <path {...L} d="M366 290H410" {...faint} />
      {/* Span dimension */}
      <path {...L} d="M92 318H388M92 310V326M388 310V326" {...faint} />
      <text x="240" y="312" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="var(--font-display), serif" fontStyle="italic" fontSize="16" opacity="0.6">
        L
      </text>
      {/* Projection lines and bending moment diagram */}
      <path {...L} d="M92 290V500M388 300V500M240 250V470" strokeDasharray="3 5" opacity="0.3" />
      <path {...L} d="M92 400H388" {...faint} />
      <path {...L} d="M92 400Q240 560 388 400" strokeWidth="1.4" />
      <text x="252" y="468" fill="currentColor" stroke="none" fontFamily="var(--font-display), serif" fontStyle="italic" fontSize="17" opacity="0.75">
        wL²/8
      </text>
    </>
  );
}

function Track() {
  const vx = 240;
  const vy = 214;
  const rails = [
    [96, 112],
    [384, 368],
  ];
  const sleepers = Array.from({ length: 14 }, (_, i) => {
    const t = 1 / (1 + i * 0.55);
    const y = vy + (H - vy) * t;
    const half = 190 * t;
    return { y, x1: vx - half, x2: vx + half, w: 6 * t + 0.5 };
  });
  return (
    <>
      {/* Horizon and the light at the end of the line */}
      <path {...L} d={`M18 ${vy}H462`} {...faint} />
      <circle {...L} cx={vx} cy={vy} r="34" opacity="0.4" />
      <circle {...L} cx={vx} cy={vy} r="58" opacity="0.18" />
      {sleepers.map((s) => (
        <path key={s.y} {...L} d={`M${s.x1} ${s.y}H${s.x2}`} strokeWidth={s.w} opacity="0.32" strokeLinecap="butt" />
      ))}
      {rails.map(([a, b]) => (
        <g key={a}>
          <path {...L} d={`M${a} ${H}L${vx} ${vy}`} strokeWidth="1.6" />
          <path {...L} d={`M${b} ${H}L${vx} ${vy}`} />
        </g>
      ))}
      {/* Rail profile, as a detail */}
      <g transform="translate(352 64)" opacity="0.7">
        <path {...L} d="M14 0H40V8H32V40L48 50V56H6V50L22 40V8H14Z" />
        <path {...L} d="M60 0H84M60 56H84M72 0V56" {...faint} />
      </g>
    </>
  );
}

function Bridge() {
  const hangers = Array.from({ length: 13 }, (_, i) => 84 + i * 26);
  // Arch y for a parabola through (60,430), (240,280), (420,430)
  const arch = (x: number) => 280 + 150 * ((x - 240) / 180) ** 2;
  return (
    <>
      {/* Deck */}
      <path {...L} d="M30 262H450M30 276H450" />
      {/* Arch and hangers */}
      <path {...L} d="M60 430Q240 130 420 430" strokeWidth="1.5" />
      <path {...L} d="M84 430Q240 160 396 430" {...faint} />
      {hangers.map((x) => (
        <path key={x} {...L} d={`M${x} 276V${Math.min(arch(x), 430)}`} opacity="0.55" />
      ))}
      {/* Abutments */}
      <path {...L} d="M40 446L60 426L80 446ZM400 446L420 426L440 446Z" />
      <path {...L} d="M36 276V456M444 276V456" {...faint} />
      {/* Water and reflection */}
      <path {...L} d="M18 456H462" {...faint} />
      <path {...L} d="M60 456Q240 630 420 456" strokeDasharray="2 7" opacity="0.18" />
      {[476, 494, 516].map((y, i) => (
        <path key={y} {...L} d={`M${90 + i * 40} ${y}H${180 + i * 20}M${270 - i * 10} ${y}H${380 - i * 30}`} opacity="0.22" />
      ))}
      {/* Span dimension */}
      <path {...L} d="M60 214H420M60 206V222M420 206V222" {...faint} />
      <text x="240" y="204" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="var(--font-mono), monospace" fontSize="8.5" letterSpacing="1.6" opacity="0.6">
        SPAN
      </text>
    </>
  );
}

function gearPath(cx: number, cy: number, teeth: number, rOuter: number, rRoot: number) {
  const step = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step - Math.PI / 2;
    const p = (r: number, t: number) => `${(cx + r * Math.cos(a + t * step)).toFixed(1)} ${(cy + r * Math.sin(a + t * step)).toFixed(1)}`;
    pts.push(p(rRoot, 0), p(rRoot, 0.18), p(rOuter, 0.32), p(rOuter, 0.58), p(rRoot, 0.72));
  }
  return `M${pts.join("L")}Z`;
}

const bigGear = gearPath(232, 292, 24, 156, 136);
const smallGear = gearPath(402, 92, 12, 82, 62);

function Gear() {
  return (
    <>
      {/* Centre lines */}
      <path {...L} d="M40 292H430M232 100V490" strokeDasharray="14 4 2 4" opacity="0.3" />
      <path {...L} d={bigGear} strokeWidth="1.3" />
      <circle {...L} cx="232" cy="292" r="146" strokeDasharray="3 5" opacity="0.35" />
      <circle {...L} cx="232" cy="292" r="96" {...faint} />
      <circle {...L} cx="232" cy="292" r="46" />
      <path {...L} d="M222 268H242V276H222Z" opacity="0.8" />
      <circle {...L} cx="232" cy="292" r="22" />
      {/* Lightening holes */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i * Math.PI) / 3;
        return <circle key={i} {...L} cx={232 + 71 * Math.cos(a)} cy={292 + 71 * Math.sin(a)} r="13" opacity="0.6" />;
      })}
      {/* Meshing pinion, cropped by the sheet */}
      <path {...L} d={smallGear} opacity="0.55" />
      <circle {...L} cx="402" cy="92" r="20" opacity="0.4" />
      {/* Diameter dimension */}
      <path {...L} d="M76 488H388M76 480V496M388 480V496" {...faint} />
      <text x="232" y="480" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="var(--font-mono), monospace" fontSize="8.5" letterSpacing="1.6" opacity="0.6">
        Ø OUTSIDE
      </text>
    </>
  );
}
