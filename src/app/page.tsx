import { Hero } from "@/sections/Hero";
import { Awards } from "@/sections/Awards";
import { Story } from "@/sections/Story";
import { Chef } from "@/sections/Chef";
import { Signature } from "@/sections/Signature";
import { HomeExperience } from "@/sections/HomeExperience";
import { GalleryPreview } from "@/sections/GalleryPreview";
import { Testimonials } from "@/sections/Testimonials";
import { Newsletter } from "@/sections/Newsletter";
import { Visit } from "@/sections/Visit";
import { FAQ } from "@/sections/FAQ";
import { KanjiMarquee } from "@/components/ui/KanjiMarquee";
import { faqs } from "@/lib/faq";
import { faqSchema } from "@/lib/schema";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }}
      />
      <Hero />
      <Awards />
      <Story />
      <KanjiMarquee />
      <Chef />
      <Signature />
      <HomeExperience />
      <GalleryPreview />
      <Testimonials />
      <Newsletter />
      <FAQ />
      <Visit />
    </>
  );
}
