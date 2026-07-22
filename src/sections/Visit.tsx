import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

export function Visit() {
  const mapSrc = `https://www.google.com/maps?q=${site.geo.latitude},${site.geo.longitude}&z=15&output=embed`;

  return (
    <section
      id="visit"
      aria-label="Visit us"
      className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36"
    >
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <SectionHeading kicker="Find us" jp="場所" title="Visit YŪGEN" />

          <Reveal delay={1}>
            <div className="mt-10 flex flex-col gap-8">
              <div>
                <h3 className="text-[0.62rem] uppercase tracking-wider2 text-faint">
                  Address
                </h3>
                <address className="mt-3 not-italic font-serif text-2xl leading-snug text-ink">
                  {site.address.street}
                  <br />
                  {site.address.district}, {site.address.city} {site.address.region}{" "}
                  {site.address.postalCode}
                </address>
              </div>

              <div>
                <h3 className="text-[0.62rem] uppercase tracking-wider2 text-faint">
                  Seatings
                </h3>
                <dl className="mt-3 flex flex-col gap-2">
                  {site.hours.map((h) => (
                    <div key={h.day} className="flex justify-between gap-6 border-b border-line/50 pb-2 text-sm">
                      <dt className="text-muted">{h.day}</dt>
                      <dd className="text-ink">{h.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex flex-wrap gap-6">
                <a href={`tel:${site.phone}`} className="ink-underline text-sm text-ink">
                  {site.phoneDisplay}
                </a>
                <a href={`mailto:${site.email}`} className="ink-underline text-sm text-ink">
                  {site.email}
                </a>
              </div>

              <Link
                href="/reservations"
                className="inline-flex w-fit rounded-full bg-accent px-9 py-4 text-[0.72rem] uppercase tracking-wider2 text-bg transition-all duration-500 hover:brightness-110"
              >
                Reserve a table
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={1}>
          <div className="relative h-full min-h-[380px] overflow-hidden rounded-3xl border border-line/60">
            <iframe
              title={`Map to ${site.name}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full grayscale-[0.3] contrast-[1.05]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
