import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/config";
import type { Branch, ChampionPlacement, ContentImage, ContentVideo, GalleryItem, HallOfFameContent, HallOfFameTournament, HonoredMember, MediaProvider, MemberTier, PcTier, Promotion, SupportedGame, Tournament, TournamentEvent, TournamentStatus } from "@/types";

export interface SupabaseContent {
  branches?: Branch[];
  promotions?: Promotion[];
  tournaments?: Tournament[];
  hallOfFame?: HallOfFameContent;
  heroImage?: ContentImage;
  communityImage?: ContentImage;
  galleryItems?: GalleryItem[];
  featuredPromotion?: Promotion;
  pcTiers?: PcTier[];
  tournamentEvents?: TournamentEvent[];
  completedTournamentEvents?: TournamentEvent[];
}

const games: SupportedGame[] = ["FC Online", "Valorant", "TFT", "AOE"];
const communityGameDescriptions: Record<SupportedGame, string> = {
  "FC Online": "Sân chơi bóng đá điện tử cho những trận giao hữu, leo rank và giải đấu cộng đồng.",
  Valorant: "Không gian đấu đội, phối hợp chiến thuật và rèn kỹ năng FPS cùng đồng đội.",
  TFT: "Cộng đồng chiến thuật dành cho người chơi Đấu Trường Chân Lý tại Tiger.",
  AOE: "Kết nối những game thủ chiến thuật yêu thích AOE và các kèo giao lưu địa phương.",
};
const memberTiers: MemberTier[] = ["Diamond", "Platinum", "Gold"];
const tournamentStatuses: TournamentStatus[] = ["upcoming", "registration_open", "ongoing", "completed"];
const mediaProviders: MediaProvider[] = ["upload", "youtube", "facebook", "external"];

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

function safeUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? value : null;
  } catch {
    return null;
  }
}

function safeTextList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim()).slice(0, 6);
}

function safeVideo(src: unknown, provider: unknown, posterUrl: unknown, alt: string): ContentVideo | null {
  const url = safeUrl(src);
  if (!url || !mediaProviders.includes(provider as MediaProvider)) return null;
  return { src: url, provider: provider as MediaProvider, poster: safeImage(posterUrl, alt) };
}

function mapTournament(row: Record<string, unknown>): TournamentEvent | null {
  if (typeof row.slug !== "string" || typeof row.name !== "string" || !games.includes(row.game as SupportedGame)) return null;
  const storedStatus = tournamentStatuses.includes(row.status as TournamentStatus) ? row.status as TournamentStatus : "completed";
  const registrationOpen = row.registration_open === true;
  const status = registrationOpen ? "registration_open" : storedStatus;
  return {
    id: typeof row.id === "string" ? row.id : row.slug,
    slug: row.slug,
    name: row.name,
    game: row.game as SupportedGame,
    description: typeof row.description === "string" ? row.description : "",
    heldOn: typeof row.held_on === "string" ? row.held_on : null,
    startsAt: typeof row.starts_at === "string" ? row.starts_at : null,
    endsAt: typeof row.ends_at === "string" ? row.ends_at : null,
    branchName: typeof row.branch_name === "string" ? row.branch_name : null,
    placements: safePlacements(row.placements),
    image: safeImage(row.image_url, typeof row.image_alt === "string" ? row.image_alt : `Giải đấu ${row.name}`),
    video: safeVideo(row.video_url, row.video_provider, row.poster_url, `Ảnh đại diện video ${row.name}`),
    rules: typeof row.rules === "string" ? row.rules : null,
    entryFee: typeof row.entry_fee === "number" ? row.entry_fee : null,
    status,
    registrationUrl: safeUrl(row.registration_url),
    registrationOpen,
    showInHallOfFame: row.show_in_hall_of_fame === true,
    summaryTitle: typeof row.summary_title === "string" && row.summary_title.trim() ? row.summary_title : null,
    summaryContent: typeof row.summary_content === "string" && row.summary_content.trim() ? row.summary_content : null,
    highlights: safeTextList(row.highlights),
    facebookPostUrl: safeUrl(row.facebook_post_url),
  };
}

export async function getSupabaseContent(): Promise<SupabaseContent | null> {
  if (!isSupabaseConfigured()) return null;
  const { url, key } = getSupabaseConfig();
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const [branchResult, promotionResult, tournamentResult, memberResult, imageResult, galleryResult, pcTierResult] = await Promise.all([
    supabase.from("branches").select("*").eq("published", true).eq("verified", true).order("sort_order"),
    supabase.from("promotions").select("slug,name,price,highlights,note,image_url,featured,valid_from,valid_until").eq("published", true).eq("verified", true).or(`valid_from.is.null,valid_from.lte.${today}`).or(`valid_until.is.null,valid_until.gte.${today}`).order("featured", { ascending: false }).order("created_at", { ascending: false }),
    supabase.from("tournaments").select("*").eq("published", true).eq("verified", true).order("held_on", { ascending: false }),
    supabase.from("hall_of_fame_members").select("*").eq("published", true).eq("verified", true).eq("consent_confirmed", true).order("created_at", { ascending: false }),
    supabase.from("site_images").select("*").eq("published", true).eq("verified", true),
    supabase.from("gallery_items").select("*").eq("published", true).eq("verified", true).order("sort_order"),
    supabase.from("pc_tiers").select("*").eq("published", true).eq("verified", true).order("sort_order"),
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
  const mappedEvents = tournamentRows.map((row) => mapTournament(row)).filter((event): event is TournamentEvent => Boolean(event));
  const tournaments: Tournament[] = games.map((game) => ({
    id: game.toLowerCase().replaceAll(" ", "-"),
    game,
    description: communityGameDescriptions[game],
  }));
  const hallTournaments: HallOfFameTournament[] = mappedEvents.filter((event) => event.status === "completed" && event.showInHallOfFame).map((event) => ({ id: event.slug, slug: event.slug, status: "verified", name: event.name, game: event.game, heldOn: event.heldOn ?? event.startsAt, branchName: event.branchName, placements: event.placements, image: event.image, video: event.video, showInHallOfFame: true }));
  const members: HonoredMember[] = (memberResult.error ? [] : memberResult.data ?? []).filter((row) => memberTiers.includes(row.tier as MemberTier)).map((row) => ({ id: row.id, status: "verified", displayName: row.display_name, tier: row.tier as MemberTier, periodLabel: row.period_label, consentConfirmed: true, image: safeImage(row.image_url, row.image_alt || `Hội viên ${row.display_name}`) }));
  const images = new Map<string, ContentImage>();
  for (const row of imageResult.error ? [] : imageResult.data ?? []) { const image = safeImage(row.public_url, row.alt_text); if (image) images.set(row.image_key, image); }
  const galleryItems: GalleryItem[] = (galleryResult.error ? [] : galleryResult.data ?? []).flatMap((row) => {
    const mediaType = row.media_type === "video" ? "video" : "image";
    const image = safeImage(row.image_url, row.image_alt || row.title);
    const video = safeVideo(row.video_url, row.video_provider, row.poster_url, `Ảnh đại diện video ${row.title}`);
    if ((mediaType === "image" && !image) || (mediaType === "video" && !video)) return [];
    return [{ id: row.id, title: row.title, caption: typeof row.caption === "string" ? row.caption : null, mediaType, image, video }];
  });
  const pcTiers: PcTier[] = (pcTierResult.error ? [] : pcTierResult.data ?? []).map((row) => ({ id: row.slug, name: row.name, subtitle: row.subtitle, cpu: row.cpu, gpu: row.gpu, ram: row.ram, monitor: row.monitor, mainboard: row.mainboard, storage: row.storage, peripherals: row.peripherals, note: row.note, branchScope: row.branch_scope, featured: Boolean(row.featured), description: row.subtitle || row.note || "" }));
  const statusPriority: Record<TournamentStatus, number> = { registration_open: 0, ongoing: 1, upcoming: 2, completed: 3 };
  const tournamentEvents = mappedEvents.filter((event) => event.status !== "completed").sort((a, b) => statusPriority[a.status] - statusPriority[b.status] || String(a.startsAt ?? a.heldOn ?? "").localeCompare(String(b.startsAt ?? b.heldOn ?? "")));
  const completedTournamentEvents = mappedEvents.filter((event) => event.status === "completed").sort((a, b) => String(b.heldOn ?? b.startsAt ?? "").localeCompare(String(a.heldOn ?? a.startsAt ?? "")));

  return {
    branches: branches.length ? branches : undefined,
    promotions: promotions.length ? promotions : undefined,
    tournaments: tournaments.length ? tournaments : undefined,
    hallOfFame: { tournaments: hallTournaments, members, consentNotice: "Danh sách vinh danh theo từng tháng và chỉ hiển thị khi khách hàng đồng ý." },
    heroImage: images.get("hero-main"),
    communityImage: images.get("community-tournament"),
    galleryItems: galleryItems.length ? galleryItems : undefined,
    featuredPromotion: promotions.find((promotion) => promotion.featured) ?? promotions[0],
    pcTiers: pcTiers.length ? pcTiers : undefined,
    tournamentEvents: tournamentEvents.length ? tournamentEvents : undefined,
    completedTournamentEvents: completedTournamentEvents.length ? completedTournamentEvents : undefined,
  };
}

export async function getSupabaseTournamentBySlug(slug: string): Promise<TournamentEvent | null> {
  if (!isSupabaseConfigured()) return null;
  const { url, key } = getSupabaseConfig();
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.from("tournaments").select("*").eq("slug", slug).eq("published", true).eq("verified", true).maybeSingle();
  if (error || !data) return null;
  return mapTournament(data);
}
