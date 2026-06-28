import { existsSync } from "node:fs";
import { join } from "node:path";
import { branches } from "@/data/branches";
import { hallOfFame } from "@/data/hallOfFame";
import { pcTiers } from "@/data/pcTiers";
import { pricing } from "@/data/pricing";
import { promotions } from "@/data/promotions";
import { socialLinks } from "@/data/socialLinks";
import { tournaments } from "@/data/tournaments";
import { communityHighlights, communityImage, contactContent, heroContent, navigation, siteSettings } from "@/data/siteContent";
import type { ContentImage, SiteContent } from "@/types";

function getAvailableImage(image: ContentImage | null): ContentImage | null {
  if (!image) return null;
  const publicPath = join(process.cwd(), "public", image.src.replace(/^\//, ""));
  return existsSync(publicPath) ? image : null;
}

export async function getSiteContent(): Promise<SiteContent> {
  return {
    branches: branches.map((branch) => ({ ...branch, image: getAvailableImage(branch.image) })),
    pcTiers,
    pricing,
    promotions,
    tournaments,
    socialLinks,
    siteSettings,
    navigation,
    heroContent: { ...heroContent, image: getAvailableImage(heroContent.image) },
    communityHighlights,
    contactContent,
    featuredPromotion: promotions.find((promotion) => promotion.id === "combo-chien-than") ?? null,
    communityImage: getAvailableImage(communityImage),
    hallOfFame: {
      ...hallOfFame,
      tournaments: hallOfFame.tournaments.map((tournament) => ({ ...tournament, image: getAvailableImage(tournament.image) })),
      members: hallOfFame.members.map((member) => ({ ...member, image: getAvailableImage(member.image) })),
    },
  };
}
