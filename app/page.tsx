import { BranchesSection } from "@/components/sections/BranchesSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { HallOfFameSection } from "@/components/sections/HallOfFameSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { CompletedTournamentsSection, TournamentEventsSection } from "@/components/sections/TournamentEventsSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PcTiersSection } from "@/components/sections/PcTiersSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { PromotionsSection } from "@/components/sections/PromotionsSection";
import { MobileCtaBar } from "@/components/sections/MobileCtaBar";
import { getSiteContent } from "@/services/contentService";

export const revalidate = 60;

export default async function HomePage() {
  const content = await getSiteContent();
  const hotline = content.socialLinks.hotline;
  if (!hotline) throw new Error("Hotline is required for conversion actions.");
  const contactAction = content.socialLinks.zalo ?? `tel:${hotline}`;
  return <><Header navigation={content.navigation} siteSettings={content.siteSettings} hotline={hotline} /><main><HeroSection content={content.heroContent} branchCount={content.branches.length} tierCount={content.pcTiers.length} hotline={hotline} /><BranchesSection branches={content.branches} fallbackPhone={hotline} /><PromotionsSection promotions={content.promotions} upcomingPromotions={content.upcomingPromotions} actionHref={contactAction} /><PricingSection pricing={content.pricing} actionHref={contactAction} /><PcTiersSection tiers={content.pcTiers} /><TournamentEventsSection events={content.tournamentEvents} /><CompletedTournamentsSection events={content.completedTournamentEvents} /><HallOfFameSection content={content.hallOfFame} communityUrl={content.socialLinks.facebook} /><CommunitySection tournaments={content.tournaments} highlights={content.communityHighlights} image={content.communityImage} /><GallerySection items={content.galleryItems} /><ContactSection socialLinks={content.socialLinks} content={content.contactContent} /></main><Footer /><MobileCtaBar socialLinks={content.socialLinks} /></>;
}
