import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Photo } from "@/components/ui/Photo";
import { PopularBadge, ChefBadge, SpiceLevel } from "@/components/ui/Badges";
import { formatPrice } from "@/lib/utils";

const featured: {
  name: string;
  jp: string;
  desc: string;
  price: number;
  img: string;
  alt: string;
  kanji: string;
  popular?: boolean;
  chef?: boolean;
  spice?: number;
}[] = [
  {
    name: "Kintsugi",
    jp: "金継ぎ",
    desc: "Bluefin toro, gold leaf, smoked soy pearls and shiso.",
    price: 42,
    img: "/images/dish-kintsugi.jpg",
    alt: "Bluefin toro nigiri topped with gold leaf and shiso on a black kintsugi plate with golden seams",
    kanji: "金",
    popular: true,
    chef: true,
  },
  {
    name: "Ember & Yuzu",
    jp: "炭と柚子",
    desc: "Torched salmon belly, yuzu kosho, crisp leek ash, ikura.",
    price: 34,
    img: "/images/dish-ember-yuzu.jpg",
    alt: "Torched salmon belly nigiri with char marks, yuzu kosho and ikura roe",
    kanji: "炭",
    popular: true,
    spice: 2,
  },
  {
    name: "Hokkaido Uni",
    jp: "雲丹",
    desc: "Sea urchin from Rausu, cold-brined nori, a whisper of wasabi.",
    price: 16,
    img: "/images/dish-uni.jpg",
    alt: "A gunkan of vivid orange Hokkaido sea urchin wrapped in dark nori on slate",
    kanji: "雲丹",
    popular: true,
  },
];

export function Signature() {
  return (
    <section
      aria-label="Signature dishes"
      className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36"
    >
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeading
          kicker="Signature compositions"
          jp="特選"
          title="Dishes built over years"
          className="max-w-2xl"
        />
        <Reveal>
          <Link
            href="/menu"
            className="ink-underline whitespace-nowrap text-[0.72rem] uppercase tracking-wider2 text-ink"
          >
            Full menu →
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {featured.map((dish, i) => (
          <Reveal key={dish.name} delay={i}>
            <article
              data-cursor="food"
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-line/60 bg-surface/30 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40"
            >
              <Photo
                src={dish.img}
                alt={dish.alt}
                kanji={dish.kanji}
                className="aspect-[4/3]"
                rounded="rounded-none"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  {dish.chef && <ChefBadge />}
                  {dish.popular && <PopularBadge />}
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-2xl text-ink">{dish.name}</h3>
                  <span className="font-serif text-xl text-accent">
                    {formatPrice(dish.price)}
                  </span>
                </div>
                <span className="mt-1 font-jp text-sm text-muted">{dish.jp}</span>
                <p className="mt-3 text-sm leading-relaxed text-muted">{dish.desc}</p>
                {dish.spice ? (
                  <div className="mt-4">
                    <SpiceLevel level={dish.spice} />
                  </div>
                ) : null}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
