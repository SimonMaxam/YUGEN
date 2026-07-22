import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Plate, type PlateTone } from "@/components/ui/Plate";
import { site } from "@/lib/site";

const tiles: { tone: PlateTone; kanji: string; label: string; span?: string }[] = [
  { tone: "salmon", kanji: "鮭", label: "Torched belly", span: "row-span-2" },
  { tone: "wood", kanji: "席", label: "The counter" },
  { tone: "matcha", kanji: "茶", label: "Matcha service" },
  { tone: "night", kanji: "夜", label: "Evening room", span: "row-span-2" },
  { tone: "roe", kanji: "雲丹", label: "Uni, Rausu" },
  { tone: "ceramic", kanji: "器", label: "Ceramics" },
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
            <Plate tone={t.tone} kanji={t.kanji} label={t.label} className="h-full w-full" />
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
