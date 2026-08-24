import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-[120] h-[2px] w-full origin-left bg-gradient-to-r from-[#e8702a] via-[#f0a86a] to-[#e8702a]"
      style={{ scaleX: width }}
    />
  );
}
