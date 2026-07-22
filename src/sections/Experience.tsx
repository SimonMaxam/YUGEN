"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experiences } from "@/lib/experiences";

const RestaurantScene = dynamic(
  () => import("@/components/three/RestaurantScene"),
  { ssr: false, loading: () => <SceneSkeleton /> },
);

function SceneSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface/50">
      <div className="flex flex-col items-center gap-3">
        <span className="font-jp text-3xl text-muted">室内</span>
        <span className="text-[0.62rem] uppercase tracking-ultra text-faint">
          Preparing the room…
        </span>
      </div>
    </div>
  );
}

export function Experience() {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<number | null>(null);
  const active = selected !== null ? experiences[selected] : null;

  return (
    <section
      id="experience"
      aria-label="The 3D restaurant experience"
      className="relative border-y border-line/60 bg-surface/30 py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          kicker="Step inside"
          jp="体験"
          title="Explore the room before you arrive"
          lede="Drag to look around our counter, garden window and private tatami room. Select a glowing seat to discover its omakase experience."
        />

        <div className="relative mt-12 overflow-hidden rounded-3xl border border-line/60 bg-bg/40">
          <div className="relative h-[70svh] min-h-[460px] w-full">
            <RestaurantScene theme={theme} onSelect={(i) => setSelected(i)} />

            {/* interaction hint */}
            <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1 text-[0.6rem] uppercase tracking-wider2 text-ink/70 md:left-6 md:top-6">
              <span>Drag · look around</span>
              <span>Scroll · zoom</span>
              <span className="text-accent">Tap a glowing seat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table experience popup */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center p-4 md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-bg/70 backdrop-blur-md"
              onClick={() => setSelected(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={active.name}
              initial={{ y: 60, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass relative w-full max-w-lg rounded-3xl p-8 md:p-10"
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:text-accent"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                  <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>

              <span className="kicker">{active.seat}</span>
              <div className="mt-3 flex items-baseline gap-3">
                <h3 className="font-serif text-3xl text-ink md:text-4xl">{active.name}</h3>
                <span className="font-jp text-lg text-muted">{active.jp}</span>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.7rem] uppercase tracking-wider2 text-muted">
                <span>{active.duration}</span>
                <span>{active.courses}</span>
                <span className="text-accent">{active.price}</span>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted">{active.summary}</p>

              <ul className="mt-6 flex flex-col gap-2.5">
                {active.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-ink">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {h}
                  </li>
                ))}
              </ul>

              <p className="mt-6 border-t border-line/60 pt-4 text-xs text-faint">
                {active.pairing}
              </p>

              <Link
                href="/reservations"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-accent px-8 py-4 text-[0.72rem] uppercase tracking-wider2 text-bg transition-all duration-500 hover:brightness-110"
              >
                Reserve this experience
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
