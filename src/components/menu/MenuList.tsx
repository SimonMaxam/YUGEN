"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { menu, dietaryMeta, type Dietary } from "@/lib/menu";
import { Plate, type PlateTone } from "@/components/ui/Plate";
import {
  ChefBadge,
  PopularBadge,
  SpiceLevel,
  DietaryTags,
} from "@/components/ui/Badges";
import { formatPrice, cn } from "@/lib/utils";

const toneFor: Record<string, PlateTone> = {
  "signature-rolls": "tuna",
  nigiri: "salmon",
  sashimi: "roe",
  maki: "salmon",
  warm: "wood",
  desserts: "matcha",
  drinks: "ceramic",
};

const dietaryOptions = Object.keys(dietaryMeta) as Dietary[];

export function MenuList() {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState<Dietary | "all">("all");

  const categories = useMemo(() => {
    return menu
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => {
          const q = query.trim().toLowerCase();
          const matchesQuery =
            !q ||
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q);
          const matchesDiet = diet === "all" || item.dietary?.includes(diet);
          return matchesQuery && matchesDiet;
        }),
      }))
      .filter((cat) => (active === "all" || cat.id === active) && cat.items.length);
  }, [active, query, diet]);

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-28 md:px-10">
      {/* controls */}
      <div className="sticky top-[68px] z-30 -mx-5 mb-12 border-y border-line/60 bg-bg/80 px-5 py-4 backdrop-blur-xl md:top-[76px] md:mx-0 md:rounded-2xl md:border md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="scrollbar-none flex gap-2 overflow-x-auto">
            <Chip label="All" active={active === "all"} onClick={() => setActive("all")} />
            {menu.map((c) => (
              <Chip
                key={c.id}
                label={c.name}
                active={active === c.id}
                onClick={() => setActive(c.id)}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="menu-search" className="sr-only">
              Search the menu
            </label>
            <input
              id="menu-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes…"
              className="w-full rounded-full border border-line bg-surface/40 px-5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-accent lg:w-52"
            />
            <label htmlFor="menu-diet" className="sr-only">
              Filter by dietary need
            </label>
            <select
              id="menu-diet"
              value={diet}
              onChange={(e) => setDiet(e.target.value as Dietary | "all")}
              className="rounded-full border border-line bg-surface/40 px-4 py-2.5 text-sm text-ink outline-none focus:border-accent"
            >
              <option value="all">All diets</option>
              {dietaryOptions.map((d) => (
                <option key={d} value={d}>
                  {dietaryMeta[d].label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {categories.length === 0 && (
        <p className="py-20 text-center text-muted">
          No dishes match that search. Try another term.
        </p>
      )}

      <div className="flex flex-col gap-20">
        {categories.map((cat) => (
          <section key={cat.id} id={cat.id} aria-label={cat.name} className="scroll-mt-40">
            <div className="mb-8 flex items-end justify-between gap-6 border-b border-line/60 pb-5">
              <div>
                <div className="flex items-baseline gap-3">
                  <h2 className="font-serif text-3xl text-ink md:text-4xl">{cat.name}</h2>
                  <span className="font-jp text-base text-muted">{cat.jp}</span>
                </div>
                <p className="mt-2 max-w-md text-sm text-muted">{cat.blurb}</p>
              </div>
            </div>

            <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2">
              {cat.items.map((item, i) => (
                <motion.li
                  key={item.id}
                  data-cursor="food"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.6, delay: (i % 2) * 0.06 }}
                  className="group flex gap-5"
                >
                  <Plate
                    tone={toneFor[cat.id] ?? "salmon"}
                    kanji={item.jp?.slice(0, 1)}
                    className="h-24 w-24 shrink-0 rounded-xl md:h-28 md:w-28"
                    parallax={false}
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-serif text-xl text-ink">
                        {item.name}
                        {item.jp && (
                          <span className="ml-2 font-jp text-sm text-muted">{item.jp}</span>
                        )}
                      </h3>
                      <span className="shrink-0 font-serif text-lg text-accent">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2.5">
                      {item.chef && <ChefBadge />}
                      {item.popular && <PopularBadge />}
                      {item.spice ? <SpiceLevel level={item.spice} /> : null}
                      <DietaryTags tags={item.dietary} />
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-wider2 transition-all duration-300",
        active
          ? "border-accent bg-accent text-bg"
          : "border-line text-muted hover:border-accent hover:text-accent",
      )}
    >
      {label}
    </button>
  );
}
