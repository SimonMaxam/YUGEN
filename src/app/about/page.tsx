import type { Metadata } from "next";
import Link from "next/link";
import { DevHero } from "@/components/about/DevHero";
import { Reveal } from "@/components/ui/Reveal";
import { PortraitCard } from "@/components/about/PortraitCard";
import { CertificatesShowcase } from "@/components/about/CertificatesShowcase";
import { certificates } from "@/lib/certificates";
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

const focus: { title: string; body: string; tools: string; color: string }[] = [
  {
    title: "Web & apps",
    body: "Immersive websites and web apps that feel like experiences, not pages.",
    tools: "Next.js · React · Three.js · TypeScript",
    color: "#8b5cf6",
  },
  {
    title: "3D & visualisation",
    body: "Real-time 3D rooms, products and worlds, like the walkable YŪGEN dining room.",
    tools: "Blender · Unreal Engine 5 · Revit",
    color: "#22d3ee",
  },
  {
    title: "Design",
    body: "Visual identity, interface and motion, from first sketch to shipped page.",
    tools: "Photoshop · Illustrator · UI / UX",
    color: "#f59e0b",
  },
  {
    title: "Cloud & AI",
    body: "Certified by AWS, Google and IBM in cloud, data and AI. Every card below opens the real certificate.",
    tools: "AWS · Python · PyTorch · LangChain",
    color: "#34d399",
  },
];

const profiles = [
  { label: "GitHub", href: "https://github.com/wolliom" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/simonmaxam/" },
  { label: "Instagram", href: "https://www.instagram.com/simonmaxam/" },
];

function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Simon Maxam",
    givenName: "Simon",
    familyName: "Maxam",
    jobTitle: "Founder of Dokeon, Web Developer, 3D Artist and Designer",
    url: `${site.url}/about`,
    sameAs: profiles.map((x) => x.href),
    worksFor: { "@type": "Organization", name: "Dokeon", url: "https://dokeon.pages.dev" },
    hasCredential: certificates.map((c) => {
      const v = c.blurb.match(/coursera\.org\/verify\/\S+/);
      return {
        "@type": "EducationalOccupationalCredential",
        name: c.title,
        credentialCategory:
          c.kind === "professional-certificate" ? "Professional Certificate" : "Certificate",
        recognizedBy: { "@type": "Organization", name: c.issuer.split(" · ")[0] },
        ...(v ? { url: `https://${v[0].replace(/[.)]+$/, "")}` } : {}),
      };
    }),
    image: `${site.url}/images/simon-maxam.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Calgary",
      addressRegion: "AB",
      addressCountry: "CA",
    },
    knowsAbout: [
      "Web Design",
      "Web Development",
      "3D Visualization",
      "Interactive Experiences",
      "Three.js",
      "Next.js",
      "UI/UX Design",
      "Cloud Architecture on AWS",
      "Digital Marketing",
      "Python",
      "Deep Learning",
      "Generative AI",
      "Guitar",
    ],
  };
}

export default function AboutPage() {
  return (
    <div className="maker-theme">
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

      <DevHero />

      <div className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10 md:pb-36">
        {/* Big statement, then the portrait */}
        <Reveal>
          <p className="max-w-5xl font-sans text-[clamp(1.9rem,5vw,4.2rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink">
            Web developer, 3D artist and designer in Calgary. Founder of{" "}
            <a
              href="https://dokeon.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-4 underline-offset-8 hover:text-muted"
            >
              Dokeon
            </a>
            .
          </p>
        </Reveal>

        <div className="mt-16 grid items-start gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <Reveal>
            <PortraitCard />
          </Reveal>

          <Reveal delay={1}>
            <div className="flex flex-col gap-6 text-base leading-relaxed text-muted md:text-lg">
              <p>
                I&apos;m <strong className="text-ink">Simon Maxam</strong>. I build
                immersive websites that mix design, technology and storytelling, and
                I run Dokeon, a creative and marketing agency.
              </p>
              <p>
                My goal is simple: sites that look great, load fast and make people
                remember you. Every page here, from the 3D room to the sound, was
                designed and built by me.
              </p>
              <dl className="grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
                {[
                  { k: "Based in", v: "Calgary" },
                  { k: "Guitar", v: "7 yrs" },
                  { k: "Performed", v: "300+ hrs" },
                  { k: "Certificates", v: `${certificates.length}` },
                ].map((x) => (
                  <div key={x.k}>
                    <dt className="text-[0.62rem] uppercase tracking-wider2 text-faint">{x.k}</dt>
                    <dd className="mt-1 font-sans text-3xl font-extrabold tracking-tight text-ink">{x.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap items-center gap-3">
                {profiles.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="rounded-full border border-ink/40 px-5 py-2.5 text-[0.68rem] font-extrabold uppercase tracking-wider2 text-ink transition-colors hover:bg-ink hover:text-bg"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* What I do: a plain numbered list */}
        <ol className="mt-24 border-t border-line">
          {focus.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) + 1}>
              <li className="grid gap-3 border-b border-line py-7 md:grid-cols-[4rem_1fr_1.2fr_1fr] md:items-baseline md:gap-8">
                <span className="font-sans text-sm font-extrabold text-faint">0{i + 1}</span>
                <h2 className="font-sans text-3xl font-extrabold uppercase tracking-[-0.02em] text-ink md:text-4xl">
                  {f.title}
                </h2>
                <p className="text-sm leading-snug text-muted md:text-base">{f.body}</p>
                <p className="text-[0.6rem] uppercase tracking-wider2 text-faint md:text-right">{f.tools}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>

      {/* Credentials sit right under the intro, not at the bottom of the page */}
      <CertificatesShowcase />

      <div className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10 md:pb-36">

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
    </div>
  );
}
