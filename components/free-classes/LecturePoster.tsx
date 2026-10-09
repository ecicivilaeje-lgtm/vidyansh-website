import type { PosterKind } from "@/lib/learning-types";

/**
 * A recorded lecture's thumbnail until real video posters exist: a small drafting plate
 * in fine ivory line, one diagram per lecture. Decorative; the row carries the title.
 */
export function LecturePoster({ kind, no }: { kind: PosterKind; no: string }) {
  return (
    <svg viewBox="0 0 240 150" aria-hidden="true" className="plate-drawing block size-full text-ivory">
      <rect x="0.5" y="0.5" width="239" height="149" fill="#ece5d7" stroke="currentColor" strokeOpacity="0.22" />
      <path d="M120 0.5v6M120 143.5v6M0.5 75h6M233.5 75h6" stroke="currentColor" strokeOpacity="0.3" />
      <g fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.85">
        {kind === "beam" && <Beam />}
        {kind === "bernoulli" && <Bernoulli />}
        {kind === "circuit" && <Circuit />}
        {kind === "truss" && <Truss />}
        {kind === "phasor" && <Phasor />}
        {kind === "mohr" && <Mohr />}
      </g>
      <g fontFamily="var(--font-mono), monospace" fontSize="6.5" letterSpacing="1.3" fill="currentColor">
        <text x="12" y="16" opacity="0.6">LECTURE {no}</text>
        <text x="228" y="140" textAnchor="end" opacity="0.6">REC · —:—</text>
      </g>
    </svg>
  );
}

const label = { fontFamily: "var(--font-display), serif", fontStyle: "italic" as const, fontSize: 13, fill: "currentColor", stroke: "none" };

function Beam() {
  return (
    <>
      <path pathLength={1} d="M40 58h160" strokeWidth="1.4" />
      <path pathLength={1} d="M40 58l-7 11h14zM200 58l-7 11h14zM193 73h14" />
      {[52, 68, 84, 100, 116, 132, 148, 164, 180].map((x) => (
        <path key={x} d="M0 0v9m-2.5 -3 2.5 3 2.5 -3" transform={`translate(${x} 44)`} />
      ))}
      <path d="M40 42h160" strokeOpacity="0.5" />
      <path pathLength={1} d="M40 92 Q120 142 200 92" />
      <path d="M40 92h160" strokeOpacity="0.35" strokeDasharray="2 3" />
      <text x="120" y="38" textAnchor="middle" style={label}>w</text>
      <text x="122" y="134" textAnchor="middle" style={label}>wL²/8</text>
    </>
  );
}

function Bernoulli() {
  return (
    <>
      <path pathLength={1} d="M30 52h60c20 0 30 14 50 14h70M30 98h60c20 0 30-14 50-14h70" strokeWidth="1.2" />
      <path d="M60 52v-22M170 66v-24" />
      <path d="M57 38h6M167 50h6" strokeOpacity="0.6" />
      <path d="M40 75h12m-4-3 4 3-4 3M180 75h12m-4-3 4 3-4 3" />
      <text x="120" y="126" textAnchor="middle" style={label}>p + ½ρv² + ρgz = const</text>
    </>
  );
}

function Circuit() {
  return (
    <>
      <path pathLength={1} d="M50 40h28l4-7 8 14 8-14 8 14 4-7h20" />
      <path pathLength={1} d="M130 40c4 0 4-8 9-8s5 8 9 8c4 0 4-8 9-8s5 8 9 8h24v26M190 74v36H50V80" />
      <path d="M182 66h16M182 74h16" strokeWidth="1.4" />
      <circle cx="50" cy="72" r="8" />
      <path d="M45 72c2-4 4-4 5 0s3 4 5 0" />
      <path d="M50 40v24" />
      <text x="94" y="28" textAnchor="middle" style={label}>R</text>
      <text x="148" y="28" textAnchor="middle" style={label}>L</text>
      <text x="206" y="74" style={label}>C</text>
    </>
  );
}

function Truss() {
  return (
    <>
      <path pathLength={1} d="M36 104h168M36 104l42-56h84l42 56M78 48l42 56 42-56M78 48v56M162 48v56" />
      <path d="M36 104l-7 11h14zM204 104l-7 11h14z" />
      {[[36, 104], [78, 48], [120, 104], [162, 48], [204, 104], [78, 104], [162, 104]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill="#ece5d7" />
      ))}
      <path d="M120 22v18m-3-5 3 5 3-5" />
      <text x="128" y="32" style={label}>P</text>
    </>
  );
}

function Phasor() {
  return (
    <>
      <path d="M50 110h150M70 130V24" strokeOpacity="0.4" />
      <path pathLength={1} d="M70 110l120-24" strokeWidth="1.3" />
      <path pathLength={1} d="M70 110l60-66" strokeWidth="1.3" />
      <path d="M190 86l-8-1m8 1-6 5M130 44l-7 3m7-3-1 8" />
      <path d="M104 103a34 34 0 0 0-6-22" strokeOpacity="0.7" />
      <text x="194" y="84" style={label}>V</text>
      <text x="134" y="42" style={label}>I</text>
      <text x="108" y="94" style={label}>φ</text>
    </>
  );
}

function Mohr() {
  return (
    <>
      <path d="M28 80h190M60 128V24" strokeOpacity="0.4" />
      <circle pathLength={1} cx="130" cy="80" r="42" />
      <path pathLength={1} d="M100 50l60 60" strokeWidth="1.2" />
      <circle cx="100" cy="50" r="2.2" fill="#ece5d7" />
      <circle cx="160" cy="110" r="2.2" fill="#ece5d7" />
      <text x="212" y="94" style={label}>σ</text>
      <text x="46" y="32" style={label}>τ</text>
    </>
  );
}
