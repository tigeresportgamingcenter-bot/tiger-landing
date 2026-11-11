import type { ContentImage, GalleryItem, GearItem, LeaderboardEntry, Promotion, SiteContent, SupportedGame, TournamentEvent, TournamentStatus } from "@/types";

const tournamentImage: ContentImage = { src: "/images/community/tournament.webp", alt: "Giải đấu tại Tiger Esports" };
const fcImage: ContentImage = { src: "/images/hall-of-fame/tournament-fc-2026.webp", alt: "Giải FC Online tại Tiger Esports" };
const valorantImage: ContentImage = { src: "/images/hall-of-fame/tournament-valorant-2026.webp", alt: "Giải Valorant tại Tiger Esports" };

const podium = [
  { position: 1 as const, displayName: "Demo Player A" },
  { position: 2 as const, displayName: "Demo Player B" },
  { position: 3 as const, displayName: "Demo Player C" },
];

function event(id: string, name: string, game: SupportedGame, status: TournamentStatus, date: string, branchName: string, image: ContentImage, extra: Partial<TournamentEvent> = {}): TournamentEvent {
  const isCompleted = status === "completed";
  return {
    id, slug: id, name: `${name} (demo)`, game, description: "Nội dung demo để xem trước giao diện.", heldOn: date, startsAt: isCompleted ? null : `${date}T19:00:00+07:00`, endsAt: null,
    branchName, placements: isCompleted ? podium : [], image, video: null, rules: null, entryFee: 50000, format: "Thể thức demo", prizePool: null, prizeFirst: null, prizeSecond: null, prizeThird: null,
    status, registrationUrl: "https://example.com/demo", registrationOpen: status === "registration_open", registrationClosesAt: null, showInHallOfFame: isCompleted,
    summaryTitle: null, summaryContent: null, highlights: [], facebookPostUrl: null, ...extra,
  };
}

const events: TournamentEvent[] = [
  event("demo-tft-live", "ĐTCL Tiger Rank Night", "TFT", "ongoing", "2026-11-08", "Tiger 4", tournamentImage),
  event("demo-fc-weekly", "FC Online Weekly Cup", "FC Online", "ongoing", "2026-11-08", "Tiger 2", fcImage),
  event("demo-lol-cup", "LMHT 5v5 Tiger Cup", "LoL", "registration_open", "2026-11-22", "Tiger 3", tournamentImage),
  event("demo-lol-custom", "LMHT Custom Night", "LoL", "upcoming", "2026-11-28", "Tiger X", tournamentImage),
  event("demo-fc-open", "FC Online Open Cup", "FC Online", "upcoming", "2026-12-05", "Tiger 4", fcImage),
  event("demo-tft-cup", "ĐTCL Tiger Cup Tháng 12", "TFT", "registration_open", "2026-12-12", "Tiger 3", tournamentImage),
];

const completedEvents: TournamentEvent[] = [
  event("demo-tft-s21", "ĐTCL Season 21 Champion", "TFT", "completed", "2026-10-10", "Tiger 4", tournamentImage),
  event("demo-lol-summer", "LMHT Summer Clash", "LoL", "completed", "2026-09-15", "Tiger 3", tournamentImage),
  event("demo-fc-summer", "FC Online Summer 2026", "FC Online", "completed", "2026-08-20", "Tiger 2", fcImage),
  event("demo-valorant", "Valorant Tiger Cup", "Valorant", "completed", "2026-06-27", "Tiger X", valorantImage),
  event("demo-fc-spring", "FC Online Spring 2026", "FC Online", "completed", "2026-05-20", "Tiger 4", fcImage),
];

function board(period: "week" | "month", periodStart: string, branchId: string, branchIndex: number): LeaderboardEntry[] {
  return [1, 2, 3, 4, 5].map((rank) => ({
    id: `demo-${period}-${branchId}-${rank}`, branchId, period, periodStart, rank,
    displayName: `Demo ${branchId.slice(-1).toUpperCase()}${rank}`, points: 5200 - rank * 410 - branchIndex * 85,
  }));
}

const upcomingPromotion: Promotion = {
  id: "demo-upcoming-promo", name: "Combo cuối tuần (demo)", promotionType: "combo", price: 199000, highlights: ["5 giờ chơi, dùng trong 3 ngày", "Áp dụng khu VIP"], note: "Nội dung demo.",
  featured: false, image: null, branchScope: "Tất cả cơ sở", validFrom: "2026-12-01", validUntil: null, tiers: [],
};

const demoGear: GearItem[] = [
  { id: "demo-gear-mouse", name: "Chuột gaming (demo)", category: "mouse", description: "Chuột nhẹ, cảm biến chính xác cho FPS.", specs: ["Nhẹ chỉ 60 g", "Không dây, pin tới 95 giờ"], price: 10000, priceUnit: "hour", note: null, branchScope: "Tất cả cơ sở", image: null, available: true },
  { id: "demo-gear-mouse-2", name: "Chuột không dây (demo)", category: "mouse", description: "Không dây, pin dùng cả ngày.", specs: [], price: 25000, priceUnit: "day", note: "Cần để lại giấy tờ", branchScope: null, image: null, available: false },
  { id: "demo-gear-keyboard", name: "Bàn phím cơ (demo)", category: "keyboard", description: "Switch đỏ, đèn nền RGB.", specs: ["Switch từ Hall Effect", "Rapid Trigger 0,1 mm"], price: 15000, priceUnit: "hour", note: null, branchScope: null, image: null, available: true },
  { id: "demo-gear-headset", name: "Tai nghe gaming (demo)", category: "headset", description: "Âm thanh vòm 7.1, mic khử ồn.", specs: [], price: null, priceUnit: "hour", note: null, branchScope: "Tiger 3, Tiger 4", image: null, available: true },
  { id: "demo-gear-pad", name: "Tay cầm chơi game (demo)", category: "controller", description: "Dùng cho FC Online và game đối kháng.", specs: [], price: 20000, priceUnit: "turn", note: null, branchScope: null, image: null, available: true },
];

export const demoTournaments = [...events, ...completedEvents];

export function withDemoContent(content: SiteContent): SiteContent {
  const branchImages = content.branches.flatMap((branch) => branch.image ? [{ branch, image: branch.image }] : []);
  const galleryItems: GalleryItem[] = branchImages.map(({ branch, image }) => ({ id: `demo-gallery-${branch.id}`, title: `Không gian ${branch.name}`, caption: "Ảnh demo", mediaType: "image", image, video: null }));
  return {
    ...content,
    tournamentEvents: events,
    completedTournamentEvents: completedEvents,
    leaderboard: content.branches.flatMap((branch, index) => [...board("week", "2026-11-02", branch.id, index), ...board("month", "2026-11-01", branch.id, index)]),
    galleryItems,
    upcomingPromotions: [upcomingPromotion],
    gearItems: demoGear,
  };
}
