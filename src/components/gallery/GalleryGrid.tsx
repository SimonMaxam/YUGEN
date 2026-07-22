"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plate, type PlateTone } from "@/components/ui/Plate";

interface Shot {
  tone: PlateTone;
  kanji: string;
  caption: string;
  category: string;
  ratio: string;
}

const shots: Shot[] = [
  { tone: "salmon", kanji: "鮭", caption: "Torched salmon belly, yuzu kosho", category: "Dishes", ratio: "aspect-[4/5]" },
  { tone: "wood", kanji: "席", caption: "The hinoki counter before service", category: "Interior", ratio: "aspect-[4/3]" },
  { tone: "night", kanji: "夜", caption: "The room after dark", category: "Interior", ratio: "aspect-[3/4]" },
  { tone: "roe", kanji: "雲丹", caption: "Hokkaido uni, Rausu", category: "Dishes", ratio: "aspect-square" },
  { tone: "matcha", kanji: "茶", caption: "Ceremonial matcha service", category: "Drinks", ratio: "aspect-[4/5]" },
  { tone: "ceramic", kanji: "器", caption: "Hand-thrown ceramics", category: "Craft", ratio: "aspect-[4/3]" },
  { tone: "tuna", kanji: "鮪", caption: "Bluefin ōtoro, sliced to order", category: "Dishes", ratio: "aspect-[3/4]" },
  { tone: "wood", kanji: "庭", caption: "The moss garden window", category: "Interior", ratio: "aspect-square" },
  { tone: "night", kanji: "酒", caption: "The sake cellar", category: "Drinks", ratio: "aspect-[4/5]" },
  { tone: "salmon", kanji: "職", caption: "Chef Arata at the board", category: "People", ratio: "aspect-[4/3]" },
  { tone: "roe", kanji: "宴", caption: "A private tatami celebration", category: "Events", ratio: "aspect-[3/4]" },
  { tone: "matcha", kanji: "甘", caption: "Warabi mochi, kuromitsu", category: "Dishes", ratio: "aspect-square" },
];

const categories = ["All", ...Array.from(new Set(shots.map((s) => s.category)))];

export function GalleryGrid() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<number | null>(null);

  const visible = shots
    .map((s, i) => ({ ...s, i }))
    .filter((s) => filter === "All" || s.category === filter);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: number) => {
      setOpen((cur) => {
        if (cur === null) return cur;
        const next = (cur + dir + shots.length) % shots.length;
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-28 md:px-10">
      <div className="scrollbar-none mb-10 flex gap-2 overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`shrink-0 rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-wider2 transition-all duration-300 ${
              filter === c
                ? "border-accent bg-accent text-bg"
                : "border-line text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {visible.map((s) => (
          <motion.button
            key={s.i}
            layout
            onClick={() => setOpen(s.i)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-6%" }}
            transition={{ duration: 0.6 }}
            className="mb-4 block w-full break-inside-avoid text-left"
            aria-label={`Open image: ${s.caption}`}
          >
            <Plate tone={s.tone} kanji={s.kanji} label={s.caption} className={s.ratio} parallax={false} />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-bg/85 backdrop-blur-lg" onClick={close} />
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:text-accent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <button
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line text-ink transition-colors hover:text-accent md:left-8"
            >
              ‹
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line text-ink transition-colors hover:text-accent md:right-8"
            >
              ›
            </button>

            <motion.figure
              key={open}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-[1] w-full max-w-3xl"
            >
              <Plate
                tone={shots[open].tone}
                kanji={shots[open].kanji}
                className="aspect-[4/3] w-full"
                parallax={false}
              />
              <figcaption className="mt-4 text-center text-sm text-muted">
                {shots[open].caption}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
