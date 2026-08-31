import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { PortraitCard } from "@/components/about/PortraitCard";
import { site } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About the Developer — Simon Maxam",
  description:
    "YŪGEN was designed and built by Simon Maxam, a designer and developer in Calgary, Canada, specialising in web design, 3D visualisation and interactive experiences.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About the Developer — Simon Maxam",
    description:
      "The designer and developer behind the YŪGEN experience — web design, 3D visualisation and interactive storytelling.",
    url: `${site.url}/about`,
  },
};

const skillGroups: { label: string; jp: string; items: string[] }[] = [
  {
    label: "Architecture & 3D",
    jp: "立体",
    items: ["Revit", "Rhino 3D", "SketchUp", "Blender", "Unreal Engine 5"],
  },
  {
    label: "Visual design",
    jp: "意匠",
    items: ["Adobe Photoshop", "Adobe Illustrator"],
  },
  {
    label: "Web & interaction",
    jp: "実装",
    items: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Three.js",
      "Responsive Web Design",
      "UI / UX Design",
    ],
  },
];

const certificateGroups: {
  label: string;
  jp: string;
  items: { name: string; issuer: string; src: string }[];
}[] = [
  {
    label: "3D & Design",
    jp: "造形",
    items: [
      { name: "Revit to Unreal", issuer: "LinkedIn Learning", src: "/images/about/certificates/revit-to-unreal.png" },
      { name: "Revit MEP", issuer: "LinkedIn Learning", src: "/images/about/certificates/revit-2023-mep.png" },
      { name: "Unreal Lighting", issuer: "LinkedIn Learning", src: "/images/about/certificates/unreal-lighting.png" },
      { name: "Blender", issuer: "LinkedIn Learning", src: "/images/about/certificates/blender-4.png" },
      { name: "Illustrator", issuer: "LinkedIn Learning · Adobe", src: "/images/about/certificates/adobe-illustrator.png" },
      { name: "Photoshop", issuer: "LinkedIn Learning · Adobe", src: "/images/about/certificates/adobe-photoshop.png" },
      { name: "Premiere Pro", issuer: "LinkedIn Learning · Adobe", src: "/images/about/certificates/adobe-premiere.png" },
    ],
  },
  {
    label: "Development",
    jp: "開発",
    items: [
      { name: "Web Development", issuer: "LinkedIn Learning", src: "/images/about/certificates/html-css-js.png" },
      { name: "C++", issuer: "LinkedIn Learning", src: "/images/about/certificates/cpp-advanced.png" },
    ],
  },
  {
    label: "Data & AI",
    jp: "情報",
    items: [
      { name: "Machine Learning", issuer: "LinkedIn Learning", src: "/images/about/certificates/ai-foundations-ml.png" },
      { name: "AI Cybersecurity", issuer: "LinkedIn Learning", src: "/images/about/certificates/ai-agents-cybersecurity.png" },
      { name: "Prompt Engineering", issuer: "LinkedIn Learning", src: "/images/about/certificates/prompt-engineering.png" },
      { name: "Data Analysis", issuer: "LinkedIn Learning · Microsoft", src: "/images/about/certificates/data-analysis-microsoft.png" },
      { name: "Data Analytics", issuer: "LinkedIn Learning · IIBA", src: "/images/about/certificates/data-analytics-business.png" },
      { name: "Python for Finance", issuer: "LinkedIn Learning", src: "/images/about/certificates/python-finance.png" },
    ],
  },
  {
    label: "Business",
    jp: "経営",
    items: [
      { name: "SEO", issuer: "LinkedIn Learning", src: "/images/about/certificates/advanced-seo.png" },
      { name: "Project Management", issuer: "LinkedIn Learning · PMI", src: "/images/about/certificates/project-management.png" },
      { name: "Solution Sales", issuer: "LinkedIn Learning", src: "/images/about/certificates/solution-sales.png" },
    ],
  },
];

function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Simon Maxam",
    jobTitle: "Designer & Developer",
    url: `${site.url}/about`,
    image: `${site.url}/images/simon-maxam.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Calgary",
      addressRegion: "AB",
      addressCountry: "CA",
    },
    knowsAbout: [
      "Web Design",
      "3D Visualization",
      "Interactive Experiences",
      "Three.js",
      "UI/UX Design",
    ],
  };
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: site.url },
              { name: "About the Developer", url: `${site.url}/about` },
            ]),
          ),
        }}
      />

      <PageHero
        kicker="The maker"
        jp="作り手"
        title="Simon Maxam"
        lede="Designer & developer in Calgary, Alberta — crafting immersive digital experiences where design, technology and storytelling meet."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About the Developer", href: "/about" },
        ]}
      />

      <div className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10 md:pb-36">
        {/* Portrait + bio */}
        <div className="grid items-start gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <Reveal>
            <PortraitCard />
          </Reveal>

          <Reveal delay={1}>
            <div className="flex flex-col gap-6 text-base leading-relaxed text-muted md:text-lg">
              <p>
                Hi, I&apos;m <strong className="text-ink">Simon Maxam</strong>, a
                designer and developer based in{" "}
                <strong className="text-ink">Calgary, Alberta, Canada</strong>,
                with a passion for creating immersive digital experiences that
                combine design, technology and storytelling.
              </p>
              <p>
                I specialise in <em className="not-italic text-ink">web design</em>,{" "}
                <em className="not-italic text-ink">3D visualisation</em> and{" "}
                <em className="not-italic text-ink">interactive experiences</em>,
                blending creativity with modern development to build websites that
                feel memorable and engaging. My goal is to create digital
                experiences that are not only visually beautiful, but intuitive,
                high-performing and meaningful.
              </p>
              <p>
                Every page here was designed and developed with care — from the
                visual identity and interface to the animations and the responsive,
                performant experience.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Toolkit */}
        <section aria-label="Skills and tools" className="mt-24 md:mt-32">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" />
              <span className="kicker">The toolkit</span>
              <span className="font-jp text-sm text-muted">道具</span>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {skillGroups.map((group, gi) => (
              <Reveal key={group.label} delay={gi + 1}>
                <div>
                  <h2 className="flex items-baseline gap-2 font-serif text-xl text-ink">
                    {group.label}
                    <span className="font-jp text-sm text-faint">{group.jp}</span>
                  </h2>
                  <ul className="mt-5 flex flex-wrap gap-2.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-line/70 bg-surface/50 px-4 py-2 text-[0.72rem] uppercase tracking-wider2 text-muted transition-all duration-500 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* On YŪGEN */}
        <section aria-label="On YŪGEN" className="mt-24 md:mt-32">
          <div className="grid gap-10 md:grid-cols-[0.5fr_1fr] md:gap-16">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-accent/60" />
                <span className="kicker">On YŪGEN</span>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="flex flex-col gap-6 text-base leading-relaxed text-muted md:text-lg">
                <p>
                  For the YŪGEN experience I wanted to capture the elegance,
                  precision and artistry that define Japanese cuisine. Inspired by
                  the meaning of <span className="font-jp text-ink">幽玄</span>{" "}
                  <em className="not-italic text-ink">yūgen</em> — a profound sense
                  of beauty and mystery — I designed the site with clean layouts,
                  refined animations, immersive visuals and thoughtful interactions
                  that echo the restaurant&apos;s atmosphere and attention to detail.
                </p>
                <p>
                  From the walkable 3D room to the time-of-day lighting and the
                  ambient soundtrack, every detail is meant to leave a lasting
                  impression.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Guitar & performance */}
        <section aria-label="Guitar and performance" className="mt-24 md:mt-32">
          <div className="grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
            <Reveal>
              <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[1.6rem] border border-line/70 bg-surface/60 shadow-2xl shadow-black/30">
                <div className="relative aspect-[2/3] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/about/guitar-performance.webp"
                    alt="Simon Maxam playing acoustic guitar"
                    width={1400}
                    height={2100}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_55%,rgba(0,0,0,0.45))]" />
                  <span className="pointer-events-none absolute bottom-4 right-5 font-jp text-5xl text-white/25">
                    弦
                  </span>
                  <span className="pointer-events-none absolute bottom-4 left-5 text-[0.6rem] uppercase tracking-wider2 text-white/85">
                    Guitar · 7 yrs
                  </span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="flex flex-col gap-6 text-base leading-relaxed text-muted md:text-lg">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-accent/60" />
                  <span className="kicker">Off the clock</span>
                  <span className="font-jp text-sm text-muted">音楽</span>
                </div>
                <p>
                  Outside of design and code, guitar is my main instrument —
                  I play fingerstyle and lead worship as a volunteer musician
                  at church, with{" "}
                  <strong className="text-ink">300+ hours</strong> performed
                  over <strong className="text-ink">7 years</strong>.
                </p>
                <p>
                  It&apos;s the thread running through everything else I
                  build, from web projects to the studio itself — whether
                  I&apos;m on stage or at a keyboard, I&apos;m always chasing
                  the same thing: turning an idea into something you can
                  actually step into.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Beyond the studio */}
        <section aria-label="Beyond the studio" className="mt-24 md:mt-32">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" />
              <span className="kicker">Beyond the studio</span>
              <span className="font-jp text-sm text-muted">日常</span>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                src: "/images/about/double-bass.webp",
                alt: "Simon Maxam playing double bass",
                label: "Double bass",
                kanji: "低",
              },
              {
                src: "/images/about/basketball-friend.webp",
                alt: "Simon Maxam playing basketball with a friend",
                label: "Pickup basketball",
                kanji: "球",
              },
            ].map((shot, i) => (
              <Reveal key={shot.src} delay={i + 1}>
                <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-line/70 bg-surface/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    width={960}
                    height={1280}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_55%,rgba(0,0,0,0.45))]" />
                  <span className="pointer-events-none absolute bottom-4 right-5 font-jp text-4xl text-white/25">
                    {shot.kanji}
                  </span>
                  <span className="pointer-events-none absolute bottom-4 left-5 text-[0.6rem] uppercase tracking-wider2 text-white/85">
                    {shot.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Certificates */}
        <section aria-label="Certificates" className="mt-24 md:mt-32">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" />
              <span className="kicker">Always learning</span>
              <span className="font-jp text-sm text-muted">資格</span>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              Coursework completed across 3D, architecture, code and creative
              tools — mostly LinkedIn Learning, with a few from Adobe and
              Microsoft along the way.
            </p>
          </Reveal>

          <div className="mt-12 flex flex-col gap-14">
            {certificateGroups.map((group, gi) => (
              <div key={group.label}>
                <Reveal delay={gi}>
                  <h3 className="flex items-baseline gap-2 font-serif text-xl text-ink">
                    {group.label}
                    <span className="font-jp text-sm text-faint">{group.jp}</span>
                  </h3>
                </Reveal>
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {group.items.map((cert, ci) => (
                    <Reveal key={cert.name} delay={((gi + ci) % 3) + 1}>
                      <div className="group relative overflow-hidden rounded-xl border border-line/70 bg-surface/50 transition-all duration-500 hover:-translate-y-0.5 hover:border-accent/60">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cert.src}
                            alt={`${cert.name} certificate`}
                            width={640}
                            height={480}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        </div>
                        <div className="px-3 py-2.5">
                          <p className="text-xs font-medium leading-snug text-ink">
                            {cert.name}
                          </p>
                          <p className="mt-0.5 text-[0.65rem] uppercase tracking-wider2 text-faint">
                            {cert.issuer}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pull quote */}
        <Reveal>
          <blockquote className="mx-auto mt-24 max-w-3xl text-balance text-center font-serif text-3xl font-light leading-snug text-ink md:mt-32 md:text-5xl">
            “Great design is more than appearance — it&apos;s about creating
            experiences people remember.”
            <footer className="mt-8 text-[0.72rem] uppercase tracking-ultra text-accent">
              — Simon Maxam
            </footer>
          </blockquote>
        </Reveal>

        {/* CTAs */}
        <Reveal>
          <div className="mt-20 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-accent px-9 py-4 text-[0.72rem] uppercase tracking-wider2 text-bg transition-all duration-500 hover:brightness-110"
            >
              Return to YŪGEN
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-ink/25 px-9 py-4 text-[0.72rem] uppercase tracking-wider2 text-ink transition-all duration-500 hover:border-accent hover:text-accent"
            >
              Get in touch
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
