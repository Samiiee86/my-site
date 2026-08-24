import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Dashboard from "./Dashboard";
import { hero } from "../lib/content";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex flex-1 flex-col items-center overflow-hidden"
    >
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/70 via-background/40 to-background/80" />

      <div className="relative z-10 flex w-full flex-col items-center px-6">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-6 inline-flex items-center gap-1.5 rounded-[10px] border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground"
        >
          {hero.badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="max-w-2xl text-center text-5xl leading-[1.02] tracking-tight text-foreground md:text-6xl lg:text-[4.5rem]"
        >
          <span className="block">Build with AI,</span>
          <span className="block">Test with TestMu AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-4 max-w-[650px] text-center text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
        >
          <button
            data-cursor="Start free"
            className="group inline-flex items-center justify-center gap-3 rounded-[10px] bg-primary py-2.5 pl-6 pr-2.5 text-[15px] font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-foreground/85"
          >
            {hero.primary}
            <span className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-[#E16F24] text-white transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight size={15} />
            </span>
          </button>
          <button
            data-cursor="Sign up with email"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-border bg-surface px-6 py-[15px] text-[15px] font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary"
          >
            {hero.secondary}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="mt-8 w-full max-w-5xl"
        >
          <div
            className="overflow-hidden  p-3 md:p-4"
            style={{
              background: "rgba(255, 255, 255, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "var(--shadow-dashboard)",
            }}
          >
            <Dashboard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
