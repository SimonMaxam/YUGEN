import Link from "next/link";
import { navLinks, site } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

export function Footer() {
  return (
    <footer className="relative border-t border-line/60 bg-surface/40">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <Reveal>
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl text-ink">{site.name}</span>
                <span className="font-jp text-lg text-muted">{site.nameJp}</span>
              </div>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                {site.description}
              </p>
              <div className="mt-8 flex gap-4">
                {Object.entries(site.social).map(([k, v]) => (
                  <a
                    key={k}
                    href={v}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.7rem] uppercase tracking-wider2 text-muted transition-colors hover:text-accent"
                  >
                    {k}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div>
              <h2 className="kicker mb-5">Explore</h2>
              <ul className="flex flex-col gap-3">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div>
              <h2 className="kicker mb-5">Visit</h2>
              <address className="flex flex-col gap-3 not-italic text-sm text-muted">
                <span>
                  {site.address.street}
                  <br />
                  {site.address.district}, {site.address.city} {site.address.region}
                </span>
                <a href={`tel:${site.phone}`} className="transition-colors hover:text-ink">
                  {site.phoneDisplay}
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-ink"
                >
                  {site.email}
                </a>
              </address>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line/60 pt-8 text-[0.68rem] uppercase tracking-wider2 text-faint md:flex-row md:items-center">
          <span>
            © {new Date().getFullYear()} {site.name}. Crafted with intention.
          </span>

          <Link
            href="/about"
            className="group inline-flex items-center gap-2 transition-colors hover:text-ink"
            aria-label="About the developer, Simon Maxam"
          >
            <span>Designed &amp; built by</span>
            <span className="text-muted transition-colors group-hover:text-accent">
              Simon Maxam
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              aria-hidden
              className="text-accent transition-transform duration-500 group-hover:scale-125"
            >
              <path
                d="M12 21s-7.2-4.6-9.6-9C1 9 2.6 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.4 0 5 3.5 3.6 6.5-2.4 4.4-9.6 9-9.6 9z"
                fill="currentColor"
              />
            </svg>
          </Link>

          <span className="font-jp">一期一会 · ichigo ichie</span>
        </div>
      </div>
    </footer>
  );
}
