"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";
import { HeroMobileStage } from "@/components/hero/HeroMobileStage";
import { shouldAutoLoad3D, isTouchDevice } from "@/lib/device";

const SushiScene = dynamic(() => import("@/components/three/SushiScene"), {
  ssr: false,
  loading: () => null,
});

const profiles = [
  { label: "GitHub", href: "https://github.com/wolliom" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/simonmaxam/" },
  { label: "Instagram", href: "https://www.instagram.com/simonmaxam/" },
];

/**
 * Full-screen "who made this" hero for /about. It reuses the YŪGEN 3D scene from
 * the home page so anyone landing here from a search for "Simon Maxam" sees the
 * same world, plus the developer's name on top. The scene follows scroll; the
 * name, chips and glow drift with the cursor on desktop and the gyro on phones.
 */
export function DevHero() {
  const ref = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const layers = useRef<(HTMLElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const [mountScene, setMountScene] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMountScene(shouldAutoLoad3D());
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // keep the camera in the wide-to-mid part of the dolly so the room stays readable
    progressRef.current = Math.min(0.8, v * 1.1);
    setProgress(v);
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (isTouchDevice()) return; // phones stay still: gyro parallax made the hero wobble
    let frame = 0;
    const cur = { x: 0, y: 0 };
    const tick = () => {
      frame = requestAnimationFrame(tick);
      cur.x += (pointer.current.x - cur.x) * 0.05;
      cur.y += (pointer.current.y - cur.y) * 0.05;
      layers.current.forEach((el) => {
        if (!el) return;
        const d = Number(el.dataset.depth ?? 0);
        el.style.transform = `translate3d(${(cur.x * d).toFixed(2)}px, ${(cur.y * d * 0.7).toFixed(2)}px, 0)`;
      });
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  function onMove(e: React.PointerEvent) {
    if (e.pointerType === "touch") return;
    pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }
  const setLayer = (i: number) => (el: HTMLElement | null) => {
    layers.current[i] = el;
  };

  return (
    <section
      ref={ref}
      aria-label="Simon Maxam, the developer behind YŪGEN"
      onPointerMove={onMove}
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden"
    >
      {/* 3D world from the home page */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {mountScene ? (
          <SushiScene progressRef={progressRef} />
        ) : (
          <HeroMobileStage scrollProgress={progress} />
        )}
      </div>

      {/* maker colour wash + vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgb(var(--c-bg)/0.55), rgb(var(--c-bg)/0.35) 40%, rgb(var(--c-bg)))",
        }}
      />
      {/* soft scrim so the copy stays readable over the sushi */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(48% 46% at 50% 52%, rgb(var(--c-bg)/0.72), rgb(var(--c-bg)/0.35) 60%, transparent 85%)",
        }}
      />

      <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 pb-20 pt-24 text-center max-md:justify-end max-md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-5 flex items-center gap-3"
        >
          <span className="h-px w-10 bg-accent/70" />
          <span className="font-sans text-[0.68rem] font-extrabold uppercase tracking-ultra text-ink">
            Developer. 3D artist. Founder of Radoya.
          </span>
          <span className="h-px w-10 bg-accent/70" />
        </motion.div>

        <h1
          ref={setLayer(3)}
          data-depth={-6}
          className="font-sans text-[clamp(3.4rem,min(17vw,24vh),12rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.04em] text-ink"
        >
          <span className="block">Simon</span>
          <span className="block">Maxam</span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 max-w-xl text-balance text-base leading-relaxed text-ink/85 md:text-lg"
        >
          I build websites that people remember. I made every part of this site: the 3D room, the lighting and the sound.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="relative z-30 mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center"
        >
          <a
            href="#certificates"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-9 py-4 text-[0.72rem] font-extrabold uppercase tracking-wider2 text-bg transition-all duration-500 hover:bg-accent-soft"
          >
            See my certificates
          </a>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/35 bg-elevated/40 px-9 py-4 text-[0.72rem] uppercase tracking-wider2 text-ink backdrop-blur-sm transition-all duration-500 hover:border-accent hover:text-accent"
          >
            Visit YŪGEN
          </Link>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="relative z-30 mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {profiles.map((p) => (
            <li key={p.label}>
              <a
                href={p.href}
                target="_blank"
                rel="me noopener noreferrer"
                className="text-[0.66rem] uppercase tracking-wider2 text-muted transition-colors hover:text-accent"
              >
                {p.label} ↗
              </a>
            </li>
          ))}
        </motion.ul>

      </div>

      <div className="pointer-events-none absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="text-[0.58rem] uppercase tracking-ultra text-faint">Scroll</span>
        <div className="h-px w-24 overflow-hidden bg-line/70">
          <div className="h-full bg-accent" style={{ width: `${Math.min(100, progress * 130)}%` }} />
        </div>
      </div>
    </section>
  );
}
