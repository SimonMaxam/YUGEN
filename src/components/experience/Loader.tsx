"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAudio } from "@/components/providers/AudioProvider";
import { isTouchDevice } from "@/lib/device";
import { site } from "@/lib/site";

/**
 * A short, wordless overture (~2.4s): an ink bloom, a slowly rotating maki roll,
 * and the 幽玄 wordmark settling into place. It auto-dismisses — no spinner, no
 * "enter with sound?" wall. Clicking anywhere simply enters a touch sooner and,
 * being a user gesture, lets the ambient track begin immediately.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const audio = useAudio();
  const doneRef = useRef(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 200);
    const t2 = setTimeout(() => setStage(2), 900);
    const auto = setTimeout(() => leave(), isTouchDevice() ? 1400 : 2500);
    return () => [t1, t2, auto].forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function leave(fromGesture = false) {
    if (doneRef.current) return;
    doneRef.current = true;
    if (fromGesture) audio.enable(); // begin the soundtrack on this gesture
    setLeaving(true);
    setTimeout(onDone, 900);
  }

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          role="button"
          tabIndex={0}
          aria-label="Enter YŪGEN"
          onClick={() => leave(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") leave(true);
          }}
          className="fixed inset-0 z-[10000] flex cursor-none flex-col items-center justify-center overflow-hidden bg-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* ink bloom */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgb(var(--c-accent)/0.14), transparent 68%)",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: stage >= 1 ? 240 : 0 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* the spinning maki */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={stage >= 1 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 9, ease: "linear", repeat: Infinity }}
              className="relative h-24 w-24 md:h-28 md:w-28"
            >
              <Maki />
            </motion.div>
            {/* orbiting sesame */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 6, ease: "linear", repeat: Infinity }}
              className="absolute inset-0"
            >
              <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-ink/40" />
            </motion.div>
          </motion.div>

          {/* wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={stage >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col items-center gap-2 text-center"
          >
            <span className="font-jp text-4xl text-ink md:text-5xl">
              {site.nameJp}
            </span>
            <span className="text-[0.62rem] uppercase tracking-ultra text-muted">
              {site.name} · {site.tagline}
            </span>
          </motion.div>

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
                transition={{ duration: 0.9, delay: 0.1 * i }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** A top-down maki roll rendered with nested rings (theme-independent colours). */
function Maki() {
  return (
    <div className="absolute inset-0 rounded-full" style={{ background: "#15110f" }}>
      {/* nori sheen */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(60% 40% at 32% 24%, rgba(255,255,255,0.18), transparent 60%)",
        }}
      />
      {/* rice */}
      <div
        className="absolute inset-[9px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 38% 32%, #fbf6ec, #ece0cc 70%, #ddceb2)",
        }}
      />
      {/* filling */}
      <div
        className="absolute inset-[30px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, #f08a5a, #d85e42 65%, #b8432c)",
        }}
      />
      {/* avocado + cucumber flecks */}
      <span
        className="absolute left-[26%] top-[52%] h-2 w-2 rounded-full"
        style={{ background: "#8fae66" }}
      />
      <span
        className="absolute right-[28%] top-[34%] h-1.5 w-1.5 rounded-full"
        style={{ background: "#6f9b53" }}
      />
    </div>
  );
}
