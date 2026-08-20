/**
 * ARC/1 — side-profile product shot.
 *
 * Drawn as vector rather than raster so it stays sharp at hero scale and so
 * individual assemblies (wheels, drive unit, lighting) can be animated and
 * accent-lit independently. Facing right.
 *
 * Geometry is scaled from the published dimensions so the silhouette reads as
 * a real motorcycle: 1,455 mm wheelbase = 570 units, 620 mm wheels, 810 mm
 * seat height. Ground plane sits at y=520, axles at y=400.
 */

const REAR = { cx: 300, cy: 400 };
const FRONT = { cx: 870, cy: 400 };
const TIRE_R = 120;
const RIM_R = 90;

function Wheel({ cx, cy }: { cx: number; cy: number }) {
  const spokes = [0, 60, 120, 180, 240, 300];

  return (
    <g>
      {/* Tire carcass */}
      <circle cx={cx} cy={cy} r={TIRE_R} fill="url(#tire)" />
      <circle cx={cx} cy={cy} r={TIRE_R} fill="none" stroke="var(--color-ink-500)" strokeWidth={1.5} />
      {/* Shoulder break between tread and sidewall */}
      <circle cx={cx} cy={cy} r={TIRE_R - 11} fill="none" stroke="#04050a" strokeWidth={5} opacity={0.9} />
      <circle cx={cx} cy={cy} r={RIM_R + 8} fill="none" stroke="var(--color-ink-600)" strokeWidth={1} />

      {/* Rotating assembly */}
      <g
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          animation: "voltarc-wheel 3.4s linear infinite",
        }}
      >
        <circle cx={cx} cy={cy} r={RIM_R} fill="url(#rim)" />
        <circle cx={cx} cy={cy} r={RIM_R} fill="none" stroke="var(--color-volt-500)" strokeWidth={1.75} opacity={0.6} />
        <circle cx={cx} cy={cy} r={RIM_R - 7} fill="#04050a" stroke="var(--color-ink-600)" strokeWidth={1} />

        <g transform={`translate(${cx} ${cy})`}>
          {spokes.map((angle) => (
            <path
              key={angle}
              d="M -7 -24 L 7 -24 L 14 -83 L -14 -83 Z"
              fill="url(#spoke)"
              stroke="var(--color-ink-600)"
              strokeWidth={0.75}
              transform={`rotate(${angle})`}
            />
          ))}
        </g>

        {/* Brake disc */}
        <circle cx={cx} cy={cy} r={58} fill="none" stroke="var(--color-ink-500)" strokeWidth={5} />
        <circle
          cx={cx}
          cy={cy}
          r={58}
          fill="none"
          stroke="var(--color-volt-400)"
          strokeWidth={1.25}
          strokeDasharray="9 15"
          opacity={0.75}
        />

        {/* Hub */}
        <circle cx={cx} cy={cy} r={23} fill="url(#hub)" stroke="var(--color-ink-400)" strokeWidth={1.5} />
        <circle cx={cx} cy={cy} r={6} fill="#04050a" />
      </g>
    </g>
  );
}

export function ArcOne({ className }: { className?: string }) {
  return (
    <svg
      viewBox="150 84 890 468"
      className={className}
      fill="none"
      role="img"
      aria-label="VOLTARC ARC/1 electric motorcycle, side profile"
    >
      <defs>
        <linearGradient id="tire" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#1c2130" />
          <stop offset="55%" stopColor="#0d1017" />
          <stop offset="100%" stopColor="#05070c" />
        </linearGradient>
        <linearGradient id="rim" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#2b3244" />
          <stop offset="60%" stopColor="#141824" />
          <stop offset="100%" stopColor="#0a0d14" />
        </linearGradient>
        <linearGradient id="spoke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3d4659" />
          <stop offset="100%" stopColor="#151a26" />
        </linearGradient>
        <radialGradient id="hub" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#4a5268" />
          <stop offset="100%" stopColor="#12161f" />
        </radialGradient>

        {/* Bodywork lit from above, falling into black underneath. */}
        <linearGradient id="body" x1="0.2" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#394257" />
          <stop offset="42%" stopColor="#1a1f2c" />
          <stop offset="100%" stopColor="#080a11" />
        </linearGradient>
        {/* Fork tubes sit against dark bodywork, so they need their own,
            brighter ramp to separate. */}
        <linearGradient id="fork" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5b6479" />
          <stop offset="55%" stopColor="#2a3143" />
          <stop offset="100%" stopColor="#12161f" />
        </linearGradient>
        <linearGradient id="bodyLow" x1="0.3" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#232a3a" />
          <stop offset="100%" stopColor="#06080d" />
        </linearGradient>
        <linearGradient id="tailGrad" x1="1" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#333c50" />
          <stop offset="100%" stopColor="#0a0d15" />
        </linearGradient>

        {/* Volt rim-light running along the top of the bodywork. */}
        <linearGradient id="rimlight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4fb4f" stopOpacity="0.1" />
          <stop offset="18%" stopColor="#d4fb4f" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#d4fb4f" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#d4fb4f" stopOpacity="0.2" />
        </linearGradient>

        <radialGradient id="lamp" cx="0.4" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#e6ff8a" />
          <stop offset="100%" stopColor="#b5ef14" />
        </radialGradient>

        <filter id="softGlow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="wideGlow" x="-130%" y="-130%" width="360%" height="360%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
      </defs>

      {/* ---- Ground ------------------------------------------------------ */}
      <ellipse cx={585} cy={518} rx={330} ry={18} fill="#000000" opacity={0.9} filter="url(#softGlow)" />
      <ellipse cx={585} cy={508} rx={230} ry={22} fill="var(--color-volt-500)" opacity={0.18} filter="url(#wideGlow)" />

      {/* ---- Rear suspension + swingarm (behind the bodywork) ------------ */}
      {/* Monoshock, deliberately left visible in the gap beneath the seat */}
      <path d="M 508 244 L 526 254 L 440 336 L 424 324 Z" fill="var(--color-ink-600)" />
      <path d="M 492 266 L 510 276 L 462 322 L 446 312 Z" fill="var(--color-ink-300)" opacity={0.5} />
      <circle cx={432} cy={330} r={9} fill="var(--color-ink-500)" />

      {/* Single-sided swingarm, pivot to rear axle */}
      <path
        d="M 536 310 L 558 340 L 312 410 L 288 400 L 288 382 L 520 312 Z"
        fill="url(#bodyLow)"
        stroke="var(--color-ink-600)"
        strokeWidth={1.5}
      />

      <Wheel {...REAR} />

      {/* ---- Front fork -------------------------------------------------- */}
      {/* 19° of rake, headstock at (782,148) down to the axle at (870,400). */}
      <path d="M 762 158 L 794 148 L 886 394 L 854 400 Z" fill="url(#fork)" stroke="var(--color-ink-300)" strokeWidth={1.5} />
      {/* Polished slider face — the fork has to catch light or it disappears */}
      <path d="M 774 190 L 790 186 L 872 396 L 856 398 Z" fill="var(--color-ink-200)" opacity={0.65} />
      {/* Triple clamp */}
      <path d="M 754 152 L 810 132 L 820 160 L 764 180 Z" fill="var(--color-ink-600)" stroke="var(--color-ink-500)" strokeWidth={1} />
      {/* Handlebar */}
      <path d="M 730 128 L 786 108 L 792 124 L 736 144 Z" fill="var(--color-ink-500)" />
      <circle cx={778} cy={114} r={7} fill="var(--color-ink-400)" />

      {/* Front brake caliper */}
      <path d="M 836 306 L 864 296 L 876 330 L 850 340 Z" fill="var(--color-ink-500)" stroke="var(--color-ink-400)" strokeWidth={1} />

      <Wheel {...FRONT} />

      {/* Front fender, hugging the tire */}
      <path
        d="M 776 300 Q 870 240 964 306 L 950 330 Q 868 276 792 330 Z"
        fill="url(#body)"
        stroke="var(--color-ink-600)"
        strokeWidth={1.25}
      />

      {/* ---- Drive unit -------------------------------------------------- */}
      <circle cx={534} cy={326} r={48} fill="url(#hub)" stroke="var(--color-ink-500)" strokeWidth={2} />
      <circle cx={534} cy={326} r={33} fill="none" stroke="var(--color-volt-500)" strokeWidth={1.5} opacity={0.55} />
      <circle cx={534} cy={326} r={14} fill="#04050a" />

      {/* Belt run from the drive unit to the rear hub */}
      <path d="M 512 294 L 292 370" stroke="var(--color-ink-500)" strokeWidth={4} />
      <path d="M 512 294 L 292 370" stroke="var(--color-volt-400)" strokeWidth={1} opacity={0.45} />

      {/* ---- Battery monocoque, slung below the tank -------------------- */}
      <path
        d="M 528 238
           L 600 232 L 690 226 L 762 214
           L 788 242 L 780 300 L 724 336 L 628 346 L 552 330
           L 520 286 Z"
        fill="url(#bodyLow)"
        stroke="var(--color-ink-500)"
        strokeWidth={1.5}
      />
      {/* Cell-stack vent louvres */}
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M ${576 + i * 38} 256 L ${598 + i * 38} 253 L ${594 + i * 38} 310 L ${572 + i * 38} 308 Z`}
          fill="#04050a"
          opacity={0.85}
        />
      ))}
      {/* Bright seam where the pack meets the tank — the value break that
          stops the two masses reading as one slab. */}
      <path d="M 528 238 L 762 216" stroke="var(--color-volt-400)" strokeWidth={1.75} opacity={0.45} />

      {/* ---- Upper body: tail, seat, tank ------------------------------- */}
      {/* Top line articulates tank -> seat dip -> tail kick; the underside
          pinches to a knife edge at the tail so it never reads as a plank. */}
      <path
        d="M 176 182 L 250 176 L 340 196 L 430 210 L 500 216
           L 540 196 L 610 168 L 690 150 L 748 146 L 782 168
           L 776 206 L 730 218 L 660 226 L 592 230 L 540 228
           L 516 236 L 470 238 L 400 232 L 320 222 L 230 202 L 190 190 Z"
        fill="url(#tailGrad)"
        stroke="var(--color-ink-500)"
        strokeWidth={1.5}
      />

      {/* Tank shoulder — lighter, so the front mass separates from the tail */}
      <path
        d="M 540 196 L 610 168 L 690 150 L 748 146 L 782 168 L 776 200 L 700 206 L 610 210 L 548 214 Z"
        fill="url(#body)"
      />
      {/* Seam between tank and seat */}
      <path d="M 540 196 L 534 228" stroke="#04050a" strokeWidth={2.5} opacity={0.75} />

      {/* Seat pad */}
      <path
        d="M 300 186 L 400 202 L 470 210 L 512 202 L 502 190 L 396 186 L 302 174 Z"
        fill="#0a0d14"
        stroke="var(--color-ink-600)"
        strokeWidth={1}
      />

      {/* Volt rim-light along the top edge — the signature detail */}
      <path d="M 176 182 L 250 176 L 340 196 L 430 210 L 500 216 L 540 196 L 610 168 L 690 150 L 748 146 L 782 168" stroke="url(#rimlight)" strokeWidth={2.5} strokeLinecap="round" />
      <path
        d="M 176 182 L 250 176 L 340 196 L 430 210 L 500 216 L 540 196 L 610 168 L 690 150 L 748 146 L 782 168"
        stroke="url(#rimlight)"
        strokeWidth={7}
        strokeLinecap="round"
        opacity={0.3}
        filter="url(#softGlow)"
      />

      {/* Tail light */}
      <path d="M 178 181 L 194 179 L 200 196 L 182 192 Z" fill="var(--color-ember-500)" />
      <path d="M 178 181 L 194 179 L 200 196 L 182 192 Z" fill="var(--color-ember-500)" filter="url(#softGlow)" opacity={0.85} />

      {/* Rider peg */}
      <path d="M 566 340 L 604 344 L 602 354 L 564 350 Z" fill="var(--color-ink-500)" />

      {/* ---- Front cowl + headlight -------------------------------------- */}
      <path
        d="M 770 150 L 812 128 L 852 150 L 862 186 L 832 212 L 788 206 L 766 178 Z"
        fill="url(#body)"
        stroke="var(--color-ink-500)"
        strokeWidth={1.5}
      />
      {/* Bezel recess */}
      <path d="M 808 142 L 850 164 L 856 190 L 826 204 L 804 174 Z" fill="#04050a" />
      {/* Lens */}
      <path d="M 816 152 L 843 168 L 847 187 L 826 196 L 813 173 Z" fill="url(#lamp)" />
      <path
        d="M 816 152 L 843 168 L 847 187 L 826 196 L 813 173 Z"
        fill="var(--color-volt-400)"
        filter="url(#softGlow)"
        opacity={0.55}
      />
      {/* Daytime running blade */}
      <path d="M 792 204 L 838 208 L 836 218 L 794 214 Z" fill="var(--color-plasma-500)" opacity={0.85} />

      {/* Headlight throw, leaving the frame */}
      <path
        d="M 856 156 L 1080 92 L 1080 300 L 850 206 Z"
        fill="var(--color-volt-400)"
        opacity={0.08}
        filter="url(#wideGlow)"
        style={{ animation: "voltarc-beam 5s var(--ease-inout) infinite" }}
      />
    </svg>
  );
}
