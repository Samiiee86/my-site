"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EASE_ENTRY, reveal } from "./reveal";

export function Reserve() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section
      id="reserve"
      className="relative scroll-mt-24 overflow-hidden border-t border-hairline-soft py-section"
    >
      {/* Volt wash rising from the bottom edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[32rem]"
        style={{
          background:
            "radial-gradient(80% 100% at 50% 100%, rgb(181 239 20 / 0.16), transparent 70%)",
        }}
      />

      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-volt-400" />
              <span className="eyebrow text-volt-400">04 — Reserve</span>
            </div>

            <motion.h2
              {...reveal({ y: 28, duration: 0.9, amount: 0.5 })}
              className="mt-8 font-display font-bold uppercase text-display-lg text-gradient-volt"
            >
              First Edition.
              <br />
              500 built.
            </motion.h2>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-content-muted">
              A $500 deposit holds your build slot and is fully refundable until
              your configuration is locked. First deliveries begin Q3 2027 in
              the EU and UK, with North America following in Q1 2028.
            </p>
          </div>

          <div className="lg:pb-2">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: EASE_ENTRY }}
                  className="rounded-lg border border-volt-400/40 bg-volt-400/5 p-6"
                >
                  <p className="font-display text-xl font-semibold uppercase tracking-tight text-volt-400">
                    You&rsquo;re on the list
                  </p>
                  <p className="mt-2 text-sm text-content-muted">
                    We&rsquo;ll send your configurator link to{" "}
                    <span className="font-mono text-content">{email}</span>{" "}
                    before deposits open.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: EASE_ENTRY }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  className="rounded-lg border border-hairline bg-surface/60 p-6 backdrop-blur"
                >
                  <label
                    htmlFor="reserve-email"
                    className="eyebrow text-content-subtle"
                  >
                    Join the reservation list
                  </label>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                      id="reserve-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="min-w-0 flex-1 rounded-full border border-hairline bg-canvas px-5 py-3 font-mono text-sm text-content placeholder:text-content-faint transition-colors duration-[--duration-fast] focus:border-volt-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="shrink-0 rounded-full bg-volt-400 px-6 py-3 text-sm font-semibold text-ink-950 transition-transform duration-[--duration-fast] ease-[--ease-entry] hover:scale-[1.03] active:scale-[0.99]"
                    >
                      Notify me
                    </button>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-content-faint">
                    One email when deposits open. No newsletter, no partners.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
