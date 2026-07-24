"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { Magnetic } from "@/components/ui/Magnetic";
import { site } from "@/lib/site";

const SushiScene = dynamic(() => import("@/components/three/SushiScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Cinematic hero inspired by scroll-driven 3D demos (e.g. Horizon):
 * a tall scroll range + sticky stage so scrolling dollys the camera through
 * the sushi scene. Aesthetic stays YŪGEN — warm, quiet, Japanese — not cosmos.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [mountScene, setMountScene] = useState(true);
  const [isTouch, setIsTouch] = useState(false);
  const [progressLabel, setProgressLabel] = useState(0);

  useEffect(() => {
    const touch =
      window.matchMedia("(pointer: coarse)").matches ||
      (navigator.maxTouchPoints > 0 && window.innerWidth < 900);
    setIsTouch(touch);

    if (!touch) {
      setMountScene(true);
      return;
    }
    setMountScene(false);
    const t = window.setTimeout(() => setMountScene(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isTouch) return;
    type DOE = {
      requestPermission?: () => Promise<"granted" | "denied" | "default">;
    };
    const DOE = DeviceOrientationEvent as unknown as DOE;
    if (typeof DOE.requestPermission !== "function") return;

    const ask = () => {
      DOE.requestPermission?.().catch(() => {});
      window.removeEventListener("pointerdown", ask);
    };
    window.addEventListener("pointerdown", ask, { once: true, passive: true });
    return () => window.removeEventListener("pointerdown", ask);
  }, [isTouch]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    setProgressLabel(v);
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.35, 0.55], [1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.55], [0, -80]);
  const contentScale = useTransform(scrollYProgress, [0, 0.55], [1, 0.92]);

  const midOpacity = useTransform(scrollYProgress, [0.35, 0.5, 0.75], [0, 1, 0]);
  const midY = useTransform(scrollYProgress, [0.35, 0.75], [40, -40]);

  const endOpacity = useTransform(scrollYProgress, [0.65, 0.82, 1], [0, 1, 1]);
  const endY = useTransform(scrollYProgress, [0.65, 1], [50, 0]);

  // A little shorter so the dolly finishes in roughly one–two scrolls, not three.
  const runway = isTouch ? "140vh" : "165vh";

  return (
    <section
      ref={ref}
      aria-label="Introduction"
      className="relative w-full"
      style={{ height: runway }}
    >
      <div className="sticky top-0 h-[100svh] min-h-[560px] w-full overflow-hidden">
        {/* WebGL sushi — never steals taps from the CTAs */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {mountScene && <SushiScene progressRef={progressRef} />}
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 8%, rgb(var(--glow)/0.5), transparent 55%)",
          }}
        />

        {/* Stage 1 — brand + CTAs */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
          className="relative z-20 mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center px-6 text-center"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[110%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-2xl"
            style={{
              background:
                "radial-gradient(closest-side, rgb(var(--c-bg)/0.62), rgb(var(--c-bg)/0.28) 50%, transparent 72%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-accent/60" />
            <span className="kicker">{site.cuisine.join(" · ")}</span>
            <span className="h-px w-10 bg-accent/60" />
          </motion.div>

          <h1 className="font-serif text-fluid-hero font-light leading-[0.86] text-ink">
            <OverflowLine delay={0.3}>{site.name}</OverflowLine>
            <span className="sr-only">
              {" "}
              — Omakase Sushi &amp; Cinematic Fine Dining in San Francisco
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="mt-7 max-w-md text-balance text-base font-medium leading-relaxed text-ink/85 md:text-lg"
          >
            {site.tagline}. An intimate omakase counter where the season, the
            light and the hand of the chef become one quiet ritual.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="relative z-30 mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 pb-16 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-5 sm:pb-0"
          >
            <Cta href="/reservations" primary magnetic={!isTouch}>
              Reserve a seating
            </Cta>
            <Cta href="/menu" magnetic={!isTouch}>
              View the menu
            </Cta>
          </motion.div>
        </motion.div>

        {/* Stage 2 — mid scroll whisper */}
        <motion.div
          style={{ opacity: midOpacity, y: midY }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
          aria-hidden={progressLabel < 0.35 || progressLabel > 0.75}
        >
          <span className="font-jp text-4xl text-ink/80 md:text-5xl">一 期 一 会</span>
          <p className="mt-5 max-w-sm text-sm text-muted md:text-base">
            One encounter, one moment — never the same twice.
          </p>
        </motion.div>

        {/* Stage 3 — close-up invitation */}
        <motion.div
          style={{ opacity: endOpacity, y: endY }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
          aria-hidden={progressLabel < 0.65}
        >
          <span className="kicker">The counter</span>
          <p className="mt-4 max-w-md font-serif text-3xl font-light leading-snug text-ink md:text-4xl">
            Come closer. The night begins at the hinoki.
          </p>
        </motion.div>

        {/* Scroll progress — Horizon feature, YŪGEN styling */}
        <div className="pointer-events-none absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 sm:bottom-9">
          <span className="text-[0.58rem] uppercase tracking-ultra text-faint">
            Scroll
          </span>
          <div className="h-px w-24 overflow-hidden bg-line/70">
            <div
              className="h-full bg-accent transition-[width] duration-150 ease-out"
              style={{ width: `${Math.min(100, progressLabel * 100)}%` }}
            />
          </div>
          <span className="text-[0.58rem] tabular-nums tracking-wider2 text-faint">
            {String(Math.min(2, Math.floor(progressLabel * 2) + 1)).padStart(2, "0")}{" "}
            / 02
          </span>
        </div>
      </div>
    </section>
  );
}

function Cta({
  href,
  primary,
  magnetic,
  children,
}: {
  href: string;
  primary?: boolean;
  magnetic?: boolean;
  children: React.ReactNode;
}) {
  const cls = primary
    ? "relative z-10 inline-flex w-full min-h-12 items-center justify-center rounded-full bg-accent px-9 py-4 text-[0.72rem] uppercase tracking-wider2 text-bg shadow-lg shadow-accent/20 transition-all duration-500 hover:brightness-110 sm:w-auto"
    : "relative z-10 inline-flex w-full min-h-12 items-center justify-center rounded-full border border-ink/40 bg-elevated/50 px-9 py-4 text-[0.72rem] uppercase tracking-wider2 text-ink backdrop-blur-sm transition-all duration-500 hover:border-accent hover:bg-elevated/70 hover:text-accent sm:w-auto";

  const link = (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );

  if (!magnetic) return <div className="relative isolate">{link}</div>;
  return (
    <Magnetic strength={0.22} className="relative isolate">
      {link}
    </Magnetic>
  );
}

function OverflowLine({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={false}
        animate={{ y: "0%" }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ y: "110%" }}
      >
        {children}
      </motion.span>
    </span>
  );
}
