"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAudio } from "@/components/providers/AudioProvider";
import { site } from "@/lib/site";

/**
 * The overture. No spinner — the wait *is* the experience:
 *   1. paper warms in
 *   2. an ink brushstroke bleeds outward
 *   3. the 幽玄 kanji + wordmark settle
 *   4. an "Enter" invitation reveals the site (and, on that gesture, unmutes
 *      the ambient soundtrack per autoplay policy).
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const audio = useAudio();

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 500);
    const t2 = setTimeout(() => setStage(2), 1700);
    const t3 = setTimeout(() => setStage(3), 2700);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  function enter(withSound: boolean) {
    if (withSound) audio.enable();
    setLeaving(true);
    setTimeout(onDone, 1100);
  }

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* ink bleed */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgb(var(--c-accent)/0.16), transparent 68%)",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: stage >= 1 ? 240 : 0 }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="relative flex flex-col items-center gap-6 px-6 text-center">
            <motion.div
              className="font-jp text-6xl text-ink md:text-7xl"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
              animate={
                stage >= 1
                  ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                  : {}
              }
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {site.nameJp}
            </motion.div>

            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={stage >= 2 ? { opacity: 1 } : {}}
              transition={{ duration: 1 }}
            >
              <div className="text-[0.7rem] uppercase tracking-ultra text-muted">
                {site.name} · {site.tagline}
              </div>
            </motion.div>

            <motion.div
              className="mt-4 flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <button
                onClick={() => enter(true)}
                className="group relative rounded-full border border-ink/20 px-9 py-3.5 text-[0.7rem] uppercase tracking-wider2 text-ink transition-colors duration-500 hover:border-accent hover:text-accent"
              >
                Enter with sound
              </button>
              <button
                onClick={() => enter(false)}
                className="text-[0.68rem] uppercase tracking-wider2 text-faint underline-offset-4 transition-colors hover:text-muted"
              >
                Enter silently
              </button>
            </motion.div>
          </div>

          {/* corner marks */}
          <div className="pointer-events-none absolute inset-6 md:inset-10">
            {[
              "left-0 top-0 border-l border-t",
              "right-0 top-0 border-r border-t",
              "left-0 bottom-0 border-l border-b",
              "right-0 bottom-0 border-r border-b",
            ].map((c, i) => (
              <motion.span
                key={i}
                className={`absolute h-6 w-6 border-ink/25 ${c}`}
                initial={{ opacity: 0 }}
                animate={stage >= 2 ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.1 * i }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
