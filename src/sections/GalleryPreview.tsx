import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Photo } from "@/components/ui/Photo";
import { site } from "@/lib/site";

const tiles: { img: string; alt: string; kanji: string; label: string; span?: string }[] = [
  { img: "/images/gallery-torched.jpg", alt: "A chef's blowtorch searing a piece of nigiri", kanji: "炭", label: "Torched to order", span: "row-span-2" },
  { img: "/images/gallery-room.jpg", alt: "The minimalist dining room with paper lanterns", kanji: "席", label: "The room" },
  { img: "/images/gallery-matcha.jpg", alt: "Ceremonial matcha being whisked in a dark bowl", kanji: "茶", label: "Matcha service" },
  { img: "/images/gallery-night.jpg", alt: "The dining room at night, lantern-lit", kanji: "夜", label: "After dark", span: "row-span-2" },
  { img: "/images/dish-uni.jpg", alt: "Hokkaido uni gunkan on nori", kanji: "雲丹", label: "Uni, Rausu" },
  { img: "/images/ceramics.jpg", alt: "Hand-thrown ceramics", kanji: "器", label: "Ceramics" },
];

export function GalleryPreview() {
  return (
    <section
      aria-label="Gallery preview"
      className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36"
    >
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeading kicker="In frame" jp="写真" title="Moments from the room" className="max-w-2xl" />
        <Reveal>
          <Link
            href="/gallery"
            className="ink-underline whitespace-nowrap text-[0.72rem] uppercase tracking-wider2 text-ink"
          >
            Full gallery →
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[200px]">
        {tiles.map((t, i) => (
          <Reveal key={t.label} delay={i % 4} className={t.span ?? ""}>
            <Photo
              src={t.img}
              alt={t.alt}
              kanji={t.kanji}
              label={t.label}
              className="h-full w-full"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </Reveal>
        ))}
      </div>

      <Reveal delay={2}>
        <a
          href={site.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          <span className="font-jp">＠</span> Follow the season on Instagram
        </a>
      </Reveal>
    </section>
  );
}
