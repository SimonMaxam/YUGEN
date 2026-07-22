import { Reveal } from "@/components/ui/Reveal";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { Plate } from "@/components/ui/Plate";
import { site } from "@/lib/site";

export function Story() {
  return (
    <section
      id="story"
      aria-label="Our story"
      className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36"
    >
      <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
        <div className="order-2 md:order-1">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" />
              <span className="kicker">The philosophy</span>
              <span className="font-jp text-sm text-muted">物語</span>
            </div>
          </Reveal>

          <AnimatedHeading
            text="A meal measured in stillness, not courses."
            className="mt-6 text-fluid-h2 leading-[1.05] text-ink"
          />

          <Reveal delay={1}>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-muted md:text-lg">
              {site.concept} We built {site.name} around that single idea — that
              the most beautiful things are felt at the edge of perception: the
              warmth of rice at body temperature, the hush before the first
              piece, the light softening over the counter as evening falls.
            </p>
          </Reveal>

          <Reveal delay={2}>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted md:text-lg">
              Every element — the hinoki wood, the concrete, the single seasonal
              branch — is chosen and then quietened, until only the essential
              remains.
            </p>
          </Reveal>

          <Reveal delay={3}>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line/60 pt-8">
              {[
                { k: "Est.", v: site.founded },
                { k: "Seats", v: "18" },
                { k: "Courses", v: "17" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="text-[0.62rem] uppercase tracking-wider2 text-faint">
                    {s.k}
                  </dt>
                  <dd className="mt-2 font-serif text-3xl text-ink">{s.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="order-1 grid grid-cols-2 gap-4 md:order-2">
          <Reveal className="col-span-2">
            <Plate tone="wood" kanji="旬" label="The counter, at dusk" className="aspect-[16/10]" />
          </Reveal>
          <Reveal delay={1}>
            <Plate tone="salmon" kanji="鮭" label="Aged salmon belly" className="aspect-square" />
          </Reveal>
          <Reveal delay={2}>
            <Plate tone="ceramic" kanji="器" label="Hand-thrown ceramics" className="aspect-square" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
