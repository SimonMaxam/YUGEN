import { Hero } from "@/sections/Hero";
import { Awards } from "@/sections/Awards";
import { Story } from "@/sections/Story";
import { Chef } from "@/sections/Chef";
import { Signature } from "@/sections/Signature";
import { Experience } from "@/sections/Experience";
import { GalleryPreview } from "@/sections/GalleryPreview";
import { Testimonials } from "@/sections/Testimonials";
import { Newsletter } from "@/sections/Newsletter";
import { Visit } from "@/sections/Visit";
import { KanjiMarquee } from "@/components/ui/KanjiMarquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Awards />
      <Story />
      <KanjiMarquee />
      <Chef />
      <Signature />
      <Experience />
      <GalleryPreview />
      <Testimonials />
      <Newsletter />
      <Visit />
    </>
  );
}
