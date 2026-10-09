/**
 * An abstract street plan with a marked point, drawn in fine ivory line.
 * Not a real map: it stands in until the centre's location is confirmed.
 */
export function LocationPlan() {
  return (
    <figure className="grid gap-3">
      <svg viewBox="0 0 400 260" aria-hidden="true" className="plate-drawing block w-full text-ivory">
        <rect x="0.5" y="0.5" width="399" height="259" fill="none" stroke="currentColor" strokeOpacity="0.22" />
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          {/* Main roads: double lines */}
          <g strokeOpacity="0.55" strokeWidth="0.9">
            <path pathLength={1} d="M0 96h400M0 112h400" />
            <path pathLength={1} d="M232 0l-30 260M248 0l-30 260" />
          </g>
          {/* Lanes */}
          <g strokeOpacity="0.28" strokeWidth="0.75">
            <path d="M0 40h214M262 52h138M0 176h196M236 188h164M0 228h190" />
            <path d="M78 0v96M78 112v148M146 0v96M146 112v148M318 0v96M318 112v148" />
            <path d="M260 112c40 30 90 40 140 36" />
          </g>
          {/* Plots */}
          <g strokeOpacity="0.18" strokeWidth="0.75">
            <rect x="92" y="54" width="40" height="30" />
            <rect x="160" y="124" width="36" height="40" />
            <rect x="262" y="122" width="44" height="26" />
            <rect x="332" y="62" width="50" height="24" />
            <rect x="20" y="124" width="44" height="40" />
          </g>
          {/* The marked point */}
          <g strokeOpacity="0.95" strokeWidth="1">
            <circle cx="186" cy="74" r="13" />
            <circle cx="186" cy="74" r="2.5" fill="currentColor" />
            <path d="M186 52v9M186 87v9M164 74h9M199 74h9" />
          </g>
          {/* North arrow */}
          <g strokeOpacity="0.6" strokeWidth="0.9">
            <path d="M366 236v-28m-5 8 5-8 5 8" />
          </g>
        </g>
        <g fontFamily="var(--font-mono), monospace" fontSize="7.5" letterSpacing="1.5" fill="currentColor">
          <text x="368" y="200" textAnchor="middle" opacity="0.7">N</text>
          <text x="206" y="62" opacity="0.85">VIDYANSH CENTRE</text>
          <text x="12" y="250" opacity="0.6">PLAN · NOT TO SCALE</text>
        </g>
      </svg>
      <figcaption className="flex flex-wrap justify-between gap-2 font-mono text-[0.625rem] tracking-[0.16em] text-mute-d uppercase">
        <span>Location plan · Map to come</span>
        <span>Abstract drawing, not a real map</span>
      </figcaption>
    </figure>
  );
}
