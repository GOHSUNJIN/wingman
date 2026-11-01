import { BeforeAfter } from "@/components/home/before-after";
import { FinalCta } from "@/components/home/final-cta";
import { FitCheck } from "@/components/home/fit-check";
import { HeroWindow } from "@/components/home/hero-window";
import { HowItWorks } from "@/components/home/how-it-works";
import { Lookbook } from "@/components/home/lookbook";
import { OccasionMarquee } from "@/components/home/occasion-marquee";
import { PiecesGrid } from "@/components/home/pieces-grid";
import { PrivacyBand } from "@/components/home/privacy-band";
import { SiteFooter } from "@/components/home/site-footer";
import { Reveal } from "@/components/shared/reveal";
import { BEFORE, OCCASION_LOOKS } from "@/components/home/looks-data";

export default function Home() {
  return (
    <>
      <main className="overflow-x-clip">
        <HeroWindow before={BEFORE} after={OCCASION_LOOKS.wedding.render} alt="Man in a navy blazer" />
        <OccasionMarquee />
        <Lookbook />
        <FitCheck />
        <HowItWorks />
        <BeforeAfter />
        <PiecesGrid />
        <PrivacyBand />
        <FinalCta />
      </main>
      <SiteFooter />
      <Reveal />
    </>
  );
}
