"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { EASE_ENTRY, reveal } from "./reveal";

const HEADLINE_METRICS = [
  { value: 214, decimals: 0, unit: "hp", label: "Peak output", sub: "160 kW" },
  { value: 402, decimals: 0, unit: "N·m", label: "Torque", sub: "At the wheel, from 0 rpm" },
  { value: 2.6, decimals: 1, unit: "s", label: "0–100 km/h", sub: "Launch mode, one-up" },
  { value: 340, decimals: 0, unit: "km", label: "Range", sub: "WMTC combined" },
];

const SPEC_GROUPS = [
  {
    title: "Drivetrain",
    rows: [
      ["Motor", "Axial-flux permanent magnet, oil-cooled"],
      ["Peak output", "214 hp / 160 kW"],
      ["Peak torque", "402 N·m at the wheel"],
      ["Transmission", "Single-speed, carbon-reinforced belt"],
      ["Top speed", "258 km/h (electronically limited)"],
      ["Ride modes", "Rain · Road · Sport · Track · Custom"],
    ],
  },
  {
    title: "Battery & charging",
    rows: [
      ["Usable capacity", "21.4 kWh"],
      ["Cells", "NMC 811, 4680 cylindrical"],
      ["DC fast charge", "10–80% in 12 min at 150 kW"],
      ["AC onboard", "11 kW · 0–100% in 2 h 20 min"],
      ["Thermal system", "Immersion-cooled, pre-conditioning"],
      ["Warranty", "8 years / 160,000 km"],
    ],
  },
  {
    title: "Chassis",
    rows: [
      ["Frame", "Carbon monocoque, pack as stressed member"],
      ["Front", "43 mm inverted fork, fully adjustable"],
      ["Rear", "Single-sided swingarm, semi-active monoshock"],
      ["Brakes", "Twin 330 mm front · regen to 0.4 g"],
      ["Wheels", "Forged aluminium, 17 in"],
      ["Tyres", "120/70 ZR17 · 200/55 ZR17"],
    ],
  },
  {
    title: "Dimensions",
    rows: [
      ["Kerb weight", "218 kg"],
      ["Wheelbase", "1,455 mm"],
      ["Seat height", "810 mm"],
      ["Rake / trail", "24.0° / 98 mm"],
      ["Ground clearance", "135 mm"],
      ["Load capacity", "180 kg"],
    ],
  },
] as const;

/** A metric that counts up to its value the first time it scrolls into view. */
function Metric({
  value,
  decimals,
  unit,
  label,
  sub,
}: {
  value: number;
  decimals: number;
  unit: string;
  label: string;
  sub: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  const count = useMotionValue(0);
  const display = useTransform(count, (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );

  useEffect(() => {
    if (!inView) return;
    // Reading the preference here (rather than during render) keeps SSR and
    // hydration in agreement — effects only ever run on the client.
    if (reduced) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, {
      duration: 1.6,
      ease: EASE_ENTRY,
    });
    return () => controls.stop();
  }, [inView, reduced, count, value]);

  return (
    <div ref={ref} className="px-gutter py-8 sm:py-10">
      <div className="flex items-baseline gap-1.5">
        <motion.span className="font-display font-semibold tabular-nums text-metric text-gradient-volt">
          {display}
        </motion.span>
        <span className="font-display text-xl font-medium text-content-subtle sm:text-2xl">
          {unit}
        </span>
      </div>
      <div className="mt-4 h-px w-full bg-hairline-soft">
        <motion.div
          className="h-px bg-volt-400"
          data-motion="metric-bar"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          style={{ transformOrigin: "left" }}
          transition={{ duration: 1.2, ease: EASE_ENTRY }}
        />
      </div>
      <p className="mt-3 text-sm font-medium text-content">{label}</p>
      <p className="mt-1 text-xs text-content-faint">{sub}</p>
    </div>
  );
}

export function Specs() {
  return (
    <section id="specs" className="relative scroll-mt-24 py-section">
      <div className="shell">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-volt-400" />
          <span className="eyebrow text-volt-400">02 — Specification</span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <motion.h2
            {...reveal({ y: 28, duration: 0.9, amount: 0.6 })}
            className="font-display font-bold uppercase text-display-lg text-content"
          >
            Every number,
            <br />
            <span className="text-content-subtle">measured not marketed.</span>
          </motion.h2>

          <motion.p
            {...reveal({ y: 20, delay: 0.1, duration: 0.9, amount: 0.6 })}
            className="max-w-md text-base leading-relaxed text-content-muted lg:pb-2"
          >
            Figures are homologated results from an independent test house at
            20 °C, one-up, on a fully charged pack — not simulated peaks. Range
            is WMTC combined; your right wrist will have opinions.
          </motion.p>
        </div>
      </div>

      {/* Headline metrics */}
      <div className="mt-16 border-y border-hairline-soft">
        <div className="shell !px-0">
          <div className="grid grid-cols-1 divide-y divide-hairline-soft sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
            {HEADLINE_METRICS.map((m) => (
              <Metric key={m.label} {...m} />
            ))}
          </div>
        </div>
      </div>

      {/* Full spec sheet */}
      <div className="shell mt-20">
        <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
          {SPEC_GROUPS.map((group, gi) => (
            <motion.div
              key={group.title}
              {...reveal({ y: 32, delay: (gi % 2) * 0.1, duration: 0.8, amount: 0.25 })}
            >
              <h3 className="eyebrow text-content-subtle">{group.title}</h3>
              <dl className="mt-5">
                {group.rows.map(([term, def]) => (
                  <div
                    key={term}
                    className="group grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 border-t border-hairline-soft py-3.5 transition-colors duration-[--duration-fast] last:border-b hover:border-volt-400/40"
                  >
                    <dt className="text-sm text-content-faint transition-colors duration-[--duration-fast] group-hover:text-volt-400">
                      {term}
                    </dt>
                    <dd className="font-mono text-sm text-content-muted">
                      {def}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
