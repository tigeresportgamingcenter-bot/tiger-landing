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
  { id: "open-24-7", question: "Tiger Esports có mở 24/7 không?", answer: "Có. Các cơ sở Tiger Esports hoạt động 24/7, phù hợp cả chơi ban ngày, chơi đêm, đi nhóm hoặc luyện tập trước giải. Vào giờ cao điểm, anh em nên gọi trước để được hỗ trợ chọn khu máy phù hợp." },
  { id: "booking", question: "Có cần đặt máy trước không?", answer: "Không bắt buộc. Khách có thể đến trực tiếp quầy để chọn máy. Nếu đi theo nhóm, cần ngồi cạnh nhau hoặc muốn chơi khu máy thi đấu/SVIP, anh em nên gọi trước để nhân viên hỗ trợ sắp xếp." },
  { id: "buy-combo", question: "Combo mua ở đâu?", answer: "Combo giờ chơi có thể mua trên App Dodonew hoặc hỏi trực tiếp tại quầy. Một số combo có điều kiện riêng về thời gian, cơ sở áp dụng hoặc hạng máy, nên anh em hãy kiểm tra kỹ thông tin trên chương trình đang hiển thị." },
  { id: "promotion-scope", question: "Khuyến mãi áp dụng ở cơ sở nào?", answer: "Tùy từng chương trình. Nếu chương trình ghi “Tất cả cơ sở” thì áp dụng toàn hệ thống Tiger Esports. Nếu có ghi tên cơ sở cụ thể, khuyến mãi chỉ áp dụng tại cơ sở đó trong thời gian thông báo." },
  { id: "tournaments", question: "Tiger có tổ chức giải đấu định kỳ không?", answer: "Có. Tiger Esports tổ chức các giải cộng đồng theo từng thời điểm cho FC Online, TFT, Valorant, AOE và các tựa game phù hợp. Các giải đang mở đăng ký và tổng kết giải đã kết thúc sẽ được cập nhật trên website." },
  { id: "monitor-360hz", question: "Có máy thi đấu 360Hz không?", answer: "Có. Tiger Esports có khu máy thi đấu với màn hình tần số quét cao, phù hợp cho các tựa game cần phản xạ nhanh như Valorant, PUBG, FC Online và các giải đấu cộng đồng." },
];
