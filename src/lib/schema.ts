import { site } from "./site";
import { menu } from "./menu";

/** Restaurant + LocalBusiness schema for rich results. */
export function restaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${site.url}/#restaurant`,
    name: site.name,
    alternateName: site.nameJp,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    priceRange: site.priceRange,
    servesCuisine: site.cuisine as unknown as string[],
    acceptsReservations: "True",
    image: [`${site.url}/og.jpg`],
    logo: `${site.url}/icon.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification: site.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [site.social.instagram, site.social.twitter, site.social.facebook],
    hasMenu: `${site.url}/menu`,
  };
}

/** Full Menu schema. */
export function menuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${site.name} Menu`,
    hasMenuSection: menu.map((cat) => ({
      "@type": "MenuSection",
      name: cat.name,
      description: cat.blurb,
      hasMenuItem: cat.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        description: item.description,
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: "USD",
        },
      })),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: "en",
  };
}
