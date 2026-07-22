import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { MenuList } from "@/components/menu/MenuList";
import { site } from "@/lib/site";
import { menuSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Menu — Omakase, Nigiri, Sashimi & Sake",
  description:
    "Explore the YŪGEN menu: seasonal omakase, nigiri, sashimi, hand rolls, warm plates, desserts and a sake-forward cellar.",
  alternates: { canonical: "/menu" },
  openGraph: {
    title: "The YŪGEN Menu",
    description:
      "Seasonal omakase, nigiri, sashimi and a sake-forward cellar, composed at the counter.",
    url: `${site.url}/menu`,
  },
};

export default function MenuPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: site.url },
              { name: "Menu", url: `${site.url}/menu` },
            ]),
          ),
        }}
      />
      <PageHero
        kicker="The carte"
        jp="献立"
        title="Menu"
        lede="Our list changes with the market and the season. Prices are per piece or per plate; the full omakase progression is served only at the counter."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Menu", href: "/menu" },
        ]}
      />
      <MenuList />
    </>
  );
}
