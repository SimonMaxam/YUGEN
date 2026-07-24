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
      <HomeExperience />
      <GalleryPreview />
      <Testimonials />
      <Newsletter />
      <Visit />
    </>
  );
}
