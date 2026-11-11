import { PointerEffects } from "@/components/ui/PointerEffects";
import { SectionDots } from "@/components/ui/SectionDots";
import { SpaceSection } from "@/components/sections/SpaceSection";
import { spaceVideos } from "@/data/spaceVideos";
import { TickerBand } from "@/components/sections/TickerBand";
import { SectionRouter } from "@/components/ui/SectionRouter";
import { SECTION_IDS } from "@/lib/sections";
import { RippleEffect } from "@/components/ui/RippleEffect";
import { BackToTop } from "@/components/ui/BackToTop";
import { ArenaSection } from "@/components/sections/ArenaSection";
import { ComplaintSection } from "@/components/sections/ComplaintSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { DealsSection } from "@/components/sections/DealsSection";
import { Footer } from "@/components/sections/Footer";
import { GearSection } from "@/components/sections/GearSection";
import { Header } from "@/components/sections/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { MobileCtaBar } from "@/components/sections/MobileCtaBar";
import { formatHourlyPrice } from "@/lib/formatPrice";
import { getSiteContent } from "@/services/contentService";

export const revalidate = 60;

export default async function HomePage() {
  const content = await getSiteContent();
  const hotline = content.socialLinks.hotline;
  if (!hotline) throw new Error("Hotline is required for conversion actions.");
  const contactAction = content.socialLinks.zalo ?? `tel:${hotline}`;
  const minPricePerHour = content.pricing.length ? Math.min(...content.pricing.map((plan) => plan.pricePerHour)) : null;
  const contactImage = content.branches.find((branch) => branch.image)?.image ?? content.heroContent.image;
  return (
    <>
      <Header navigation={content.navigation} siteSettings={content.siteSettings} hotline={hotline} />
      <main>
        <HeroSection content={content.heroContent} branches={content.branches} minPricePerHour={minPricePerHour} hotline={hotline} />
        <TickerBand items={[...content.heroContent.facts, ...(minPricePerHour ? [`Giá từ ${formatHourlyPrice(minPricePerHour)}/giờ`] : []), ...content.branches.map((branch) => branch.name)]} />
        <DealsSection tiers={content.pcTiers} pricing={content.pricing} promotions={content.promotions} upcomingPromotions={content.upcomingPromotions} actionHref={contactAction} />
        <GearSection items={content.gearItems} actionHref={contactAction} />
        <SpaceSection videos={spaceVideos} />
        <ArenaSection events={content.tournamentEvents} completedEvents={content.completedTournamentEvents} hallOfFame={content.hallOfFame} leaderboard={content.leaderboard} branches={content.branches} games={content.tournaments} galleryItems={content.galleryItems} communityUrl={content.socialLinks.facebook} />
        <ComplaintSection formUrl={content.socialLinks.complaintForm} hotline={hotline} zaloHref={content.socialLinks.zalo} />
        <ContactSection socialLinks={content.socialLinks} content={content.contactContent} image={contactImage} faqItems={content.faqItems} />
      </main>
      <Footer />
      <SectionRouter ids={SECTION_IDS} />
      <PointerEffects />
      <SectionDots navigation={content.navigation} />
      <RippleEffect />
      <BackToTop />
      <MobileCtaBar socialLinks={content.socialLinks} />
    </>
  );
}
