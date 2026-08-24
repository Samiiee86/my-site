import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { platform } from "../lib/content";
import { getLenis } from "../hooks/useSmoothScroll";
import { nextStop } from "../lib/step";
import { Reveal } from "../lib/ui";

/* Four steps, four boxes.
   The section pins and one scroll gesture moves one box. An arrow walks the
   spine above them, drawing its connector as it goes, and the box it lands on
   lifts off the page — white, raised, its rule filled in. Boxes it has already
   passed keep their filled rule, so the row reads as progress rather than a
   spotlight. Nothing is ever hidden or dimmed: every product stays legible at
   any scroll position, because the left-to-right order is how teams think
   about testing, not a path anyone is forced to walk. */

const N = platform.stages.length;
const GAP = 24; /* matches the gap-x-6 on the box grid */

/* which box is active, as a fraction of the pinned scroll */
const BREAKS = [0.2, 0.5, 0.8];

/* a box's rule fills when the arrow actually reaches it */
const LIT = [0.35, 0.65, 0.95];

/* where a single scroll gesture parks you: the middle of each band, evenly
   spaced, so a step can never land on a boundary and flicker */
const STOPS = [0.05, 0.35, 0.65, 0.95];

/* one gesture = one box; trackpad momentum inside this window is swallowed */
const STEP_LOCK = 900;

const EASE = [0.16, 1, 0.3, 1] as const;
const SETTLE = { duration: 0.55, ease: EASE };

/* While the row is on screen a scroll advances it by exactly one box instead
   of flinging past three. Scrolling up at the first box or down at the last is
   handed straight back to the page — that check runs before the momentum lock,
   so a quick double-flick can always leave and the section is never a trap. */
function useStageStepper(sectionRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    let lockUntil = 0;

    const onWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const top = section.getBoundingClientRect().top + window.scrollY;
      const travel = section.offsetHeight - window.innerHeight;
      if (travel <= 0) return;

      const p = (window.scrollY - top) / travel;
      const target = nextStop(p, e.deltaY > 0 ? 1 : -1, BREAKS, N);
      if (target === null) return;

      e.preventDefault();
      if (performance.now() < lockUntil) return;
      lockUntil = performance.now() + STEP_LOCK;

      const to = top + STOPS[target] * travel;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(to, { duration: 0.8, lock: true });
      else window.scrollTo({ top: to, behavior: "smooth" });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [sectionRef]);
}

function Box({
  stage,
  index,
  active,
  lit,
}: {
  stage: (typeof platform.stages)[number];
  index: number;
  active: boolean;
  lit: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={{
        y: active ? -6 : 0,
        backgroundColor: active
          ? "hsl(var(--surface))"
          : "hsla(var(--surface) / 0)",
        borderColor: active
          ? "hsl(var(--border))"
          : "hsl(var(--border-muted) / 0.85)",
        boxShadow: active
          ? "0 12px 28px -18px hsl(var(--foreground) / 0.28)"
          : "0 0px 0px 0px hsl(var(--foreground) / 0)",
      }}
      transition={SETTLE}
      className="flex h-full flex-col border p-5"
    >
      <div className="flex items-baseline gap-2.5">
        <motion.span
          initial={false}
          animate={{
            color: lit ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))",
          }}
          transition={SETTLE}
          className="mono text-[11px] tracking-[0.18em]"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
        <h3 className="text-[18px] leading-tight tracking-tight">
          {stage.key.charAt(0) + stage.key.slice(1).toLowerCase()}
        </h3>
      </div>

      {/* the rule fills as the arrow arrives, and stays filled behind it */}
      <div className="mt-2.5 h-[2px] w-full bg-border-muted">
        <motion.span
          initial={false}
          animate={{ scaleX: lit ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="block h-full origin-left bg-accent"
        />
      </div>

      {/* the products you actually buy: marked and weighted */}
      <ul className="mb-4 mt-3.5 flex flex-col gap-2">
        {stage.products.map((item, i) => (
          <motion.li
            key={item.name}
            initial={false}
            /* a keyframe array replays every time the box becomes active, so
               the contents lift with it — without ever dropping below full
               opacity, which is what made earlier versions unreadable */
            animate={active ? { y: [7, 0] } : { y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.45, ease: EASE }}
            className="flex gap-2"
          >
            <span
              aria-hidden
              className="mt-[7px] h-[5px] w-[5px] shrink-0 rotate-45 bg-accent"
            />
            <div>
              <p className="text-[13.5px] leading-snug text-foreground">
                {item.name}
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
                {item.desc}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* what those products include: a tier down, and bottom-aligned so the
          four rules read as one line across the row */}
      <p className="mono mt-auto border-t border-border-muted pt-2 text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
        Also includes
      </p>
      {/* reserve three lines so a box whose features wrap further does not
          drag its rule out of line with the other three */}
      <p className="mt-1.5 min-h-[57px] text-[12px] leading-[1.55] text-muted-foreground">
        {stage.features.join(" · ")}
      </p>
    </motion.div>
  );
}

export default function Flow() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  useStageStepper(sectionRef);

  /* The arrow and its connector are positioned in real pixels off the measured
     row, so they land dead centre on each box at any width rather than
     approximating with percentages. The ref goes on the wrapper, which is
     always displayed — measuring the spine itself would read 0 whenever it is
     still `display:none`, leaving the arrow to wait on an observer frame. */
  const [railW, setRailW] = useState(0);
  useLayoutEffect(() => {
    const el = railRef.current;
    if (!el) return;
    /* measure straight away — waiting on the observer's first callback would
       paint an empty rail for a frame */
    setRailW(el.offsetWidth);
    const ro = new ResizeObserver(([entry]) =>
      setRailW(entry.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const colW = railW ? (railW - GAP * (N - 1)) / N : 0;
  const centres = Array.from(
    { length: N },
    (_, i) => i * (colW + GAP) + colW / 2,
  );

  /* Measure the tall outer section, NOT the sticky child. A pinned element's
     rect never moves, so reading progress off it saturates to 1 the moment it
     sticks. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const [stage, setStage] = useState(0);
  const [reached, setReached] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = BREAKS.filter((b) => v >= b).length;
    setStage((prev) => (next === prev ? prev : next));
    const arrived = LIT.filter((b) => v >= b).length;
    setReached((prev) => (arrived > prev ? arrived : prev));
  });

  /* one motion value drives the arrow and the connector it draws */
  const travelX = useTransform(scrollYProgress, STOPS, centres);
  const drawnW = useTransform(travelX, (x) => Math.max(0, x - centres[0]));

  return (
    <section
      ref={sectionRef}
      className="relative z-[1] border-t border-border-muted lg:h-[400vh]"
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center">
        <div className="mx-auto w-full max-w-[1240px] px-5 py-20 sm:px-8 lg:py-16">
          <div className="px-4 sm:px-8">
            <Reveal className="mb-8">
              <div className="grid gap-5 lg:grid-cols-[1.35fr_0.95fr] lg:items-end lg:gap-14">
                <h2 className="text-[32px] leading-[1.12] tracking-tight md:text-[35px]">
                  <span className="block text-muted-foreground">
                    One platform,
                  </span>
                  <span className="block">every stage of testing</span>
                </h2>
                <p className="max-w-[460px] text-[15px] leading-relaxed text-muted-foreground">
                  Most teams read this left to right — you don&rsquo;t have to.
                  Test Manager can hand its cases straight to HyperExecute, and
                  KaneAI can author against a suite you already have. Join at
                  whichever step your team is on.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div ref={railRef}>
                {/* the spine: dashes march ahead of the arrow, a solid line is
                  drawn behind it, so the connector is never broken */}
                <div className="relative mb-5 hidden h-3 lg:block">
                  {railW > 0 && (
                    <>
                      <span
                        className="dash-march absolute top-[5px] h-px"
                        style={{
                          left: centres[0],
                          width: centres[N - 1] - centres[0],
                        }}
                      />
                      <motion.span
                        style={{ left: centres[0], width: drawnW }}
                        className="absolute top-[5px] h-px bg-foreground"
                      />
                      {centres.map((c, i) => (
                        <span
                          key={platform.stages[i].key}
                          style={{ left: c }}
                          className="absolute top-[1px] -ml-[4.5px] flex h-[9px] w-[9px] items-center justify-center rounded-full border border-border bg-background"
                        >
                          <motion.span
                            initial={false}
                            animate={{ scale: i <= reached ? 1 : 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="block h-[5px] w-[5px] rounded-full bg-foreground"
                          />
                        </span>
                      ))}
                      <motion.span
                        style={{ x: travelX }}
                        className="absolute left-0 top-0 -ml-[7px] block bg-background px-[3px] py-[1px] text-accent"
                      >
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 9 9"
                          aria-hidden
                          className="block"
                        >
                          <path
                            d="M1.5 0.8 L8 4.5 L1.5 8.2 Z"
                            fill="currentColor"
                          />
                        </svg>
                      </motion.span>
                    </>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {platform.stages.map((s, i) => (
                    <Box
                      key={s.key}
                      stage={s}
                      index={i}
                      active={i === stage}
                      lit={i <= reached}
                    />
                  ))}
                </div>

                <div className="mt-6 border-t border-border-muted pt-4">
                  <p className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {platform.deployment.label}:{" "}
                    <span className="text-foreground">
                      {platform.deployment.options.join(" · ")}
                    </span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
