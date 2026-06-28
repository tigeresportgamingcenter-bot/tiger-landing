import type { CommunityHighlight, ContactContent, ContentImage, HeroContent, NavigationItem, SiteSettings } from "@/types";

export const siteSettings: SiteSettings = {
  brandName: "Tiger Esports",
  locale: "vi-VN",
  primaryActionLabel: "Gọi Tiger",
};

export const navigation: NavigationItem[] = [
  { label: "Cơ sở", href: "#co-so" },
  { label: "Cấu hình", href: "#cau-hinh" },
  { label: "Bảng giá", href: "#bang-gia" },
  { label: "Cộng đồng", href: "#cong-dong" },
];

export const heroContent: HeroContent = {
  eyebrow: "Nâng tầm cuộc chơi",
  title: "Tiger",
  highlightedTitle: "Esports",
  description: "Cyber Game cao cấp cho game thủ Thanh Hóa và Sầm Sơn.",
  supportingText: "Bốn cơ sở, nhiều hạng máy và giải đấu định kỳ.",
  readinessLabel: "Sẵn sàng cho trận đấu",
  image: { src: "/images/hero/tiger-hero.webp", alt: "Không gian gaming tại Tiger Esports" },
};

export const communityImage: ContentImage = {
  src: "/images/community/tournament.webp",
  alt: "Giải đấu cộng đồng tại Tiger Esports",
};

export const communityHighlights: CommunityHighlight[] = [
  { id: "tournaments", title: "Giải đấu định kỳ", description: "Tiger Esports Championship kết nối người chơi tại bốn cơ sở.", icon: "trophy" },
  { id: "team-play", title: "Không gian chơi đội", description: "Khu máy phục vụ luyện tập, đấu đội và giao lưu.", icon: "users" },
];

export const contactContent: ContactContent = {
  eyebrow: "Sẵn sàng nhập cuộc?",
  titleLines: ["Chọn cơ sở.", "Gọi Tiger.", "Vào trận."],
  facebookLabel: "Fanpage chính thức",
  zaloLabel: "Nhắn Zalo 0834.650.555",
  mapsLabel: "Chọn cơ sở để chỉ đường",
  hotlineLabel: "Hotline Tiger Esports",
};
