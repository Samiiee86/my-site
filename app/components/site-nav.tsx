"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

const LINKS = [
  { href: "#specs", label: "Specification" },
  { href: "#gallery", label: "Gallery" },
  { href: "#reserve", label: "Reserve" },
];

export function SiteNav() {
  const { scrollY } = useScroll();
  const [lifted, setLifted] = useState(false);

  // Swap the bar from transparent to a frosted panel once the hero copy
  // starts sliding underneath it.
  useMotionValueEvent(scrollY, "change", (y) => {
    setLifted(y > 24);
  });

  return (
    <motion.header
      data-motion="nav"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-[--duration-base] ${
        lifted
          ? "border-b border-hairline-soft bg-canvas/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="shell flex h-16 items-center justify-between sm:h-20">
        <a
          href="#top"
          className="group flex items-center gap-2.5"
          aria-label="VOLTARC home"
        >
          {/* Mark: an arc gap in a ring, echoing the brand name */}
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="var(--color-volt-400)"
              strokeWidth="2"
              strokeDasharray="42 15"
              strokeLinecap="round"
              className="origin-center transition-transform duration-500 ease-[--ease-entry] group-hover:rotate-[140deg]"
            />
            <circle cx="12" cy="12" r="2.5" fill="var(--color-volt-400)" />
          </svg>
          <span className="font-display text-xl font-bold uppercase tracking-[0.18em] text-content">
            Voltarc
          </span>
        </a>

        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-sm text-content-muted transition-colors duration-[--duration-fast] hover:text-content after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-volt-400 after:transition-[width] after:duration-[--duration-base] after:ease-[--ease-entry] hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#reserve"
          className="rounded-full border border-volt-400/40 bg-volt-400/10 px-5 py-2 text-sm font-semibold text-volt-400 transition-colors duration-[--duration-fast] hover:bg-volt-400 hover:text-ink-950"
        >
          Reserve
        </a>
      </nav>
    </motion.header>
  );
}
