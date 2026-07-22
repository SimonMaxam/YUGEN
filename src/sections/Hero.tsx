"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Magnetic } from "@/components/ui/Magnetic";
import { site } from "@/lib/site";

// The WebGL scene is client-only and code-split so it never blocks first paint.
const SushiScene = dynamic(() => import("@/components/three/SushiScene"), {
  ssr: false,
  loading: () => null,
});

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={ref}
      aria-label="Introduction"
      className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden"
    >
      {/* WebGL sushi */}
      <motion.div style={{ scale }} className="absolute inset-0 z-0">
        <SushiScene />
      </motion.div>

      {/* warm light wash */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 8%, rgb(var(--glow)/0.5), transparent 55%)",
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center"
      >
        {/* Legibility scrim — a soft, theme-coloured halo so the headline and
            copy stay readable over the busy 3D sushi in every time-of-day. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[135%] w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-2xl"
          style={{
            background:
              "radial-gradient(closest-side, rgb(var(--c-bg)/0.78), rgb(var(--c-bg)/0.42) 55%, transparent 80%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="h-px w-10 bg-accent/60" />
          <span className="kicker">{site.cuisine.join(" · ")}</span>
          <span className="h-px w-10 bg-accent/60" />
        </motion.div>

        <h1 className="font-serif text-fluid-hero font-light leading-[0.86] text-ink">
          <OverflowLine delay={0.35}>{site.name}</OverflowLine>
          <span className="sr-only">
            {" "}
            — Omakase Sushi &amp; Cinematic Fine Dining in San Francisco
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-7 max-w-md text-balance text-base font-medium leading-relaxed text-ink/85 md:text-lg"
        >
          {site.tagline}. An intimate omakase counter where the season,
          the light and the hand of the chef become one quiet ritual.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Magnetic strength={0.35}>
            <Link
              href="/reservations"
              className="rounded-full bg-accent px-9 py-4 text-[0.72rem] uppercase tracking-wider2 text-bg shadow-lg shadow-accent/20 transition-all duration-500 hover:brightness-110"
            >
              Reserve a seating
            </Link>
          </Magnetic>
          <Magnetic strength={0.35}>
            <Link
              href="/menu"
              className="rounded-full border border-ink/40 bg-elevated/40 px-9 py-4 text-[0.72rem] uppercase tracking-wider2 text-ink backdrop-blur-sm transition-all duration-500 hover:border-accent hover:bg-elevated/60 hover:text-accent"
            >
              View the menu
            </Link>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
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

/** A single line of heading that rises from behind a mask. */
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
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
