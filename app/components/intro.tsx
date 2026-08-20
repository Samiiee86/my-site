"use client";

import { motion } from "motion/react";
import { reveal } from "./reveal";

const TICKER = [
  "Silent",
  "Instant",
  "Relentless",
  "Zero maintenance",
  "Built in Rotterdam",
  "214 hp",
];

const PILLARS = [
  {
    n: "01",
    title: "Torque from zero",
    body: "There is no powerband to find and no gear to be in. All 402 N·m is available from a standstill, which is why the ARC/1 leaves a litre superbike behind for the first hundred metres and does it without a sound.",
  },
  {
    n: "02",
    title: "Nothing to service",
    body: "No oil, no filters, no valve clearances, no chain to adjust. The drive unit is sealed for life and the belt is rated to 100,000 km. Your first scheduled visit is tyres.",
  },
  {
    n: "03",
    title: "Quiet enough to hear the road",
    body: "Without an engine between your knees you hear the tyres load up, the suspension work, and the wind change over a crest. Riders describe it as getting a sense back.",
  },
];

export function Intro() {
  return (
    <section id="machine" className="relative scroll-mt-24">
      {/* ---------- Ticker ---------------------------------------------- */}
      <div className="relative flex overflow-hidden border-b border-hairline-soft bg-surface/40 py-5">
        <div
          className="flex w-max shrink-0 items-center gap-10 pr-10"
          style={{ animation: "voltarc-marquee 38s linear infinite" }}
        >
          {/* Two copies: the track translates by exactly -50% to loop. */}
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-10" aria-hidden={copy === 1}>
              {TICKER.map((word) => (
                <span key={word} className="flex items-center gap-10">
                  <span className="font-display text-2xl font-medium uppercase tracking-[0.14em] text-content-subtle whitespace-nowrap sm:text-3xl">
                    {word}
                  </span>
                  <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-volt-400" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Pillars --------------------------------------------- */}
      <div className="shell py-section">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-volt-400" />
          <span className="eyebrow text-volt-400">01 — The machine</span>
        </div>

        <motion.h2
          {...reveal({ y: 28, duration: 0.9, amount: 0.5 })}
          className="mt-8 max-w-4xl font-display font-bold uppercase text-display-md text-content"
        >
          <span className="block">We did not electrify a motorcycle.</span>
          <span className="block text-content-subtle">
            We started from the pack and built outward.
          </span>
        </motion.h2>

        <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <motion.article
              key={p.n}
              {...reveal({ y: 36, delay: i * 0.1, amount: 0.4 })}
              className="border-t border-hairline pt-6"
            >
              <span className="eyebrow text-volt-400">{p.n}</span>
              <h3 className="mt-4 font-display text-2xl font-semibold uppercase tracking-tight text-content">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-content-muted">
                {p.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
