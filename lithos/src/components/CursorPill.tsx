import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";

/* px push style pointer: a small dot that trails the cursor, and a light
   label pill that swaps in over anything that declares `data-cursor`. */
export default function CursorPill() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const px = useSpring(x, { stiffness: 380, damping: 34, mass: 0.35 });
  const py = useSpring(y, { stiffness: 380, damping: 34, mass: 0.35 });
  const dotX = useSpring(x, { stiffness: 900, damping: 45, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 900, damping: 45, mass: 0.2 });

  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor]",
      );
      setLabel(el?.dataset.cursor ?? null);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] rounded-full bg-foreground"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: label ? 5 : 7,
          height: label ? 5 : 7,
          opacity: down ? 1 : 0.65,
          scale: down ? 0.6 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />

      <AnimatePresence>
        {label && (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[96]"
            style={{ x: px, y: py }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mono ml-4 mt-4 inline-flex items-center whitespace-nowrap rounded-full bg-foreground px-3.5 py-2 text-[10px] font-medium text-background">
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
