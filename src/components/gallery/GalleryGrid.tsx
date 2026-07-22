"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Photo } from "@/components/ui/Photo";

interface Shot {
  img: string;
  alt: string;
  kanji: string;
  caption: string;
  category: string;
  ratio: string;
}

const shots: Shot[] = [
  { img: "/images/dish-kintsugi.jpg", alt: "Bluefin toro nigiri with gold leaf on a kintsugi plate", kanji: "金", caption: "Kintsugi — bluefin toro, gold leaf", category: "Dishes", ratio: "aspect-[4/5]" },
  { img: "/images/counter-dusk.jpg", alt: "The hinoki counter at dusk with paper lanterns", kanji: "席", caption: "The counter at dusk", category: "Interior", ratio: "aspect-[4/3]" },
  { img: "/images/gallery-night.jpg", alt: "The dining room at night, lantern-lit", kanji: "夜", caption: "The room after dark", category: "Interior", ratio: "aspect-[3/4]" },
  { img: "/images/dish-uni.jpg", alt: "Hokkaido uni gunkan wrapped in nori", kanji: "雲丹", caption: "Hokkaido uni, Rausu", category: "Dishes", ratio: "aspect-square" },
  { img: "/images/gallery-matcha.jpg", alt: "Ceremonial matcha being whisked in a dark bowl", kanji: "茶", caption: "Ceremonial matcha service", category: "Drinks", ratio: "aspect-[4/5]" },
  { img: "/images/ceramics.jpg", alt: "Hand-thrown matte ceramics stacked on concrete", kanji: "器", caption: "Hand-thrown ceramics", category: "Craft", ratio: "aspect-[4/3]" },
  { img: "/images/gallery-otoro.jpg", alt: "A chef slicing bluefin otoro with a yanagiba knife", kanji: "鮪", caption: "Bluefin ōtoro, sliced to order", category: "Craft", ratio: "aspect-[3/4]" },
  { img: "/images/gallery-garden.jpg", alt: "A moss garden seen through a large window", kanji: "庭", caption: "The moss garden window", category: "Interior", ratio: "aspect-square" },
  { img: "/images/gallery-sake.jpg", alt: "The dim sake cellar with rows of bottles", kanji: "酒", caption: "The sake cellar", category: "Drinks", ratio: "aspect-[4/5]" },
  { img: "/images/chef-portrait.jpg", alt: "Chef Arata Mizuno behind the counter", kanji: "職", caption: "Chef Arata at the counter", category: "People", ratio: "aspect-[3/4]" },
  { img: "/images/gallery-private.jpg", alt: "A private tatami room set for a celebration", kanji: "宴", caption: "A private tatami celebration", category: "Events", ratio: "aspect-[3/4]" },
  { img: "/images/dish-ember-yuzu.jpg", alt: "Torched salmon belly nigiri with yuzu kosho and ikura", kanji: "炭", caption: "Ember & yuzu, torched belly", category: "Dishes", ratio: "aspect-square" },
  { img: "/images/gallery-torched.jpg", alt: "A blowtorch searing nigiri at the counter", kanji: "炎", caption: "Torched at the counter", category: "People", ratio: "aspect-[3/4]" },
  { img: "/images/gallery-room.jpg", alt: "Wide view of the minimalist dining room", kanji: "室", caption: "The dining room", category: "Interior", ratio: "aspect-[4/3]" },
  { img: "/images/gallery-mochi.jpg", alt: "Warabi mochi dusted with kinako and kuromitsu", kanji: "甘", caption: "Warabi mochi, kuromitsu", category: "Dishes", ratio: "aspect-square" },
  { img: "/images/salmon-belly.jpg", alt: "Macro of aged salmon belly on slate", kanji: "鮭", caption: "Aged salmon belly", category: "Dishes", ratio: "aspect-square" },
];

const categories = ["All", ...Array.from(new Set(shots.map((s) => s.category)))];

export function GalleryGrid() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<number | null>(null);

  const visible = shots
    .map((s, i) => ({ ...s, i }))
    .filter((s) => filter === "All" || s.category === filter);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((dir: number) => {
    setOpen((cur) => (cur === null ? cur : (cur + dir + shots.length) % shots.length));
  }, []);

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
            <Photo
              src={s.img}
              alt={s.alt}
              kanji={s.kanji}
              label={s.caption}
              className={s.ratio}
              parallax={false}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
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
              className="relative z-[1] flex max-h-[85vh] w-full max-w-3xl flex-col items-center"
            >
              <img
                src={shots[open].img}
                alt={shots[open].alt}
                className="max-h-[78vh] w-auto rounded-2xl object-contain"
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
