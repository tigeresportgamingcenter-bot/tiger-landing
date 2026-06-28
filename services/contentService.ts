import { branches } from "@/data/branches";
import { pcTiers } from "@/data/pcTiers";
import { pricing } from "@/data/pricing";
import { promotions } from "@/data/promotions";
import { socialLinks } from "@/data/socialLinks";
import { tournaments } from "@/data/tournaments";
import { communityHighlights, contactContent, heroContent, navigation, siteSettings } from "@/data/siteContent";
import type { SiteContent } from "@/types";

export async function getSiteContent(): Promise<SiteContent> {
  return {
    branches,
    pcTiers,
    pricing,
    promotions,
    tournaments,
    socialLinks,
    siteSettings,
    navigation,
    heroContent,
    communityHighlights,
    contactContent,
    featuredPromotion: promotions.find((promotion) => promotion.id === "combo-chien-than") ?? null,
  };
}
