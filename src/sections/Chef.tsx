import { Reveal } from "@/components/ui/Reveal";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { Photo } from "@/components/ui/Photo";

export function Chef() {
  return (
    <section
      id="chef"
      aria-label="Meet the chef"
      className="relative overflow-hidden border-y border-line/60 bg-surface/30 py-24 md:py-36"
    >
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 md:grid-cols-[0.9fr_1.1fr] md:gap-20 md:px-10">
        <Reveal>
          <div className="relative">
            <Photo
              src="/images/chef-portrait.jpg"
              alt="Chef Arata Mizuno, executive itamae, standing behind the hinoki counter in an indigo chef's jacket"
              kanji="板前"
              className="aspect-[3/4]"
            />
            <div className="glass absolute -bottom-5 -right-4 rounded-2xl px-5 py-4 md:-right-8">
              <p className="font-serif text-2xl text-ink">Arata Mizuno</p>
              <p className="mt-1 text-[0.62rem] uppercase tracking-wider2 text-muted">
                Executive Chef · Itamae
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" />
              <span className="kicker">The hand behind the counter</span>
              <span className="font-jp text-sm text-muted">板前</span>
            </div>
          </Reveal>

          <AnimatedHeading
            text="Twenty years learning to do less."
            className="mt-6 text-fluid-h2 leading-[1.05] text-ink"
          />

          <Reveal delay={1}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              Trained in Kanazawa and Tokyo before the counters of Sukiyabashi,
              Chef Arata treats each service as a single conversation — reading
              the room, the season and the fish, then composing in real time.
              His cuts are quiet; his timing is not.
            </p>
          </Reveal>

          <Reveal delay={2}>
            <blockquote className="mt-10 border-l-2 border-accent/60 pl-6">
              <p className="font-serif text-2xl italic leading-relaxed text-ink md:text-3xl">
                “I am not cooking for you. I am cooking with the day you walked in
                on.”
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {[
                "James Beard — Chef of the Year",
                "Trained under Jiro-lineage masters",
                "Toyosu market, every dawn",
              ].map((t) => (
                <span key={t} className="text-sm text-muted">
                  — {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
