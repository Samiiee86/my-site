import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Dashboard from "./Dashboard";
import { hero } from "../lib/content";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4";

const EASE = [0.16, 1, 0.3, 1] as const;

/* The clip's last frame doesn't match its first, so a native `loop` hard-cuts
   at the seam. Instead two copies of the video overlap: when the front one is
   a second from ending, the back one starts from zero and fades up over that
   second. The cut is still there — it just happens under a crossfade. */
const FADE = 1; /* seconds */

function LoopingVideo() {
  const refs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const [front, setFront] = useState(0);

  useEffect(() => {
    let active = 0;
    let swapping = false;

    const onTime = () => {
      const v = refs[active].current;
      if (!v || !v.duration || swapping) return;
      if (v.duration - v.currentTime <= FADE) {
        swapping = true;
        const next = refs[1 - active].current;
        if (next) {
          next.currentTime = 0;
          void next.play();
        }
        setFront(1 - active);
        const old = v;
        active = 1 - active;
        window.setTimeout(() => {
          old.pause();
          old.currentTime = 0;
          swapping = false;
        }, FADE * 1000);
      }
    };

    const vids = refs.map((r) => r.current);
    vids.forEach((v) => v?.addEventListener("timeupdate", onTime));
    void vids[0]?.play();
    return () =>
      vids.forEach((v) => v?.removeEventListener("timeupdate", onTime));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {[0, 1].map((i) => (
        <video
          key={i}
          ref={refs[i]}
          className="absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-1000 ease-linear"
          style={{ opacity: front === i ? 1 : 0 }}
          src={HERO_VIDEO}
          muted
          playsInline
          preload="auto"
          autoPlay={i === 0}
        />
      ))}
    </>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex flex-1 flex-col items-center overflow-hidden pb-16 md:pb-24"
    >
      <LoopingVideo />
      {/* readability wash up top... */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/70 via-background/30 to-transparent" />
      {/* ...and a dissolve into the page background below, so the video never
          hard-stops against the next section */}
      <div className="absolute inset-x-0 bottom-0 z-0 h-[45%] bg-gradient-to-b from-transparent via-background/80 to-background" />
      {/* the last stretch is solid, so the video is fully gone at the divider */}
      <div className="absolute inset-x-0 bottom-0 z-0 h-[7%] bg-background" />

      <div className="relative z-10 flex w-full flex-col items-center px-6 pt-[72px]">
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
