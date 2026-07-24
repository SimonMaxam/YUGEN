"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDeviceTiltRef, useGyroPermissionPrompt } from "@/lib/useDeviceTilt";

/**
 * Phone hero — real dish photography + gyro parallax (no WebGL).
 * Food sits in the top band; copy stays in the lower half of the screen.
 */
export function HeroMobileStage({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const backRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [gyroHint, setGyroHint] = useState(true);
  const tilt = useDeviceTiltRef(true);
  const progressRef = useRef(scrollProgress);

  useGyroPermissionPrompt();

  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    let frame = 0;
    const apply = () => {
      const { x, y } = tilt.current;
      const p = progressRef.current;
      if (Math.abs(x) > 0.04 || Math.abs(y) > 0.04) setGyroHint(false);

      const scrollLift = p * 36;
      const scrollFade = 1 - Math.min(1, p * 1.15);

      if (backRef.current) {
        backRef.current.style.transform = `translate3d(${y * 6}px, ${x * 5 - scrollLift * 0.25}px, 0) scale(1.08)`;
        backRef.current.style.opacity = String(0.92 * scrollFade);
      }
      if (heroRef.current) {
        heroRef.current.style.transform = `translate3d(${y * 22}px, ${x * 16 - scrollLift * 0.85}px, 0) rotate(${y * 2.5}deg)`;
        heroRef.current.style.opacity = String(scrollFade);
      }
      if (leftRef.current) {
        leftRef.current.style.transform = `translate3d(${y * 30}px, ${x * 22 - scrollLift}px, 0) rotate(${-y * 4}deg)`;
        leftRef.current.style.opacity = String(scrollFade);
      }
      if (rightRef.current) {
        rightRef.current.style.transform = `translate3d(${y * 26}px, ${x * 18 - scrollLift * 0.9}px, 0) rotate(${y * 5}deg)`;
        rightRef.current.style.opacity = String(scrollFade);
      }

      frame = requestAnimationFrame(apply);
    };
    frame = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(frame);
  }, [tilt]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Soft cinematic plate — readable, not muddy */}
      <div ref={backRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/counter-dusk.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] opacity-50"
        />
        <div className="absolute inset-0 bg-bg/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-transparent to-bg/95" />
      </div>

      {/* Hero plate — center top */}
      <div
        ref={heroRef}
        className="absolute left-1/2 top-[7%] z-[3] w-[46vw] max-w-[200px] -translate-x-1/2 will-change-transform"
      >
        <FoodFrame
          src="/images/dish-kintsugi.jpg"
          alt=""
          priority
          className="aspect-[4/5]"
        />
      </div>

      <div
        ref={leftRef}
        className="absolute left-[4%] top-[22%] z-[2] w-[30vw] max-w-[120px] will-change-transform"
      >
        <FoodFrame src="/images/dish-uni.jpg" alt="" className="aspect-square" />
      </div>

      <div
        ref={rightRef}
        className="absolute right-[3%] top-[18%] z-[2] w-[32vw] max-w-[128px] will-change-transform"
      >
        <FoodFrame src="/images/salmon-belly.jpg" alt="" className="aspect-[4/5]" />
      </div>

      {gyroHint && (
        <p className="absolute left-0 right-0 top-[52%] z-[4] text-center text-[0.58rem] uppercase tracking-ultra text-faint">
          Tilt to move the plates
        </p>
      )}
    </div>
  );
}

function FoodFrame({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/20 relative ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={400}
        height={500}
        priority={priority}
        sizes="30vw"
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" />
    </div>
  );
}
