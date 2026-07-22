"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/** A slow, scroll-reactive kanji ribbon used as a breathing divider. */
export function KanjiMarquee({
  text = "旬 · 静寂 · 幽玄 · 職人 · 一期一会 ·",
}: {
  text?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-18%"]);

  return (
    <div ref={ref} className="overflow-hidden py-10 md:py-16" aria-hidden>
      <motion.div
        style={{ x }}
        className="whitespace-nowrap font-jp text-[14vw] leading-none text-ink/[0.06] md:text-[9vw]"
      >
        {`${text} ${text} `}
      </motion.div>
    </div>
  );
}
