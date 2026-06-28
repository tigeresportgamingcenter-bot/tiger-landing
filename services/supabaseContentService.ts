import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/config";
import type { Branch, ChampionPlacement, ContentImage, GalleryItem, HallOfFameContent, HallOfFameTournament, HonoredMember, MemberTier, Promotion, SupportedGame, Tournament } from "@/types";

export interface SupabaseContent {
  branches?: Branch[];
  promotions?: Promotion[];
  tournaments?: Tournament[];
  hallOfFame?: HallOfFameContent;
  heroImage?: ContentImage;
  communityImage?: ContentImage;
  galleryItems?: GalleryItem[];
  featuredPromotion?: Promotion;
}

const games: SupportedGame[] = ["FC Online", "Valorant", "TFT", "AOE"];
const memberTiers: MemberTier[] = ["Diamond", "Platinum", "Gold"];

function safeImage(src: unknown, alt: unknown): ContentImage | null {
  if (typeof src !== "string" || typeof alt !== "string" || !alt.trim()) return null;
  if (src.startsWith("/images/")) return { src, alt };
  try {
    const url = new URL(src);
    if (url.protocol === "https:" && url.hostname.endsWith(".supabase.co") && url.pathname.startsWith("/storage/v1/object/public/")) return { src, alt };
  } catch {
    return null;
  }
  return null;
}

function safePlacements(value: unknown): ChampionPlacement[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is ChampionPlacement => {
    if (!item || typeof item !== "object") return false;
    const row = item as Record<string, unknown>;
    return (row.position === 1 || row.position === 2 || row.position === 3) && typeof row.displayName === "string" && Boolean(row.displayName.trim());
  }).slice(0, 3);
}

export async function getSupabaseContent(): Promise<SupabaseContent | null> {
  if (!isSupabaseConfigured()) return null;
  const { url, key } = getSupabaseConfig();
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const [branchResult, promotionResult, tournamentResult, memberResult, imageResult, galleryResult] = await Promise.all([
    supabase.from("branches").select("*").eq("published", true).eq("verified", true).order("sort_order"),
    supabase.from("promotions").select("slug,name,price,highlights,note,image_url,featured,valid_from,valid_until").eq("published", true).eq("verified", true).or(`valid_from.is.null,valid_from.lte.${today}`).or(`valid_until.is.null,valid_until.gte.${today}`).order("featured", { ascending: false }).order("created_at", { ascending: false }),
    supabase.from("tournaments").select("*").eq("published", true).eq("verified", true).order("held_on", { ascending: false }),
    supabase.from("hall_of_fame_members").select("*").eq("published", true).eq("verified", true).eq("consent_confirmed", true).order("created_at", { ascending: false }),
    supabase.from("site_images").select("*").eq("published", true).eq("verified", true),
    supabase.from("gallery_items").select("*").eq("published", true).eq("verified", true).order("sort_order"),
  ]);

  const branches: Branch[] = (branchResult.error ? [] : branchResult.data ?? []).map((row) => ({
    id: row.slug,
    name: row.name,
    area: row.area,
    address: row.address,
    mapUrl: row.map_url,
    phone: row.phone,
    openingHours: row.opening_hours,
    status: row.status,
    description: row.description,
    image: safeImage(row.image_url, row.image_alt || `Không gian tại ${row.name}`),
  }));
  const promotions: Promotion[] = (promotionResult.error ? [] : promotionResult.data ?? []).map((row) => ({ id: row.slug, name: row.name, price: row.price, highlights: Array.isArray(row.highlights) ? row.highlights.filter((item: unknown): item is string => typeof item === "string") : [], note: row.note, featured: Boolean(row.featured), image: safeImage(row.image_url, `Ảnh khuyến mãi ${row.name}`) }));
  const tournamentRows = (tournamentResult.error ? [] : tournamentResult.data ?? []).filter((row) => games.includes(row.game as SupportedGame));
  const tournaments: Tournament[] = tournamentRows.map((row) => ({ id: row.slug, game: row.game, description: row.description }));
  const hallTournaments: HallOfFameTournament[] = tournamentRows.map((row) => ({ id: row.slug, status: "verified", name: row.name, game: row.game as SupportedGame, heldOn: row.held_on, branchName: row.branch_name, placements: safePlacements(row.placements), image: safeImage(row.image_url, row.image_alt || `Giải đấu ${row.name}`) }));
  const members: HonoredMember[] = (memberResult.error ? [] : memberResult.data ?? []).filter((row) => memberTiers.includes(row.tier as MemberTier)).map((row) => ({ id: row.id, status: "verified", displayName: row.display_name, tier: row.tier as MemberTier, periodLabel: row.period_label, consentConfirmed: true, image: safeImage(row.image_url, row.image_alt || `Hội viên ${row.display_name}`) }));
  const images = new Map<string, ContentImage>();
  for (const row of imageResult.error ? [] : imageResult.data ?? []) { const image = safeImage(row.public_url, row.alt_text); if (image) images.set(row.image_key, image); }
  const galleryItems: GalleryItem[] = (galleryResult.error ? [] : galleryResult.data ?? []).flatMap((row) => { const image = safeImage(row.image_url, row.image_alt); return image ? [{ id: row.id, title: row.title, image }] : []; });

  return {
    branches: branches.length ? branches : undefined,
    promotions: promotions.length ? promotions : undefined,
    tournaments: tournaments.length ? tournaments : undefined,
    hallOfFame: hallTournaments.length || members.length ? { tournaments: hallTournaments, members, consentNotice: "Danh sách vinh danh theo từng tháng và chỉ hiển thị khi khách hàng đồng ý." } : undefined,
    heroImage: images.get("hero-main"),
    communityImage: images.get("community-tournament"),
    galleryItems: galleryItems.length ? galleryItems : undefined,
    featuredPromotion: promotions.find((promotion) => promotion.featured) ?? promotions[0],
  };
}
