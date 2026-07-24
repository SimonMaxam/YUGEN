"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experiences } from "@/lib/experiences";
import { HOTSPOTS } from "@/components/three/restaurant/config";
import type { JoystickState } from "@/components/three/restaurant/WalkControls";
import { SceneErrorBoundary } from "@/components/three/SceneErrorBoundary";
import type { TimeOfDay } from "@/lib/time-of-day";

/**
 * The room always glows at golden hour — its warm light is the most inviting,
 * and it stays independent of the site's (dark by default) theme.
 */
const SCENE_THEME: TimeOfDay = "evening";

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

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface/60 px-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="font-jp text-3xl text-muted">室内</span>
        <p className="max-w-xs text-sm text-muted">
          The interactive room couldn&apos;t start on this device. Explore our
          seatings below instead.
        </p>
        <Link
          href="/reservations"
          className="mt-1 rounded-full bg-accent px-6 py-3 text-[0.68rem] uppercase tracking-wider2 text-bg"
        >
          Reserve a seating
        </Link>
      </div>
    </div>
  );
}

export function Experience() {
  const [selected, setSelected] = useState<number | null>(null);
  const [mode, setMode] = useState<"orbit" | "walk">("orbit");
  const [nearest, setNearest] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const joystick = useRef<JoystickState>({ x: 0, y: 0 });
  const active = selected !== null ? experiences[selected] : null;

  // Device capability sniffing (client-only).
  useEffect(() => {
    const touch =
      window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    const cores = navigator.hardwareConcurrency ?? 8;
    setIsTouch(touch);
    setLowPower(touch || cores <= 4 || window.innerWidth < 768);
  }, []);

  // Mount the WebGL scene only once the section scrolls into view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Press E near a seat (walk mode) to open its experience.
  useEffect(() => {
    if (mode !== "walk") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyE" && nearest !== null) openExperience(nearest);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, nearest]);

  function openExperience(i: number) {
    setSelected(i);
    setMode("orbit"); // frees the pointer so the dialog is usable
  }

  const nearLabel =
    nearest !== null ? HOTSPOTS.find((h) => h.index === nearest)?.label : null;

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
          title="Walk into the room before you arrive"
          lede="Explore our counter, garden-window tables and private room in real time. Orbit the space, or step inside and walk through it like a game."
        />

        <div
          ref={wrapRef}
          className="relative mt-12 overflow-hidden rounded-3xl border border-line/60 bg-bg/40"
        >
          <div
            className={`relative h-[72svh] min-h-[480px] w-full ${
              mode === "walk" ? "touch-none overscroll-none select-none" : ""
            }`}
          >
            {inView && (
              <SceneErrorBoundary fallback={<SceneFallback />}>
                <RestaurantScene
                  theme={SCENE_THEME}
                  mode={mode}
                  isTouch={isTouch}
                  lowPower={lowPower}
                  joystick={joystick}
                  onSelect={openExperience}
                  onNearest={setNearest}
                  onExit={() => setMode("orbit")}
                />
              </SceneErrorBoundary>
            )}

            {/* -------------------- Mode toggle -------------------- */}
            <div className="absolute right-4 top-4 z-20 md:right-6 md:top-6">
              {mode === "orbit" ? (
                <button
                  onClick={() => setMode("walk")}
                  className="glass flex min-h-12 items-center gap-2 rounded-full px-5 py-3 text-[0.64rem] uppercase tracking-wider2 text-ink transition-colors hover:text-accent"
                >
                  <WalkIcon />
                  Walk inside
                </button>
              ) : (
                <button
                  onClick={() => setMode("orbit")}
                  className="glass flex min-h-12 items-center gap-2 rounded-full px-5 py-3 text-[0.64rem] uppercase tracking-wider2 text-ink transition-colors hover:text-accent"
                >
                  <ExitIcon />
                  Exit ({isTouch ? "back" : "Esc"})
                </button>
              )}
            </div>

            {/* -------------------- Orbit hint --------------------- */}
            {mode === "orbit" && (
              <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col gap-1 text-[0.6rem] uppercase tracking-wider2 text-ink/70 md:left-6 md:top-6">
                <span>Drag · look around</span>
                <span>Scroll · zoom</span>
                <span className="text-accent">Tap a glowing seat</span>
              </div>
            )}

            {/* -------------------- Walk overlay ------------------- */}
            {mode === "walk" && (
              <>
                {/* reticle */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 mix-blend-difference" />

                {/* controls hint */}
                <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/45 px-4 py-2 text-center text-[0.58rem] uppercase tracking-wider2 text-white/90 backdrop-blur-sm md:text-[0.62rem]">
                  {isTouch
                    ? "Joystick · move   ·   drag · look"
                    : "W A S D · move   ·   click + mouse · look   ·   shift · run   ·   esc · exit"}
                </div>

                {/* proximity prompt */}
                <AnimatePresence>
                  {nearLabel && (
                    <motion.button
                      key={nearLabel}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      onClick={() => nearest !== null && openExperience(nearest)}
                      className="absolute left-1/2 top-[58%] z-20 -translate-x-1/2 rounded-full bg-accent px-6 py-3 text-[0.62rem] uppercase tracking-wider2 text-bg shadow-lg shadow-black/30"
                    >
                      {isTouch ? "Tap" : "Press E"} · view {nearLabel}
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* mobile joystick */}
                {isTouch && <Joystick joystick={joystick} />}
              </>
            )}
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
                className="absolute right-5 top-5 flex h-12 w-12 min-h-12 min-w-12 items-center justify-center rounded-full border border-line text-ink transition-colors hover:text-accent"
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

/* --------------------------- Mobile joystick --------------------------- */

function Joystick({
  joystick,
}: {
  joystick: React.MutableRefObject<JoystickState>;
}) {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const pointerId = useRef<number | null>(null);
  const R = 44;

  const update = (clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > R) {
      dx = (dx / dist) * R;
      dy = (dy / dist) * R;
    }
    setKnob({ x: dx, y: dy });
    joystick.current.x = dx / R;
    joystick.current.y = -dy / R; // screen-up = forward
  };

  const reset = () => {
    setKnob({ x: 0, y: 0 });
    joystick.current.x = 0;
    joystick.current.y = 0;
    pointerId.current = null;
  };

  return (
    <div
      ref={baseRef}
      className="absolute bottom-6 left-6 z-20 flex h-28 w-28 touch-none items-center justify-center rounded-full border border-white/25 bg-black/25 backdrop-blur-sm"
      onPointerDown={(e) => {
        pointerId.current = e.pointerId;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        update(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (pointerId.current === e.pointerId) update(e.clientX, e.clientY);
      }}
      onPointerUp={reset}
      onPointerCancel={reset}
    >
      <div
        className="h-12 w-12 rounded-full bg-white/70 shadow-lg"
        style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
      />
    </div>
  );
}

/* ------------------------------- Icons -------------------------------- */

function WalkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="4" r="2" fill="currentColor" />
      <path
        d="M12 7v6m0 0l-3 6m3-6l3 6m-6-9l3-1 3 1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExitIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4M10 8l-4 4 4 4M6 12h9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
