export interface ContentImage {
  src: string;
  alt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: ContentImage;
}

export interface Branch {
  id: string;
  name: string;
  area: string;
  address: string;
  mapUrl: string | null;
  phone: string | null;
  openingHours: string | null;
  status: "active" | "temporarily-closed" | "unverified";
  description: string;
  image: ContentImage | null;
}

export interface PcTier {
  id: string;
  name: string;
  cpu: string;
  gpu: string;
  ram: string;
  monitor: string;
  description: string;
}

export interface PricingPlan {
  tierId: string;
  tier: string;
  pricePerHour: number;
  note: string;
  featured?: boolean;
  branchIds: string[];
  validFrom: string | null;
  validUntil: string | null;
  promotionStatus: "standard" | "promotional" | "unverified";
}

export interface Promotion {
  id: string;
  name: string;
  price: number;
  highlights: string[];
  note: string;
  featured: boolean;
  image: ContentImage | null;
}

export interface Tournament {
  id: string;
  game: string;
  description: string;
}

export type SupportedGame = "FC Online" | "Valorant" | "TFT" | "AOE";
export type HallOfFameStatus = "verified" | "placeholder";
export type MemberTier = "Diamond" | "Platinum" | "Gold";

export interface ChampionPlacement {
  position: 1 | 2 | 3;
  displayName: string;
}

export interface HallOfFameTournament {
  id: string;
  status: HallOfFameStatus;
  name: string | null;
  game: SupportedGame;
  heldOn: string | null;
  branchName: string | null;
  placements: ChampionPlacement[];
  image: ContentImage | null;
}

export interface HonoredMember {
  id: string;
  status: HallOfFameStatus;
  displayName: string | null;
  tier: MemberTier | null;
  periodLabel: string | null;
  consentConfirmed: boolean;
  image: ContentImage | null;
}

export interface HallOfFameContent {
  tournaments: HallOfFameTournament[];
  members: HonoredMember[];
  consentNotice: string;
}

export interface SocialLinks {
  facebook: string;
  zalo: string | null;
  hotline: string | null;
  googleMaps: string | null;
}

export interface SiteSettings {
  brandName: string;
  locale: string;
  primaryActionLabel: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  supportingText: string;
  readinessLabel: string;
  image: ContentImage | null;
}

export interface CommunityHighlight {
  id: string;
  title: string;
  description: string;
  icon: "trophy" | "users";
}

export interface ContactContent {
  eyebrow: string;
  titleLines: string[];
  facebookLabel: string;
  zaloLabel: string;
  mapsLabel: string;
  hotlineLabel: string;
}

export interface SiteContent {
  branches: Branch[];
  pcTiers: PcTier[];
  pricing: PricingPlan[];
  promotions: Promotion[];
  tournaments: Tournament[];
  socialLinks: SocialLinks;
  siteSettings: SiteSettings;
  navigation: NavigationItem[];
  heroContent: HeroContent;
  communityHighlights: CommunityHighlight[];
  contactContent: ContactContent;
  featuredPromotion: Promotion | null;
  communityImage: ContentImage | null;
  hallOfFame: HallOfFameContent;
  galleryItems: GalleryItem[];
}
