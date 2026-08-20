"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { ArcOne } from "./arc-one";

const EASE_ENTRY = [0.16, 1, 0.3, 1] as const;

/* Headline lines rise out of a clipping mask, staggered. */
const lineWrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const line: Variants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 1.05, ease: EASE_ENTRY },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_ENTRY } },
};

const HERO_STATS = [
  { label: "0–100 km/h", value: "2.6s" },
  { label: "Range", value: "340 km" },
  { label: "10–80% charge", value: "12 min" },
  { label: "Peak output", value: "214 hp" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // The bike drifts up and shrinks slightly as the page scrolls away —
  // enough to feel like depth, not enough to read as a gimmick.
  const bikeY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const bikeScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-svh flex-col overflow-hidden pt-24 sm:pt-28"
    >
      {/* ---------- Backdrop ------------------------------------------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Engineering grid, masked so it dissolves toward the edges */}
        <div
          className="grid-field absolute inset-0 opacity-[0.55]"
          style={{
            maskImage:
              "radial-gradient(115% 78% at 50% 42%, #000 12%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(115% 78% at 50% 42%, #000 12%, transparent 72%)",
          }}
        />

        {/* Volt bloom behind the machine */}
        <motion.div
          data-motion="bloom"
          className="absolute left-1/2 top-[52%] h-[46rem] w-[68rem] max-w-[130vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgb(181 239 20 / 0.20), rgb(181 239 20 / 0.05) 55%, transparent 78%)",
          }}
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Cold counter-light from the upper left */}
        <div
          className="absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgb(34 207 255 / 0.10), transparent 70%)",
          }}
        />

        {/* Horizon: the surface the bike sits on */}
        <div className="absolute inset-x-0 top-[74%] h-px bg-gradient-to-r from-transparent via-ink-500 to-transparent" />
        <div className="absolute inset-x-0 top-[74%] h-64 bg-gradient-to-b from-transparent to-canvas" />
      </div>

      {/* ---------- Copy + product shot ---------------------------------
           On large screens the machine is absolutely positioned so it can
           bleed past the right edge of the shell; below that it drops into
           normal flow beneath the copy. The positioning element never carries
           a transform, so it can't fight the scroll-driven ones below. */}
      <div className="shell relative z-10 flex flex-1 flex-col justify-center pb-10 lg:pb-0">
        <motion.div
          data-motion="hero-copy"
          className="relative z-10 max-w-2xl lg:max-w-[47%]"
          style={{ y: copyY, opacity: copyOpacity }}
        >
          <motion.div initial="hidden" animate="show" variants={lineWrap}>
            <motion.div
              data-motion="eyebrow"
              variants={fadeUp}
              className="flex items-center gap-3"
            >
              <span className="h-px w-10 bg-volt-400" />
              <span className="eyebrow text-volt-400">ARC/1 · First Edition</span>
            </motion.div>

            <h1 className="mt-6 font-display font-bold uppercase text-display-xl">
              {["No engine.", "No warning."].map((text, i) => (
                <span key={text} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    data-motion="headline"
                    variants={line}
                    className={i === 1 ? "block text-gradient-volt" : "block text-content"}
                  >
                    {text}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              data-motion="lede"
              variants={fadeUp}
              className="mt-7 max-w-lg text-base leading-relaxed text-content-muted"
            >
              214 horsepower, delivered the instant you ask for it. The ARC/1
              replaces the engine with one sealed drive unit — and replaces
              everything you expect a motorcycle to sound like.
            </motion.p>

            <motion.div
              data-motion="cta"
              variants={fadeUp}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <a
                href="#reserve"
                className="group relative overflow-hidden rounded-full bg-volt-400 px-7 py-3.5 text-sm font-semibold tracking-tight text-ink-950 transition-transform duration-[--duration-fast] ease-[--ease-entry] hover:scale-[1.03] active:scale-[0.99]"
              >
                <span className="relative z-10">Reserve — $500 deposit</span>
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-1/3 z-0 w-1/3 skew-x-[-20deg] bg-white/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:[animation:voltarc-sweep_900ms_ease-out]"
                />
              </a>
              <a
                href="#specs"
                className="rounded-full border border-hairline px-7 py-3.5 text-sm font-semibold tracking-tight text-content transition-colors duration-[--duration-fast] hover:border-volt-400 hover:text-volt-400"
              >
                Full specification
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Product shot */}
        <div className="pointer-events-none mt-10 lg:absolute lg:inset-y-0 lg:left-[36%] lg:-right-2 lg:mt-0 lg:flex lg:items-center">
          <motion.div
            data-motion="product-shot"
            className="w-full"
            style={{ y: bikeY, scale: bikeScale }}
            initial={{ opacity: 0, x: 80, scale: 1.05 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE_ENTRY, delay: 0.15 }}
          >
            <ArcOne className="w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.85)]" />
          </motion.div>
        </div>
      </div>

      {/* ---------- Stat strip ------------------------------------------ */}
      <motion.div
        data-motion="stat-strip"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8, ease: EASE_ENTRY }}
        className="relative z-10 border-t border-hairline-soft bg-canvas/70 backdrop-blur-sm"
      >
        <dl className="shell grid grid-cols-2 divide-x divide-hairline-soft sm:grid-cols-4">
          {HERO_STATS.map((stat) => (
            <div
              key={stat.label}
              className="px-4 py-5 first:pl-0 sm:py-6 [&:nth-child(3)]:border-t [&:nth-child(3)]:border-hairline-soft [&:nth-child(4)]:border-t [&:nth-child(4)]:border-hairline-soft sm:[&:nth-child(n)]:border-t-0"
            >
              <dt className="eyebrow">{stat.label}</dt>
              <dd className="mt-2 font-display text-3xl font-semibold tracking-tight text-content sm:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
