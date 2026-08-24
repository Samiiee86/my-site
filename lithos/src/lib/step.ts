/* Which stage a single scroll gesture should step to.
   Pure so it can be reasoned about — and tested — without a DOM.

   `p` is progress through the pinned section: 0 at the first stage, 1 at the
   last. `dir` is +1 scrolling down, -1 up. Returns the stage index to step to,
   or null to hand the gesture back to the page. Handing it back matters more
   than stepping: it is what stops the section becoming a trap. */
export function nextStop(
  p: number,
  dir: 1 | -1,
  breaks: number[],
  count: number,
): number | null {
  if (p < -0.12 || p > 1.12) return null;

  /* just outside: catch the section at the nearest end, or let it go */
  if (p < 0) return dir < 0 ? null : 0;
  if (p > 1) return dir > 0 ? null : count - 1;

  const target = breaks.filter((b) => p >= b).length + dir;
  if (target < 0 || target >= count) return null;
  return target;
}
