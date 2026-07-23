"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Magnetic } from "@/components/ui/Magnetic";
import { site } from "@/lib/site";

const SushiScene = dynamic(() => import("@/components/three/SushiScene"), {
  ssr: false,
  loading: () => null,
});

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  // Lock height once so mobile browser chrome show/hide doesn't resize the hero.
  const [lockedH, setLockedH] = useState<number | null>(null);
  const [mountScene, setMountScene] = useState(true);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setLockedH(window.innerHeight);
    const touch =
      window.matchMedia("(pointer: coarse)").matches ||
      (navigator.maxTouchPoints > 0 && window.innerWidth < 900);
    setIsTouch(touch);

    // On phones only, briefly defer WebGL so text/CTAs paint first.
    // Desktop mounts immediately — the hero 3D is the main impression.
    if (!touch) {
      setMountScene(true);
      return;
    }
    setMountScene(false);
    const t = window.setTimeout(() => setMountScene(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  // iOS needs a user gesture to unlock DeviceOrientation for the gyro parallax.
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
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      aria-label="Introduction"
      className="relative flex w-full items-center justify-center overflow-hidden"
      style={{
        height: lockedH ? `${lockedH}px` : "100svh",
        minHeight: lockedH ? undefined : "100svh",
      }}
    >
      {/* WebGL sushi — never steals taps from the CTAs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {mountScene && <SushiScene />}
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 8%, rgb(var(--glow)/0.5), transparent 55%)",
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-20 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center"
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
          {site.tagline}. An intimate omakase counter where the season, the light
          and the hand of the chef become one quiet ritual.
        </motion.p>

        {/* Isolated CTAs — no Magnetic pull-together on touch; clear gap always */}
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
      >
        <span className="text-[0.6rem] uppercase tracking-ultra text-faint">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-accent"
            animate={{ y: [-16, 48] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
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
    ? "relative z-10 inline-flex w-full items-center justify-center rounded-full bg-accent px-9 py-4 text-[0.72rem] uppercase tracking-wider2 text-bg shadow-lg shadow-accent/20 transition-all duration-500 hover:brightness-110 sm:w-auto"
    : "relative z-10 inline-flex w-full items-center justify-center rounded-full border border-ink/40 bg-elevated/50 px-9 py-4 text-[0.72rem] uppercase tracking-wider2 text-ink backdrop-blur-sm transition-all duration-500 hover:border-accent hover:bg-elevated/70 hover:text-accent sm:w-auto";

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
