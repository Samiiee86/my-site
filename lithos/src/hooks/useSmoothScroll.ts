import { useEffect } from "react";
import Lenis from "lenis";

/* Inertial scrolling — the weighted, slightly-delayed feel that carries the
   parallax on sites like Monolith and Pear. */

let instance: Lenis | null = null;

/* Sections that drive their own scroll (the pinned pipeline) need to steer
   Lenis rather than fight it. Returns null when smooth scroll is off, which
   is the signal to fall back to plain native scrolling. */
export function getLenis() {
  return instance;
}

export default function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    });
    instance = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      instance = null;
    };
  }, []);
}
