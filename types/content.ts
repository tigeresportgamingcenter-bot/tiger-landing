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
}

export interface Tournament {
  id: string;
  game: string;
  description: string;
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
}
