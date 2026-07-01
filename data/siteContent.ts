import type { CommunityHighlight, ContactContent, ContentImage, FaqItem, HeroContent, NavigationItem, SiteSettings } from "@/types";

export const siteSettings: SiteSettings = {
  brandName: "Tiger Esports",
  locale: "vi-VN",
  primaryActionLabel: "Gọi Tiger",
};

export const navigation: NavigationItem[] = [
  { label: "Cơ sở", href: "#co-so" },
  { label: "Khuyến mãi", href: "#khuyen-mai" },
  { label: "Bảng giá", href: "#bang-gia" },
  { label: "Giải đấu", href: "#giai-dau" },
  { label: "Cấu hình", href: "#cau-hinh" },
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
  mediaType: "image",
  video: null,
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

export const faqItems: FaqItem[] = [
  { question: "Tiger Esports có mở 24/7 không?", answer: "Có. Cả bốn cơ sở Tiger Esports hiện hoạt động 24/7." },
  { question: "Có cần đặt máy trước không?", answer: "Bạn có thể đến trực tiếp hoặc gọi Tiger trước để kiểm tra tình trạng máy, đặc biệt vào giờ cao điểm." },
  { question: "Combo mua ở đâu?", answer: "Combo được đăng ký trực tiếp tại quầy. Hãy gọi hotline hoặc nhắn Zalo để xác nhận chương trình đang áp dụng." },
  { question: "Khuyến mãi áp dụng ở cơ sở nào?", answer: "Phạm vi áp dụng được ghi trên từng chương trình và có thể khác nhau theo cơ sở." },
  { question: "Tiger có tổ chức giải đấu định kỳ không?", answer: "Tiger tổ chức các hoạt động và giải đấu cộng đồng theo từng thời điểm. Lịch đã xác minh được cập nhật tại mục Giải đấu." },
  { question: "Có máy thi đấu 360Hz không?", answer: "Hạng máy Thi đấu có màn hình 360Hz. Vui lòng gọi trước để kiểm tra số máy trống tại cơ sở bạn muốn đến." },
];
