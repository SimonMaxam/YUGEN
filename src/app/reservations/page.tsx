import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ReservationForm } from "@/components/forms/ReservationForm";
import { FAQ } from "@/sections/FAQ";
import { Reveal } from "@/components/ui/Reveal";
import { experiences } from "@/lib/experiences";
import { site } from "@/lib/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { faqs } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Reservations — Book the Omakase Counter",
  description:
    "Reserve the chef's counter, garden window or private tatami room at YŪGEN. Choose your date, seating and occasion — we confirm within 24 hours.",
  alternates: { canonical: "/reservations" },
};

export default function ReservationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbSchema([
              { name: "Home", url: site.url },
              { name: "Reservations", url: `${site.url}/reservations` },
            ]),
            faqSchema(faqs),
          ]),
        }}
      />
      <PageHero
        kicker="Secure your seat"
        jp="予約"
        title="Reservations"
        lede="Seatings are intimate and limited. Tell us when you'd like to join us and how you like to sit, and our maître d' will confirm your table by email."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Reservations", href: "/reservations" },
        ]}
      />

      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 pb-10 md:grid-cols-[1.1fr_0.9fr] md:gap-20 md:px-10">
        <Reveal>
          <ReservationForm />
        </Reveal>

        <Reveal delay={1}>
          <aside className="flex flex-col gap-8">
            <div>
              <h2 className="kicker mb-4">Experiences</h2>
              <ul className="flex flex-col gap-5">
                {experiences.map((e) => (
                  <li key={e.id} className="border-b border-line/60 pb-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-serif text-xl text-ink">{e.name}</span>
                      <span className="shrink-0 text-sm text-accent">{e.price}</span>
                    </div>
                    <p className="mt-1 text-[0.7rem] uppercase tracking-wider2 text-faint">
                      {e.seat} · {e.courses}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{e.summary}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-line/60 bg-surface/40 p-6">
              <h2 className="kicker mb-3">Same-day & large parties</h2>
              <p className="text-sm leading-relaxed text-muted">
                For tonight or parties larger than six, please call us directly.
              </p>
              <a href={`tel:${site.phone}`} className="mt-3 inline-block font-serif text-2xl text-ink">
                {site.phoneDisplay}
              </a>
            </div>
          </aside>
        </Reveal>
      </div>

      <FAQ />
    </>
  );
}
