import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact — Reach the YŪGEN Team",
  description:
    "Questions, press, private events or partnerships? Contact YŪGEN by form, phone or email. Find our address, hours and social channels.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const mapSrc = `https://www.google.com/maps?q=${site.geo.latitude},${site.geo.longitude}&z=15&output=embed`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: site.url },
              { name: "Contact", url: `${site.url}/contact` },
            ]),
          ),
        }}
      />
      <PageHero
        kicker="Say hello"
        jp="連絡"
        title="Contact"
        lede="For reservations use the booking page; for everything else — press, private events, partnerships or a simple question — write to us here."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />

      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 pb-28 md:grid-cols-[1fr_1fr] md:gap-20 md:px-10">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={1}>
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="kicker mb-2">Call</h2>
                <a href={`tel:${site.phone}`} className="text-lg text-ink hover:text-accent">
                  {site.phoneDisplay}
                </a>
              </div>
              <div>
                <h2 className="kicker mb-2">Email</h2>
                <a href={`mailto:${site.email}`} className="text-lg text-ink hover:text-accent">
                  {site.email}
                </a>
              </div>
              <div>
                <h2 className="kicker mb-2">Visit</h2>
                <address className="not-italic text-sm text-muted">
                  {site.address.street}
                  <br />
                  {site.address.district}, {site.address.city} {site.address.region}
                </address>
              </div>
              <div>
                <h2 className="kicker mb-2">Follow</h2>
                <div className="flex flex-col gap-1">
                  {Object.entries(site.social).map(([k, v]) => (
                    <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="text-sm text-muted capitalize hover:text-accent">
                      {k}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative h-72 overflow-hidden rounded-3xl border border-line/60">
              <MapEmbed title={`Map to ${site.name}`} src={mapSrc} />
            </div>

            <div>
              <h2 className="kicker mb-3">Hours</h2>
              <dl className="flex flex-col gap-2">
                {site.hours.map((h) => (
                  <div key={h.day} className="flex justify-between gap-6 border-b border-line/50 pb-2 text-sm">
                    <dt className="text-muted">{h.day}</dt>
                    <dd className="text-ink">{h.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
