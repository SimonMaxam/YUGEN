"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/lib/faq";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="mx-auto max-w-3xl px-5 py-24 md:px-10 md:py-32"
    >
      <SectionHeading kicker="Good to know" jp="質問" title="Frequently asked" align="center" />

      <dl className="mt-14 divide-y divide-line/60 border-y border-line/60">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <dt>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-serif text-xl text-ink md:text-2xl">{f.q}</span>
                  <span
                    className="relative flex h-6 w-6 shrink-0 items-center justify-center text-accent transition-transform duration-500"
                    style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                    aria-hidden
                  >
                    <span className="absolute h-px w-4 bg-current" />
                    <span className="absolute h-4 w-px bg-current" />
                  </span>
                </button>
              </dt>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.dd
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-6 text-sm leading-relaxed text-muted md:text-base">
                      {f.a}
                    </p>
                  </motion.dd>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
