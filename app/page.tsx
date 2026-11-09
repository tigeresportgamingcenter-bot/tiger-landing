import { ArenaSection } from "@/components/sections/ArenaSection";
import { ComplaintSection } from "@/components/sections/ComplaintSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { DealsSection } from "@/components/sections/DealsSection";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { MobileCtaBar } from "@/components/sections/MobileCtaBar";
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
        <DealsSection tiers={content.pcTiers} pricing={content.pricing} promotions={content.promotions} upcomingPromotions={content.upcomingPromotions} actionHref={contactAction} />
        <ArenaSection events={content.tournamentEvents} completedEvents={content.completedTournamentEvents} hallOfFame={content.hallOfFame} leaderboard={content.leaderboard} branches={content.branches} games={content.tournaments} galleryItems={content.galleryItems} communityUrl={content.socialLinks.facebook} />
        <ComplaintSection hotline={hotline} />
        <ContactSection socialLinks={content.socialLinks} content={content.contactContent} image={contactImage} faqItems={content.faqItems} />
      </main>
      <Footer />
      <MobileCtaBar socialLinks={content.socialLinks} />
    </>
  );
}
