"use client";

import type { MotionProps } from "motion/react";

export const EASE_ENTRY = [0.16, 1, 0.3, 1] as const;

/**
 * Scroll-reveal props, shared by every section.
 *
 * These reveals start at `opacity: 0`, so a visitor who has asked for reduced
 * motion must still end up seeing the content. That is handled by the
 * `[data-motion]` rule in globals.css rather than by branching on
 * `useReducedMotion()` here: the server cannot know the preference, so a
 * render-time branch would produce a hydration mismatch for exactly the
 * visitors who need it to work.
 */
export function reveal({
  y = 32,
  delay = 0,
  duration = 0.85,
  amount = 0.3,
}: {
  y?: number;
  delay?: number;
  duration?: number;
  amount?: number;
} = {}): MotionProps & { "data-motion": string } {
  return {
    "data-motion": "reveal",
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount },
    transition: { duration, delay, ease: EASE_ENTRY },
  };
}
