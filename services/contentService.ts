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
import { getSupabaseContent, getSupabaseTournamentBySlug } from "./supabaseContentService";
import type { TournamentEvent } from "@/types";

function getAvailableImage(image: ContentImage | null): ContentImage | null {
  if (!image) return null;
  const publicPath = join(process.cwd(), "public", image.src.replace(/^\//, ""));
  return existsSync(publicPath) ? image : null;
}

export async function getSiteContent(): Promise<SiteContent> {
  const fallback: SiteContent = {
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
    galleryItems: [],
    tournamentEvents: [],
    completedTournamentEvents: [],
  };

  try {
    const remote = await getSupabaseContent();
    if (!remote) return fallback;
    const remotePromotions = remote.promotions ?? fallback.promotions;
    return {
      ...fallback,
      branches: remote.branches ?? fallback.branches,
      promotions: remotePromotions,
      tournaments: remote.tournaments ?? fallback.tournaments,
      heroContent: { ...fallback.heroContent, image: remote.heroImage ?? fallback.heroContent.image },
      communityImage: remote.communityImage ?? fallback.communityImage,
      hallOfFame: remote.hallOfFame ?? fallback.hallOfFame,
      featuredPromotion: remote.featuredPromotion ?? remotePromotions.find((promotion) => promotion.featured) ?? fallback.featuredPromotion,
      galleryItems: remote.galleryItems ?? fallback.galleryItems,
      pcTiers: remote.pcTiers ?? fallback.pcTiers,
      tournamentEvents: remote.tournamentEvents ?? fallback.tournamentEvents,
      completedTournamentEvents: remote.completedTournamentEvents ?? fallback.completedTournamentEvents,
    };
  } catch {
    return fallback;
  }
}

export async function getPublishedTournamentBySlug(slug: string): Promise<TournamentEvent | null> {
  try {
    const remote = await getSupabaseTournamentBySlug(slug);
    if (remote) return remote;
  } catch {
    // Static fallback below keeps public pages available.
  }
  const staticTournament = hallOfFame.tournaments.find((item) => item.status === "verified" && item.id === slug);
  if (!staticTournament || !staticTournament.name) return null;
  return {
    id: staticTournament.id,
    slug: staticTournament.id,
    name: staticTournament.name,
    game: staticTournament.game,
    description: "",
    heldOn: staticTournament.heldOn,
    startsAt: null,
    endsAt: null,
    branchName: staticTournament.branchName,
    placements: staticTournament.placements,
    image: getAvailableImage(staticTournament.image),
    video: staticTournament.video,
    rules: null,
    entryFee: null,
    status: "completed",
    registrationUrl: null,
    registrationOpen: false,
    showInHallOfFame: staticTournament.showInHallOfFame,
    summaryTitle: null,
    summaryContent: null,
    highlights: [],
    facebookPostUrl: null,
  };
}
