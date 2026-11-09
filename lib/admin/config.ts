import { complaintStatuses } from "@/lib/complaints";
import type { AdminField, AdminModuleConfig, ModuleKey } from "./types";

const visibility: AdminField[] = [
  { name: "published", label: "Hiển thị trên website", type: "checkbox", group: "visibility" },
  { name: "verified", label: "Đã kiểm tra thông tin", type: "checkbox", group: "visibility" },
];

const slugField: AdminField = { name: "slug", label: "Đường dẫn (tự tạo từ tên nếu để trống)", group: "status" };
const sortField: AdminField = { name: "sort_order", label: "Thứ tự hiển thị (số nhỏ lên trước)", type: "number", group: "status" };
const videoProviders = [{ value: "upload", label: "Tải lên" }, { value: "youtube", label: "YouTube" }, { value: "facebook", label: "Facebook" }, { value: "external", label: "Link khác" }];
const buckets = [{ value: "hero", label: "Ảnh đầu trang" }, { value: "branches", label: "Cơ sở" }, { value: "community", label: "Cộng đồng" }, { value: "hall-of-fame", label: "Vinh danh" }, { value: "members", label: "Hội viên" }];

const branchFields: AdminField[] = [
  { name: "name", label: "Tên cơ sở", required: true },
  { name: "area", label: "Khu vực", required: true },
  { name: "address", label: "Địa chỉ", type: "textarea", required: true },
  { name: "phone", label: "Hotline" },
  { name: "opening_hours", label: "Giờ mở cửa" },
  { name: "map_url", label: "Link Google Maps" },
  { name: "image_url", label: "Ảnh cơ sở", type: "image", group: "media" },
  { name: "image_alt", label: "Mô tả ảnh (tự lấy tên cơ sở nếu để trống)", group: "media" },
  { name: "description", label: "Mô tả", type: "textarea", group: "details" },
  { name: "status", label: "Tình trạng hoạt động", type: "select", options: [{ value: "active", label: "Đang hoạt động" }, { value: "temporarily-closed", label: "Tạm đóng cửa" }, { value: "unverified", label: "Chưa xác minh" }], group: "status" },
  slugField,
  sortField,
  ...visibility,
];

const promotionFields: AdminField[] = [
  { name: "name", label: "Tên chương trình", required: true },
  { name: "promotion_type", label: "Loại chương trình", type: "select", options: [{ value: "combo", label: "Combo giờ chơi" }, { value: "topup_bonus", label: "Ưu đãi nạp tiền" }, { value: "gift", label: "Tặng quà" }, { value: "event", label: "Sự kiện" }, { value: "discount", label: "Giảm giá" }, { value: "other", label: "Khác" }] },
  { name: "price", label: "Giá combo (đồng)", type: "number" },
  { name: "promotion_tiers", label: "Bảng mốc nạp", type: "promotion-tiers" },
  { name: "highlight_1", label: "Quyền lợi 1", group: "details" },
  { name: "highlight_2", label: "Quyền lợi 2", group: "details" },
  { name: "highlight_3", label: "Quyền lợi 3", group: "details" },
  { name: "highlight_4", label: "Quyền lợi 4", group: "details" },
  { name: "highlight_5", label: "Quyền lợi 5", group: "details" },
  { name: "note", label: "Ghi chú, điều kiện", type: "textarea", group: "details" },
  { name: "valid_from", label: "Bắt đầu", type: "date", group: "details" },
  { name: "valid_until", label: "Kết thúc", type: "date", group: "details" },
  { name: "branch_scope", label: "Cơ sở áp dụng", group: "details" },
  { name: "image_url", label: "Ảnh khuyến mãi", type: "image", group: "media" },
  { name: "featured", label: "Nổi bật", type: "checkbox", group: "status" },
  slugField,
  ...visibility,
];

const tournamentFields: AdminField[] = [
  { name: "name", label: "Tên giải", required: true },
  { name: "game", label: "Game", type: "select", options: [{ value: "TFT", label: "Đấu Trường Chân Lý (TFT)" }, { value: "LoL", label: "Liên Minh Huyền Thoại (LoL)" }, "FC Online", "Valorant", "AOE"] },
  { name: "status", label: "Trạng thái giải", type: "select", options: [{ value: "upcoming", label: "Sắp diễn ra" }, { value: "registration_open", label: "Đang mở đăng ký" }, { value: "ongoing", label: "Đang diễn ra" }, { value: "completed", label: "Đã kết thúc" }] },
  { name: "starts_at", label: "Bắt đầu", type: "datetime-local" },
  { name: "ends_at", label: "Kết thúc", type: "datetime-local" },
  { name: "branch_name", label: "Cơ sở tổ chức" },
  { name: "image_url", label: "Ảnh giải đấu", type: "image", group: "media" },
  { name: "image_alt", label: "Mô tả ảnh (tự lấy tên giải nếu để trống)", group: "media" },
  { name: "video_url", label: "Video / recap", type: "video", group: "media" },
  { name: "video_provider", label: "Nguồn video", type: "select", options: videoProviders, group: "media" },
  { name: "poster_url", label: "Ảnh bìa video", type: "image", group: "media" },
  { name: "description", label: "Giới thiệu ngắn", type: "textarea", group: "details" },
  { name: "rules", label: "Thể lệ", type: "textarea", group: "details" },
  { name: "format", label: "Thể thức", group: "details" },
  { name: "entry_fee", label: "Lệ phí (đồng)", type: "number", group: "details" },
  { name: "prize_pool", label: "Tổng giải thưởng", group: "details" },
  { name: "prize_first", label: "Giải Nhất", group: "details" },
  { name: "prize_second", label: "Giải Nhì", group: "details" },
  { name: "prize_third", label: "Giải Ba", group: "details" },
  { name: "registration_url", label: "Link đăng ký", type: "url", group: "details" },
  { name: "registration_open", label: "Mở đăng ký (cần có link đăng ký)", type: "checkbox", group: "details" },
  { name: "top_1", label: "Nhà vô địch (Top 1)", group: "details" },
  { name: "top_2", label: "Top 2", group: "details" },
  { name: "top_3", label: "Top 3", group: "details" },
  { name: "summary_title", label: "Tiêu đề tổng kết", group: "details" },
  { name: "summary_content", label: "Nội dung tổng kết", type: "textarea", group: "details" },
  { name: "highlight_1", label: "Khoảnh khắc nổi bật 1", group: "details" },
  { name: "highlight_2", label: "Khoảnh khắc nổi bật 2", group: "details" },
  { name: "highlight_3", label: "Khoảnh khắc nổi bật 3", group: "details" },
  { name: "highlight_4", label: "Khoảnh khắc nổi bật 4", group: "details" },
  { name: "highlight_5", label: "Khoảnh khắc nổi bật 5", group: "details" },
  { name: "facebook_post_url", label: "Link bài Facebook", type: "url", group: "details" },
  { name: "held_on", label: "Ngày tổ chức", type: "date", group: "details" },
  { name: "show_in_hall_of_fame", label: "Hiển thị trong mục Vinh danh nhà vô địch", type: "checkbox", group: "status" },
  { name: "featured", label: "Nổi bật", type: "checkbox", group: "status" },
  slugField,
  sortField,
  ...visibility,
];

const memberFields: AdminField[] = [
  { name: "display_name", label: "Nickname rút gọn", required: true },
  { name: "tier", label: "Hạng", type: "select", options: ["Diamond", "Platinum", "Gold"] },
  { name: "honor_month", label: "Tháng vinh danh", type: "month" },
  { name: "member_points", label: "Điểm hội viên", type: "number" },
  { name: "image_url", label: "Ảnh hội viên", type: "image", group: "media" },
  { name: "image_alt", label: "Mô tả ảnh (tự lấy nickname nếu để trống)", group: "media" },
  { name: "note", label: "Ghi chú ngắn", type: "textarea", group: "details" },
  { name: "consent_confirmed", label: "Khách đã đồng ý công khai (bắt buộc để hiển thị)", type: "checkbox", group: "visibility" },
  sortField,
  ...visibility,
];

const galleryFields: AdminField[] = [
  { name: "title", label: "Tiêu đề", required: true },
  { name: "media_type", label: "Loại", type: "select", options: [{ value: "image", label: "Ảnh" }, { value: "video", label: "Video" }] },
  { name: "image_url", label: "Ảnh", type: "image", group: "media" },
  { name: "image_alt", label: "Mô tả ảnh (tự lấy tiêu đề nếu để trống)", group: "media" },
  { name: "video_url", label: "Video", type: "video", group: "media" },
  { name: "video_provider", label: "Nguồn video", type: "select", options: videoProviders, group: "media" },
  { name: "poster_url", label: "Ảnh bìa video", type: "image", group: "media" },
  { name: "caption", label: "Chú thích", type: "textarea", group: "details" },
  { name: "bucket", label: "Nhóm ảnh", type: "select", options: buckets, group: "status" },
  sortField,
  ...visibility,
];

const siteImageFields: AdminField[] = [
  { name: "image_key", label: "Vị trí (hero-main = ảnh hoặc video đầu trang chủ)", required: true },
  { name: "media_type", label: "Đầu trang dùng", type: "select", options: [{ value: "image", label: "Ảnh" }, { value: "video", label: "Video" }] },
  { name: "alt_text", label: "Mô tả ảnh", required: true },
  { name: "public_url", label: "Ảnh (cũng là ảnh dự phòng khi video không phát)", type: "image", group: "media" },
  { name: "video_url", label: "Video (MP4/WebM 5–12 giây, tắt tiếng)", type: "video", group: "media" },
  { name: "video_provider", label: "Nguồn video", type: "select", options: videoProviders, group: "media" },
  { name: "poster_url", label: "Ảnh bìa video", type: "image", group: "media" },
  { name: "bucket", label: "Nhóm ảnh", type: "select", options: buckets, group: "status" },
  { name: "object_path", label: "Đường dẫn file (tự điền khi tải lên)", group: "status" },
  ...visibility,
];

const pcTierFields: AdminField[] = [
  { name: "name", label: "Tên hạng máy", required: true },
  { name: "subtitle", label: "Mô tả ngắn" },
  { name: "cpu", label: "CPU", required: true },
  { name: "gpu", label: "GPU", required: true },
  { name: "ram", label: "RAM", required: true },
  { name: "monitor", label: "Màn hình", required: true },
  { name: "mainboard", label: "Mainboard", group: "details" },
  { name: "storage", label: "Ổ cứng", group: "details" },
  { name: "peripherals", label: "Thiết bị ngoại vi", type: "textarea", group: "details" },
  { name: "note", label: "Ghi chú", type: "textarea", group: "details" },
  { name: "branch_scope", label: "Cơ sở áp dụng", group: "details" },
  { name: "featured", label: "Nổi bật", type: "checkbox", group: "status" },
  { ...slugField, label: "Mã hạng máy (khớp với bảng giá, tự tạo nếu để trống)" },
  sortField,
  ...visibility,
];

const faqFields: AdminField[] = [
  { name: "question", label: "Câu hỏi", required: true },
  { name: "answer", label: "Câu trả lời", type: "textarea", required: true },
  sortField,
  ...visibility,
];

export function leaderboardFields(branches: Array<{ slug: string; name: string }>): AdminField[] {
  return [
    { name: "branch_slug", label: "Cơ sở", type: "select", required: true, options: branches.map((branch) => ({ value: branch.slug, label: branch.name })) },
    { name: "period_type", label: "Loại kỳ", type: "select", options: [{ value: "week", label: "Tuần" }, { value: "month", label: "Tháng" }] },
    { name: "period_start", label: "Một ngày bất kỳ trong tuần hoặc tháng cần xếp hạng", type: "date", required: true },
    { name: "rank", label: "Hạng (1 đến 5)", type: "number", required: true },
    { name: "display_name", label: "Nickname rút gọn", required: true },
    { name: "points", label: "Điểm", type: "number" },
    { name: "consent_confirmed", label: "Người chơi đã đồng ý công khai (bắt buộc để hiển thị)", type: "checkbox", group: "visibility" },
    ...visibility,
  ];
}

const complaintFields: AdminField[] = [
  { name: "code", label: "Mã khiếu nại", type: "readonly" },
  { name: "created_at", label: "Gửi lúc", type: "readonly" },
  { name: "customer_name", label: "Khách hàng", type: "readonly" },
  { name: "phone", label: "Số điện thoại", type: "readonly" },
  { name: "branch_slug", label: "Cơ sở", type: "readonly" },
  { name: "category", label: "Nhóm vấn đề", type: "readonly" },
  { name: "content", label: "Nội dung phản ánh", type: "readonly" },
  { name: "status", label: "Trạng thái xử lý", type: "select", options: complaintStatuses.map((item) => ({ value: item.value, label: item.label })), group: "details" },
  { name: "public_response", label: "Phản hồi gửi khách (khách xem được khi tra cứu)", type: "textarea", group: "details" },
  { name: "assigned_to", label: "Người phụ trách", group: "details" },
  { name: "internal_note", label: "Ghi chú nội bộ (khách không thấy)", type: "textarea", group: "details" },
];

export const moduleFields: Record<string, AdminField[]> = {
  branches: branchFields,
  promotions: promotionFields,
  tournaments: tournamentFields,
  hall_of_fame_members: memberFields,
  site_images: siteImageFields,
  pc_tiers: pcTierFields,
  gallery_items: galleryFields,
  faq_items: faqFields,
  complaints: complaintFields,
};

const flags = "published, verified";
export const modules: AdminModuleConfig[] = [
  { key: "overview", label: "Tổng quan", title: "Tổng quan" },
  { key: "media", label: "Hero & ảnh nền", title: "Hero và ảnh nền", resource: "site_images", hint: "Ảnh hoặc video đầu trang chủ. Dòng hero-main là phần đầu trang.", listColumns: `id, image_key, alt_text, media_type, ${flags}`, addLabel: "Thêm ảnh" },
  { key: "branches", label: "Cơ sở", title: "Cơ sở", resource: "branches", listColumns: `id, slug, name, ${flags}`, addLabel: "Thêm cơ sở" },
  { key: "faq", label: "Câu hỏi thường gặp", title: "Câu hỏi thường gặp", resource: "faq_items", hint: "Mỗi dòng là một câu hỏi và câu trả lời. Chỉ nội dung đang hiển thị mới ra website.", listColumns: `id, question, ${flags}`, addLabel: "Thêm câu hỏi" },
  { key: "promotions", label: "Khuyến mãi", title: "Khuyến mãi", resource: "promotions", hint: "Combo dùng Giá combo và Quyền lợi. Ưu đãi nạp tiền dùng Bảng mốc nạp.", listColumns: `id, slug, name, valid_until, featured, ${flags}`, addLabel: "Thêm khuyến mãi" },
  { key: "pc_tiers", label: "Dàn máy, cấu hình", title: "Dàn máy và cấu hình", resource: "pc_tiers", listColumns: `id, slug, name, featured, ${flags}`, addLabel: "Thêm hạng máy" },
  { key: "tournaments", label: "Giải đấu", title: "Giải đấu", resource: "tournaments", hint: "Giải hiển thị ở mục Đấu trường theo game và theo trạng thái.", listColumns: `id, slug, name, game, status, registration_open, featured, ${flags}`, addLabel: "Thêm giải đấu" },
  { key: "leaderboard", label: "Xếp hạng tuần, tháng", title: "Xếp hạng người chơi", resource: "leaderboard_entries", hint: "Top 5 mỗi cơ sở theo tuần hoặc tháng. Dùng ô nhập nhanh để điền cả 5 người một lần.", listColumns: `id, branch_slug, period_type, period_start, rank, display_name, points, ${flags}`, addLabel: "Thêm một dòng" },
  { key: "honors", label: "Vinh danh", title: "Hội viên vinh danh", resource: "hall_of_fame_members", listColumns: `id, display_name, tier, ${flags}`, addLabel: "Thêm hội viên" },
  { key: "gallery", label: "Thư viện ảnh", title: "Thư viện ảnh", resource: "gallery_items", listColumns: `id, title, media_type, ${flags}`, addLabel: "Thêm ảnh hoặc video" },
  { key: "complaints", label: "Khiếu nại", title: "Khiếu nại khách hàng", resource: "complaints", hint: "Khách gửi từ trang Khiếu nại. Bạn đổi trạng thái và viết phản hồi tại đây.", listColumns: "id, code, customer_name, status, created_at" },
];

export const moduleGroups: Array<{ label: string; keys: ModuleKey[] }> = [
  { label: "Trang chủ", keys: ["media", "branches", "faq"] },
  { label: "Giá và ưu đãi", keys: ["promotions", "pc_tiers"] },
  { label: "Đấu trường", keys: ["tournaments", "leaderboard", "honors", "gallery"] },
  { label: "Khách hàng", keys: ["complaints"] },
];

export const errorMessages: Record<string, string> = {
  "invalid-image": "Ảnh phải là JPEG, PNG hoặc WebP và không vượt quá 5MB.",
  "invalid-video": "Video phải là MP4 hoặc WebM và không vượt quá 25MB.",
  "invalid-media-bucket": "Nhóm ảnh không hợp lệ hoặc migration video chưa được kích hoạt.",
  "publish-requires-verified": "Muốn hiển thị trên website thì cần bật Đã kiểm tra thông tin.",
  "invalid-image-url": "Link ảnh phải là đường dẫn /images hoặc link Supabase Storage hợp lệ.",
  "invalid-poster-url": "Link ảnh bìa phải là đường dẫn /images hoặc link Supabase Storage hợp lệ.",
  "invalid-video-url": "Link video phải bắt đầu bằng http:// hoặc https://.",
  "gallery-image-required": "Mục loại Ảnh cần có ảnh hoặc file ảnh.",
  "gallery-video-required": "Mục loại Video cần có link hoặc file video.",
  "invalid-registration-url": "Link đăng ký phải bắt đầu bằng http:// hoặc https://.",
  "invalid-facebook-post-url": "Link bài Facebook phải bắt đầu bằng http:// hoặc https://.",
  "registration-url-required": "Giải mở đăng ký bắt buộc có link đăng ký.",
  "member-consent-required": "Chưa thể hiển thị khi người chơi chưa đồng ý công khai. Hãy tích ô đồng ý.",
  "invalid-promotion-tier": "Mốc nạp phải có mức nạp lớn hơn 0, khách nhận lớn hơn 0 và không nhỏ hơn mức nạp.",
  "invalid-complaint-status": "Trạng thái xử lý không hợp lệ.",
  "complaint-create-blocked": "Khiếu nại chỉ do khách gửi, không tạo mới trong admin.",
  "invalid-leaderboard-rank": "Hạng phải là số nguyên từ 1 đến 5.",
  "invalid-leaderboard-branch": "Hãy chọn cơ sở.",
  "invalid-leaderboard-name": "Nickname tối đa 40 ký tự.",
  "invalid-leaderboard-points": "Điểm phải là số từ 0 trở lên.",
  "leaderboard-empty": "Hãy nhập ít nhất một người chơi.",
  "invalid-period-start": "Cần chọn ngày hợp lệ để xác định tuần hoặc tháng.",
  "invalid-combo-price": "Combo giờ chơi cần nhập Giá combo lớn hơn 0.",
};

export const migrationNotices: Record<string, { module: ModuleKey; file: string; name: string }> = {
  faq_items: { module: "faq", file: "20260701_faq_admin_cms.sql", name: "Câu hỏi thường gặp" },
  leaderboard_entries: { module: "leaderboard", file: "20261109_lol_game_and_leaderboard.sql", name: "Xếp hạng" },
  complaints: { module: "complaints", file: "20261109_complaints.sql", name: "Khiếu nại" },
};

export const moduleByKey = Object.fromEntries(modules.map((module) => [module.key, module])) as Record<ModuleKey, AdminModuleConfig>;
