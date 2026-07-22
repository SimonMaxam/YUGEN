"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Real photography with the same cinematic framing as <Plate/>: a subtle
 * scroll parallax, a soft light bloom + vignette, and an optional kanji/label.
 * Uses a plain lazy <img> (static export friendly) with a graceful fade-in.
 */
export function Photo({
  src,
  alt,
  kanji,
  label,
  className,
  parallax = true,
  rounded = "rounded-2xl",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  kanji?: string;
  label?: string;
  className?: string;
  parallax?: boolean;
  rounded?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Images that are already cached finish loading before hydration attaches the
  // onLoad handler — without this check they'd stay stuck at opacity-0 forever.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], parallax ? [26, -26] : [0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.02, 1.08]);

  return (
    <div
      ref={ref}
      className={cn("group relative overflow-hidden bg-surface/50", rounded, className)}
    >
      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{ y, scale }}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-silk",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
      {/* soft light + vignette to seat the image into the theme */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_28%_15%,rgba(255,255,255,0.14),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_130%_at_50%_50%,transparent_58%,rgba(0,0,0,0.4))]" />
      {kanji && (
        <span className="pointer-events-none absolute bottom-4 right-5 font-jp text-5xl text-white/25 transition-transform duration-700 group-hover:scale-110">
          {kanji}
        </span>
      )}
      {label && (
        <span className="pointer-events-none absolute bottom-4 left-5 text-[0.62rem] uppercase tracking-wider2 text-white/85">
          {label}
        </span>
      )}
    </div>
  );
}
