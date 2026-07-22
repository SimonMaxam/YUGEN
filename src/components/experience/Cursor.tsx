"use client";

import { useEffect, useRef, useState } from "react";
import { lerp } from "@/lib/utils";

type CursorMode = "default" | "food" | "action" | "text";

/**
 * A pair of elegant chopsticks that replace the native cursor on fine pointers.
 * - default: chopsticks rest at a gentle angle
 * - food ([data-cursor="food"]): they slowly open & close as if picking up a piece
 * - action (links/buttons): they close to a point and a lacquer dot appears
 * The whole thing is driven by a single rAF loop with no React re-renders for
 * position, so it stays pinned at 60fps.
 */
export function Cursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable on fine pointers (skip touch devices entirely).
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;

    document.documentElement.classList.add("custom-cursor-active");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;
    let t = 0;
    let currentMode: CursorMode = "default";

    function resolveMode(el: Element | null): CursorMode {
      if (!el) return "default";
      const tagged = el.closest<HTMLElement>("[data-cursor]");
      if (tagged) return (tagged.dataset.cursor as CursorMode) || "default";
      if (el.closest("a, button, [role='button'], input, textarea, select, label"))
        return "action";
      return "default";
    }

    function onMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
      const next = resolveMode(document.elementFromPoint(e.clientX, e.clientY));
      if (next !== currentMode) {
        currentMode = next;
        setMode(next);
      }
    }

    const visibleRef = { current: false };
    function onLeave() {
      visibleRef.current = false;
      setVisible(false);
    }
    function onDown() {
      if (wrapRef.current) wrapRef.current.style.setProperty("--press", "0.82");
    }
    function onUp() {
      if (wrapRef.current) wrapRef.current.style.setProperty("--press", "1");
    }

    function frame() {
      t += 0.05;
      const ease = reduce ? 1 : 0.18;
      pos.x = lerp(pos.x, target.x, ease);
      pos.y = lerp(pos.y, target.y, ease);

      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }

      // Chopstick opening angle per mode.
      let open = 7; // resting degrees
      if (currentMode === "food") open = 7 + Math.sin(t) * 6.5 + 6.5;
      else if (currentMode === "action") open = 1.5;

      if (topRef.current && botRef.current) {
        topRef.current.style.transform = `rotate(${-open}deg)`;
        botRef.current.style.transform = `rotate(${open}deg)`;
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden [--press:1] mix-blend-difference md:block"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      <div
        className="relative -translate-x-1/2 -translate-y-1/2"
        style={{ transform: "scale(var(--press))", transition: "transform 0.14s ease" }}
      >
        {/* Chopsticks pivot from the cursor point outward to the upper-right */}
        <div
          ref={topRef}
          className="absolute left-0 top-0 h-[2px] w-11 origin-left rounded-full bg-white"
          style={{ transition: "background 0.4s" }}
        />
        <div
          ref={botRef}
          className="absolute left-0 top-0 h-[2px] w-11 origin-left rounded-full bg-white"
        />
        {/* Lacquer dot for action targets */}
        <div
          ref={dotRef}
          className="absolute left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{
            opacity: mode === "action" ? 1 : 0,
            transform: `translate(-50%,-50%) scale(${mode === "action" ? 1 : 0})`,
            transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
    </div>
  );
}
