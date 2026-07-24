"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last && y > 300 && !open);
      last = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled ? "glass" : "bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10 md:py-5"
        >
          <Link
            href="/"
            className="group flex items-baseline gap-2"
            aria-label={`${site.name} home`}
          >
            <span className="font-serif text-2xl tracking-tight text-ink transition-colors group-hover:text-accent">
              {site.name}
            </span>
            <span className="font-jp text-sm text-muted">{site.nameJp}</span>
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.slice(0, -1).map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="ink-underline text-[0.72rem] uppercase tracking-wider2 text-muted transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/reservations"
              className="hidden min-h-12 items-center rounded-full border border-ink/20 px-5 py-3 text-[0.68rem] uppercase tracking-wider2 text-ink transition-all duration-500 hover:border-accent hover:text-accent sm:inline-flex"
            >
              Reserve
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-12 w-12 min-h-12 min-w-12 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span className="h-px w-6 bg-ink" />
              <span className="h-px w-6 bg-ink" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[70] flex flex-col bg-bg/98 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between px-5 py-4 md:px-10">
              <span className="font-serif text-2xl text-ink">{site.name}</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-12 w-12 min-h-12 min-w-12 items-center justify-center text-ink"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                  <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </div>
            <ul className="flex flex-1 flex-col justify-center gap-2 px-8">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.6 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b border-line/60 py-4"
                  >
                    <span className="font-serif text-4xl text-ink">{l.label}</span>
                    <span className="font-jp text-base text-muted">{l.jp}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
