"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EASE_ENTRY, reveal } from "./reveal";
import {
  PlateHeadlight,
  PlateCells,
  PlateBelt,
  PlateCockpit,
  PlateCaliper,
  PlateTail,
} from "./gallery-plates";

type Shot = {
  id: string;
  index: string;
  title: string;
  caption: string;
  Plate: ComponentType<{ className?: string }>;
  /**
   * Column span (out of 12) and row height at the lg breakpoint. Heights are
   * set per row rather than per tile so that tiles sharing a row line up —
   * an aspect ratio would make each tile a different height and read as a
   * layout bug rather than as an editorial grid.
   */
  span: string;
  aspect: string;
};

const SHOTS: Shot[] = [
  {
    id: "headlight",
    index: "01",
    title: "Adaptive light array",
    caption:
      "Sixteen individually addressable LEDs behind a single moulded lens. The cyan blade below is the daytime signature — it is the only part of the ARC/1 you will see coming.",
    Plate: PlateHeadlight,
    span: "lg:col-span-7 lg:h-[32rem] lg:aspect-auto",
    aspect: "aspect-[4/3]",
  },
  {
    id: "cells",
    index: "02",
    title: "Immersion-cooled cell stack",
    caption:
      "480 cylindrical cells in a carbon tray, welded by laser to solid bus bars and flooded with dielectric coolant. The pack is the frame.",
    Plate: PlateCells,
    span: "lg:col-span-5 lg:h-[32rem] lg:aspect-auto",
    aspect: "aspect-[4/3]",
  },
  {
    id: "belt",
    index: "03",
    title: "Single-speed belt drive",
    caption:
      "No gearbox, no clutch, no chain to oil. One carbon-reinforced belt turning a forged pulley — sealed for the life of the motorcycle.",
    Plate: PlateBelt,
    span: "lg:col-span-5 lg:h-[26rem] lg:aspect-auto",
    aspect: "aspect-[4/3]",
  },
  {
    id: "cockpit",
    index: "04",
    title: "Cockpit",
    caption:
      "A single 7-inch bonded display, tilted 5° toward the rider and readable in direct sun. Nothing on it moves unless it needs your attention.",
    Plate: PlateCockpit,
    span: "lg:col-span-7 lg:h-[26rem] lg:aspect-auto",
    aspect: "aspect-[4/3]",
  },
  {
    id: "caliper",
    index: "05",
    title: "Front caliper & disc",
    caption:
      "Twin 330 mm discs with radial four-piston calipers. Regeneration handles the first 0.4 g, so the pads stay cold until you genuinely need them.",
    Plate: PlateCaliper,
    span: "lg:col-span-6 lg:h-[24rem] lg:aspect-auto",
    aspect: "aspect-[4/3]",
  },
  {
    id: "tail",
    index: "06",
    title: "Tail section",
    caption:
      "The rear subframe carries the light bar and nothing else. Every gram behind the rear axle was argued over.",
    Plate: PlateTail,
    span: "lg:col-span-6 lg:h-[24rem] lg:aspect-auto",
    aspect: "aspect-[4/3]",
  },
];

export function Gallery() {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = SHOTS.find((s) => s.id === openId) ?? null;

  const close = useCallback(() => setOpenId(null), []);

  // Escape to dismiss, and lock body scroll while the lightbox is up.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close]);

  return (
    <section
      id="gallery"
      className="relative scroll-mt-24 overflow-hidden py-section"
    >
      {/* Faint grid so the gallery reads as a technical plate sheet */}
      <div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          maskImage:
            "radial-gradient(100% 60% at 50% 0%, #000 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(100% 60% at 50% 0%, #000 0%, transparent 70%)",
        }}
      />

      <div className="shell">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-volt-400" />
          <span className="eyebrow text-volt-400">03 — Gallery</span>
        </div>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.h2
            {...reveal({ y: 28, duration: 0.9, amount: 0.6 })}
            className="font-display font-bold uppercase text-display-lg text-content"
          >
            Details
            <br />
            <span className="text-content-subtle">worth the walk around.</span>
          </motion.h2>
          <p className="max-w-sm text-sm leading-relaxed text-content-muted">
            Six studio plates from the pre-production ARC/1, shot at the
            Rotterdam facility. Select any plate to open it.
          </p>
        </div>

        {/* Plate grid */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {SHOTS.map((shot, i) => (
            <motion.button
              key={shot.id}
              type="button"
              onClick={() => setOpenId(shot.id)}
              {...reveal({ y: 40, delay: (i % 3) * 0.08, amount: 0.2 })}
              className={`group relative block overflow-hidden rounded-lg border border-hairline-soft bg-surface text-left transition-colors duration-[--duration-base] hover:border-volt-400/50 ${shot.span} ${shot.aspect} sm:col-span-1`}
              aria-label={`Open plate ${shot.index}: ${shot.title}`}
            >
              <shot.Plate className="absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-[--ease-entry] group-hover:scale-[1.06]" />

              {/* Legibility scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/25 to-transparent opacity-90 transition-opacity duration-[--duration-base] group-hover:opacity-70" />

              {/* Caption plate */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <div>
                  <span className="eyebrow text-volt-400">{shot.index}</span>
                  <h3 className="mt-2 font-display text-xl font-semibold uppercase tracking-tight text-content sm:text-2xl">
                    {shot.title}
                  </h3>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline text-content-subtle transition-all duration-[--duration-base] ease-[--ease-entry] group-hover:border-volt-400 group-hover:bg-volt-400 group-hover:text-ink-950">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                    <path
                      d="M2 8h12M9 3l5 5-5 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ---------- Lightbox ------------------------------------------- */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            onClick={close}
          >
            <div className="absolute inset-0 bg-canvas/92 backdrop-blur-xl" />

            <motion.figure
              className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-hairline bg-surface shadow-[--shadow-lift]"
              data-motion="lightbox"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.45, ease: EASE_ENTRY }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] w-full">
                <active.Plate className="absolute inset-0 h-full w-full" />
              </div>

              <figcaption className="flex flex-col gap-3 border-t border-hairline-soft p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8">
                <span className="eyebrow shrink-0 text-volt-400 sm:pt-1.5">
                  {active.index}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold uppercase tracking-tight text-content">
                    {active.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-content-muted">
                    {active.caption}
                  </p>
                </div>
              </figcaption>

              <button
                type="button"
                onClick={close}
                autoFocus
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-canvas/70 text-content-muted backdrop-blur transition-colors duration-[--duration-fast] hover:border-volt-400 hover:text-volt-400"
                aria-label="Close plate"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
