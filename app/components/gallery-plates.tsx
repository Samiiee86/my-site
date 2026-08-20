/**
 * Gallery plates — six macro details of the ARC/1, drawn as vector scenes.
 *
 * Each plate fills its frame (preserveAspectRatio="slice") so it can be
 * cropped by the gallery grid and re-shown uncropped in the lightbox.
 * Gradient ids are prefixed per-plate because all six share one document.
 */

type PlateProps = { className?: string };

const frame = (className?: string) => ({
  viewBox: "0 0 400 300",
  preserveAspectRatio: "xMidYMid slice" as const,
  className,
  fill: "none" as const,
  "aria-hidden": true,
});

/* -- 01 · Headlight array ------------------------------------------------ */
export function PlateHeadlight({ className }: PlateProps) {
  return (
    <svg {...frame(className)}>
      <defs>
        <linearGradient id="hl-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#141926" />
          <stop offset="100%" stopColor="#04050a" />
        </linearGradient>
        <radialGradient id="hl-lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#e6ff8a" />
          <stop offset="100%" stopColor="#b5ef14" stopOpacity="0.2" />
        </radialGradient>
        <filter id="hl-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <rect width="400" height="300" fill="url(#hl-bg)" />
      {/* Cowl planes */}
      <path d="M -20 62 L 300 34 L 366 128 L 250 176 L 40 150 Z" fill="#0e1219" stroke="#2e3445" />
      <path d="M -20 150 L 250 176 L 300 268 L 20 300 Z" fill="#080b11" stroke="#212636" />
      {/* Lens cluster */}
      <g filter="url(#hl-glow)" opacity="0.85">
        <path d="M 96 92 L 258 76 L 286 132 L 120 152 Z" fill="#b5ef14" />
      </g>
      <path d="M 96 92 L 258 76 L 286 132 L 120 152 Z" fill="url(#hl-lamp)" />
      {/* Lens segmentation */}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M ${112 + i * 42} ${90 - i * 2} L ${124 + i * 42} ${88 - i * 2} L ${146 + i * 42} ${146 - i * 2} L ${134 + i * 42} ${148 - i * 2} Z`}
          fill="#04050a"
          opacity="0.55"
        />
      ))}
      {/* DRL blade */}
      <path d="M 108 176 L 270 158 L 274 172 L 112 190 Z" fill="#22cfff" opacity="0.75" />
      <path d="M 108 176 L 270 158 L 274 172 L 112 190 Z" fill="#22cfff" filter="url(#hl-glow)" opacity="0.5" />
    </svg>
  );
}

/* -- 02 · Cell stack ----------------------------------------------------- */
export function PlateCells({ className }: PlateProps) {
  const cells = Array.from({ length: 6 }, (_, r) =>
    Array.from({ length: 8 }, (_, c) => ({ r, c })),
  ).flat();

  return (
    <svg {...frame(className)}>
      <defs>
        <radialGradient id="cell-top" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0%" stopColor="#3d4658" />
          <stop offset="70%" stopColor="#161b26" />
          <stop offset="100%" stopColor="#0a0d14" />
        </radialGradient>
        <linearGradient id="cell-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1017" />
          <stop offset="100%" stopColor="#04050a" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#cell-bg)" />
      <g transform="translate(20 6) skewY(-8)">
        {cells.map(({ r, c }) => (
          <g key={`${r}-${c}`}>
            <circle cx={30 + c * 48} cy={40 + r * 48} r="20" fill="url(#cell-top)" stroke="#2e3445" />
            <circle cx={30 + c * 48} cy={40 + r * 48} r="8" fill="#04050a" stroke="#454c60" strokeWidth="0.75" />
          </g>
        ))}
        {/* Bus bars welding the rows together */}
        {[0, 1, 2, 3, 4, 5].map((r) => (
          <rect
            key={r}
            x="6"
            y={36 + r * 48}
            width="376"
            height="7"
            rx="3.5"
            fill="#d4fb4f"
            opacity={r % 2 === 0 ? 0.5 : 0.16}
          />
        ))}
      </g>
      {/* Vignette so the stack reads as lit from one side */}
      <rect width="400" height="300" fill="url(#cell-bg)" opacity="0.35" />
    </svg>
  );
}

/* -- 03 · Belt drive ----------------------------------------------------- */
/** Trig differs in its last bits between Node and the browser, which breaks
 *  hydration when the result is stringified into an attribute. Round it. */
const px = (n: number) => Number(n.toFixed(3));

export function PlateBelt({ className }: PlateProps) {
  return (
    <svg {...frame(className)}>
      <defs>
        <radialGradient id="belt-pulley" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#394154" />
          <stop offset="100%" stopColor="#0c0f16" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="#06080d" />
      {/* Swingarm plate behind */}
      <path d="M -10 196 L 420 158 L 420 224 L -10 260 Z" fill="#10131d" stroke="#212636" />
      {/* Pulley, cropped by the frame */}
      <circle cx="120" cy="170" r="118" fill="url(#belt-pulley)" stroke="#2e3445" strokeWidth="2" />
      <circle cx="120" cy="170" r="92" fill="#04050a" stroke="#454c60" />
      {/* Lightening holes */}
      {Array.from({ length: 9 }, (_, i) => i * 40).map((a) => (
        <circle
          key={a}
          cx={px(120 + 66 * Math.cos((a * Math.PI) / 180))}
          cy={px(170 + 66 * Math.sin((a * Math.PI) / 180))}
          r="15"
          fill="#0b0e15"
          stroke="#2e3445"
        />
      ))}
      <circle cx="120" cy="170" r="26" fill="#161b26" stroke="#656d84" strokeWidth="1.5" />
      {/* Belt runs off to the right */}
      <path d="M 120 52 L 420 92 L 420 112 L 120 72 Z" fill="#0a0d14" stroke="#2e3445" />
      {/* Belt teeth */}
      {Array.from({ length: 14 }, (_, i) => 150 + i * 20).map((x, i) => (
        <rect
          key={x}
          x={x}
          y={58 + i * 2.6}
          width="9"
          height="14"
          rx="2"
          fill="#d4fb4f"
          opacity="0.28"
          transform={`rotate(7.6 ${x} ${58 + i * 2.6})`}
        />
      ))}
      <path d="M 120 52 L 420 92" stroke="#d4fb4f" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

/* -- 04 · Cockpit HUD ---------------------------------------------------- */
export function PlateCockpit({ className }: PlateProps) {
  return (
    <svg {...frame(className)}>
      <defs>
        <linearGradient id="hud-bg" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#0f131c" />
          <stop offset="100%" stopColor="#04050a" />
        </linearGradient>
        <filter id="hud-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect width="400" height="300" fill="#04050a" />
      {/* Screen bezel, tilted toward the rider */}
      <g transform="rotate(-5 200 150)">
        <rect x="26" y="34" width="348" height="232" rx="18" fill="#0a0d14" stroke="#2e3445" strokeWidth="2" />
        <rect x="38" y="46" width="324" height="208" rx="12" fill="url(#hud-bg)" />

        {/* Speed arc */}
        <path d="M 96 214 A 92 92 0 1 1 244 214" fill="none" stroke="#212636" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M 96 214 A 92 92 0 0 1 196 68"
          fill="none"
          stroke="#d4fb4f"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 96 214 A 92 92 0 0 1 196 68"
          fill="none"
          stroke="#d4fb4f"
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#hud-glow)"
          opacity="0.7"
        />

        {/* Readout */}
        <text
          x="170"
          y="176"
          textAnchor="middle"
          fill="#eef1f6"
          fontSize="70"
          fontWeight="600"
          fontFamily="var(--font-display), sans-serif"
          letterSpacing="-2"
        >
          148
        </text>
        <text
          x="170"
          y="200"
          textAnchor="middle"
          fill="#656d84"
          fontSize="13"
          letterSpacing="4"
          fontFamily="var(--font-mono), monospace"
        >
          KM/H
        </text>

        {/* Right-hand column: state of charge + power bars */}
        <rect x="284" y="70" width="58" height="10" rx="5" fill="#d4fb4f" opacity="0.85" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x="284"
            y={92 + i * 20}
            width={58 - i * 9}
            height="10"
            rx="5"
            fill="#22cfff"
            opacity={0.55 - i * 0.09}
          />
        ))}
        <text
          x="284"
          y="216"
          fill="#98a0b4"
          fontSize="13"
          letterSpacing="2"
          fontFamily="var(--font-mono), monospace"
        >
          SPORT
        </text>
      </g>
    </svg>
  );
}

/* -- 05 · Brake caliper ------------------------------------------------- */
export function PlateCaliper({ className }: PlateProps) {
  // Disc centre sits below the frame so its swept face arcs across the plate.
  const CX = 150;
  const CY = 420;
  const R = 300;
  const holes = Array.from({ length: 17 }, (_, i) => -168 + i * 10);

  return (
    <svg {...frame(className)}>
      <defs>
        <linearGradient id="cal-body" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#525b71" />
          <stop offset="55%" stopColor="#252c3c" />
          <stop offset="100%" stopColor="#0c0f16" />
        </linearGradient>
        <linearGradient id="cal-disc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a1f2c" />
          <stop offset="45%" stopColor="#394257" />
          <stop offset="100%" stopColor="#161b26" />
        </linearGradient>
        <filter id="cal-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <rect width="400" height="300" fill="#05070c" />

      {/* Swept face of the disc */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="url(#cal-disc)" strokeWidth="58" />
      <circle cx={CX} cy={CY} r={R - 29} fill="none" stroke="#656d84" strokeWidth="1.25" />
      <circle cx={CX} cy={CY} r={R + 29} fill="none" stroke="#656d84" strokeWidth="1.25" />
      {/* Carrier bells inboard of the swept face */}
      <circle cx={CX} cy={CY} r={R - 52} fill="none" stroke="#2e3445" strokeWidth="10" />

      {/* Drilled holes */}
      {holes.map((a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <circle
            key={a}
            cx={px(CX + R * Math.cos(rad))}
            cy={px(CY + R * Math.sin(rad))}
            r="6.5"
            fill="#04050a"
            stroke="#98a0b4"
            strokeWidth="1"
          />
        );
      })}

      {/* Radial four-piston caliper straddling the disc */}
      <g transform="translate(228 130) rotate(15)">
        <path
          d="M -50 -66 Q -58 0 -50 66 L 50 66 Q 60 0 50 -66 Z"
          fill="url(#cal-body)"
          stroke="#98a0b4"
          strokeWidth="1.5"
        />
        {/* Piston bores */}
        {[-30, 30].map((dy) => (
          <circle key={dy} cx="0" cy={dy} r="21" fill="#0a0d14" stroke="#656d84" strokeWidth="1.5" />
        ))}
        {/* Bridge cut-out */}
        <path d="M -30 -60 L 30 -60 L 30 -50 L -30 -50 Z" fill="#04050a" opacity="0.7" />
        {/* Etched accent */}
        <path d="M -34 54 L 34 54" stroke="#d4fb4f" strokeWidth="3" strokeLinecap="round" />
        <path d="M -34 54 L 34 54" stroke="#d4fb4f" strokeWidth="8" strokeLinecap="round" filter="url(#cal-glow)" opacity="0.5" />
      </g>

      {/* Braided line running to the caliper */}
      <path d="M 262 60 Q 300 96 292 132" stroke="#454c60" strokeWidth="5" fill="none" strokeLinecap="round" />

      <text
        x="24"
        y="278"
        fill="#656d84"
        fontSize="12"
        letterSpacing="4"
        fontFamily="var(--font-mono), monospace"
      >
        330 MM · 4-PISTON
      </text>
    </svg>
  );
}

/* -- 06 · Tail ----------------------------------------------------------- */
export function PlateTail({ className }: PlateProps) {
  return (
    <svg {...frame(className)}>
      <defs>
        <linearGradient id="tail-body" x1="1" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#2b3244" />
          <stop offset="100%" stopColor="#06080d" />
        </linearGradient>
        <filter id="tail-glow" x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <rect width="400" height="300" fill="#04050a" />
      {/* Floor bounce */}
      <ellipse cx="200" cy="284" rx="210" ry="26" fill="#ff6b3d" opacity="0.10" filter="url(#tail-glow)" />
      {/* Tail unit, three-quarter rear */}
      <path d="M 60 96 L 300 60 L 356 128 L 330 216 L 96 244 L 44 168 Z" fill="url(#tail-body)" stroke="#2e3445" strokeWidth="1.5" />
      <path d="M 60 96 L 300 60 L 356 128 L 178 158 Z" fill="#10131d" opacity="0.8" />
      {/* Light bar */}
      <path d="M 92 178 L 318 148 L 326 178 L 100 210 Z" fill="#ff6b3d" opacity="0.95" />
      <path d="M 92 178 L 318 148 L 326 178 L 100 210 Z" fill="#ff6b3d" filter="url(#tail-glow)" opacity="0.8" />
      {/* Segmentation */}
      {Array.from({ length: 9 }, (_, i) => i).map((i) => (
        <rect key={i} x={104 + i * 25} y={152 + i * -1} width="6" height="52" fill="#04050a" opacity="0.5" transform={`rotate(-7.5 ${104 + i * 25} 178)`} />
      ))}
      {/* Volt spine catching the rim light */}
      <path d="M 60 96 L 300 60" stroke="#d4fb4f" strokeWidth="2.5" opacity="0.9" />
      <path d="M 60 96 L 300 60" stroke="#d4fb4f" strokeWidth="8" opacity="0.35" filter="url(#tail-glow)" />
    </svg>
  );
}
