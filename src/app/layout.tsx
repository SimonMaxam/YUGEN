import type { Metadata, Viewport } from "next";
import "./globals.css";
import { serif, sans } from "./fonts";
import { site } from "@/lib/site";
import { restaurantSchema, websiteSchema } from "@/lib/schema";
import { Providers } from "@/components/providers/Providers";
import { Nav } from "@/components/layout/Nav";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { Footer } from "@/components/layout/Footer";
import { ExperienceShell } from "@/components/experience/ExperienceShell";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Omakase Sushi & Cinematic Dining`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "omakase",
    "sushi",
    "fine dining",
    "Japanese restaurant",
    "San Francisco sushi",
    "tasting menu",
    "kaiseki",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Omakase Sushi & Cinematic Dining`,
    description: site.description,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — the omakase counter at golden hour`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Omakase Sushi & Cinematic Dining`,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/manifest.webmanifest",
  category: "restaurant",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f2ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0c0e" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

// Applies the saved theme (or the dark default) before paint to avoid a flash.
// Default is night/dark; visitors can switch and their choice is remembered.
const themeInit = `(function(){try{var p=localStorage.getItem("yugen-theme");var t;if(p&&p!=="auto"){t=p;}else if(p==="auto"){var h=new Date().getHours();t=(h>=5&&h<17)?"morning":(h>=17&&h<21)?"evening":"night";}else{t="night";}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","night");}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="night"
      suppressHydrationWarning
      className={`${serif.variable} ${sans.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(restaurantSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
      </head>
      <body>
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[10001] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:text-sm focus:text-bg"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main" className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
            {children}
          </main>
          <MobileBottomBar />
          <Footer />
          <ExperienceShell />
        </Providers>
      </body>
    </html>
  );
}
