import Link from "next/link";
import { redirect } from "next/navigation";
import { logout, uploadImage } from "@/app/admin/actions";
import { ResourceManager, type AdminField } from "@/components/admin/ResourceManager";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

type Row = Record<string, unknown>;
type ModuleKey = "overview" | "media" | "branches" | "promotions" | "tournaments" | "honors" | "pc_tiers" | "gallery";

const commonFields: AdminField[] = [{ name: "published", label: "Đang hiển thị", type: "checkbox", group: "status" }, { name: "verified", label: "Đã xác minh", type: "checkbox", group: "status" }];
const branchFields: AdminField[] = [{ name: "slug", label: "Slug", required: true }, { name: "name", label: "Tên cơ sở", required: true }, { name: "area", label: "Khu vực", required: true }, { name: "address", label: "Địa chỉ", type: "textarea", required: true }, { name: "map_url", label: "Google Maps URL" }, { name: "phone", label: "Hotline" }, { name: "opening_hours", label: "Giờ mở cửa" }, { name: "status", label: "Trạng thái", type: "select", options: ["active", "temporarily-closed", "unverified"] }, { name: "description", label: "Mô tả", type: "textarea", group: "details" }, { name: "image_url", label: "Ảnh cơ sở", type: "image", group: "media" }, { name: "image_alt", label: "Alt ảnh", group: "media" }, { name: "sort_order", label: "Thứ tự", type: "number", group: "status" }, ...commonFields];
const promotionFields: AdminField[] = [{ name: "slug", label: "Slug", required: true }, { name: "name", label: "Tên chương trình", required: true }, { name: "promotion_type", label: "Loại chương trình", type: "select", options: [{ value: "combo", label: "Combo giờ chơi" }, { value: "topup_bonus", label: "Ưu đãi nạp tiền" }, { value: "gift", label: "Tặng quà" }, { value: "event", label: "Sự kiện" }, { value: "discount", label: "Giảm giá" }, { value: "other", label: "Khác" }] }, { name: "price", label: "Giá combo", type: "number" }, { name: "highlight_1", label: "Quyền lợi / điểm nổi bật 1", group: "details" }, { name: "highlight_2", label: "Quyền lợi / điểm nổi bật 2", group: "details" }, { name: "highlight_3", label: "Quyền lợi / điểm nổi bật 3", group: "details" }, { name: "highlight_4", label: "Quyền lợi / điểm nổi bật 4", group: "details" }, { name: "highlight_5", label: "Quyền lợi / điểm nổi bật 5", group: "details" }, { name: "promotion_tiers", label: "Bảng mốc nạp", type: "promotion-tiers", group: "details" }, { name: "note", label: "Ghi chú / điều kiện", type: "textarea", group: "details" }, { name: "branch_scope", label: "Cơ sở áp dụng", group: "details" }, { name: "image_url", label: "Ảnh khuyến mãi", type: "image", group: "media" }, { name: "valid_from", label: "Bắt đầu", type: "date", group: "status" }, { name: "valid_until", label: "Kết thúc", type: "date", group: "status" }, { name: "featured", label: "Nổi bật", type: "checkbox", group: "status" }, ...commonFields];
const tournamentFields: AdminField[] = [{ name: "slug", label: "Slug", required: true }, { name: "name", label: "Tên giải", required: true }, { name: "game", label: "Game", type: "select", options: ["FC Online", "Valorant", "TFT", "AOE"] }, { name: "status", label: "Trạng thái", type: "select", options: ["upcoming", "registration_open", "ongoing", "completed"] }, { name: "description", label: "Lead / mô tả ngắn", type: "textarea", group: "details" }, { name: "rules", label: "Thể lệ", type: "textarea", group: "details" }, { name: "held_on", label: "Ngày tổ chức", type: "date" }, { name: "starts_at", label: "Bắt đầu", type: "datetime-local" }, { name: "ends_at", label: "Kết thúc", type: "datetime-local" }, { name: "branch_name", label: "Cơ sở" }, { name: "format", label: "Thể thức" }, { name: "entry_fee", label: "Lệ phí", type: "number" }, { name: "prize_pool", label: "Tổng giải thưởng", group: "details" }, { name: "prize_first", label: "Giải Nhất", group: "details" }, { name: "prize_second", label: "Giải Nhì", group: "details" }, { name: "prize_third", label: "Giải Ba", group: "details" }, { name: "registration_url", label: "URL đăng ký", type: "url" }, { name: "registration_open", label: "Mở đăng ký", type: "checkbox", group: "status" }, { name: "show_in_hall_of_fame", label: "Hiển thị trong Vinh danh nhà vô địch", type: "checkbox", group: "status" }, { name: "featured", label: "Nổi bật", type: "checkbox", group: "status" }, { name: "sort_order", label: "Thứ tự", type: "number", group: "status" }, { name: "top_1", label: "Top 1", group: "details" }, { name: "top_2", label: "Top 2", group: "details" }, { name: "top_3", label: "Top 3", group: "details" }, { name: "summary_title", label: "Tiêu đề tổng kết", group: "details" }, { name: "summary_content", label: "Nội dung tổng kết", type: "textarea", group: "details" }, { name: "highlight_1", label: "Khoảnh khắc nổi bật 1", group: "details" }, { name: "highlight_2", label: "Khoảnh khắc nổi bật 2", group: "details" }, { name: "highlight_3", label: "Khoảnh khắc nổi bật 3", group: "details" }, { name: "highlight_4", label: "Khoảnh khắc nổi bật 4", group: "details" }, { name: "highlight_5", label: "Khoảnh khắc nổi bật 5", group: "details" }, { name: "facebook_post_url", label: "URL bài Facebook", type: "url", group: "details" }, { name: "image_url", label: "Ảnh giải đấu", type: "image", group: "media" }, { name: "image_alt", label: "Alt ảnh", group: "media" }, { name: "video_url", label: "Video / recap", type: "video", group: "media" }, { name: "video_provider", label: "Nguồn video", type: "select", options: ["upload", "youtube", "facebook", "external"], group: "media" }, { name: "poster_url", label: "Ảnh poster video", type: "image", group: "media" }, ...commonFields];
const memberFields: AdminField[] = [{ name: "display_name", label: "Nickname rút gọn", required: true }, { name: "tier", label: "Hạng", type: "select", options: ["Diamond", "Platinum", "Gold"] }, { name: "honor_month", label: "Tháng vinh danh", type: "month" }, { name: "member_points", label: "Điểm hội viên", type: "number" }, { name: "note", label: "Ghi chú ngắn", type: "textarea", group: "details" }, { name: "sort_order", label: "Thứ tự khi bằng điểm", type: "number", group: "status" }, { name: "image_url", label: "Ảnh hội viên", type: "image", group: "media" }, { name: "image_alt", label: "Alt ảnh", group: "media" }, { name: "consent_confirmed", label: "Khách đã đồng ý công khai", type: "checkbox", group: "status" }, ...commonFields];
const galleryFields: AdminField[] = [{ name: "title", label: "Tiêu đề", required: true }, { name: "caption", label: "Chú thích", type: "textarea", group: "details" }, { name: "media_type", label: "Loại media", type: "select", options: ["image", "video"] }, { name: "image_url", label: "Ảnh gallery", type: "image", group: "media" }, { name: "image_alt", label: "Alt ảnh", group: "media" }, { name: "video_url", label: "Video", type: "video", group: "media" }, { name: "video_provider", label: "Nguồn video", type: "select", options: ["upload", "youtube", "facebook", "external"], group: "media" }, { name: "poster_url", label: "Ảnh poster video", type: "image", group: "media" }, { name: "bucket", label: "Bucket ảnh", type: "select", options: ["hero", "branches", "community", "hall-of-fame", "members"] }, { name: "sort_order", label: "Thứ tự", type: "number", group: "status" }, ...commonFields];
const siteImageFields: AdminField[] = [{ name: "image_key", label: "Khóa media (hero dùng hero-main)", required: true }, { name: "media_type", label: "Loại media hero", type: "select", options: [{ value: "image", label: "Ảnh" }, { value: "video", label: "Video" }] }, { name: "public_url", label: "Ảnh hero / ảnh fallback", type: "image", group: "media" }, { name: "video_url", label: "Video hero", type: "video", group: "media" }, { name: "video_provider", label: "Nguồn video", type: "select", options: ["upload", "youtube", "facebook", "external"], group: "media" }, { name: "poster_url", label: "Poster video", type: "image", group: "media" }, { name: "alt_text", label: "Alt text", required: true }, { name: "bucket", label: "Bucket", type: "select", options: ["hero", "branches", "community", "hall-of-fame", "members"], group: "status" }, { name: "object_path", label: "Đường dẫn object (tự điền khi upload)", group: "status" }, ...commonFields];
const pcTierFields: AdminField[] = [{ name: "slug", label: "Slug", required: true }, { name: "name", label: "Tên hạng máy", required: true }, { name: "subtitle", label: "Mô tả ngắn" }, { name: "cpu", label: "CPU", required: true }, { name: "gpu", label: "GPU", required: true }, { name: "ram", label: "RAM", required: true }, { name: "monitor", label: "Màn hình", required: true }, { name: "mainboard", label: "Mainboard", group: "details" }, { name: "storage", label: "Ổ cứng", group: "details" }, { name: "peripherals", label: "Thiết bị ngoại vi", type: "textarea", group: "details" }, { name: "note", label: "Ghi chú", type: "textarea", group: "details" }, { name: "branch_scope", label: "Phạm vi cơ sở", group: "details" }, { name: "sort_order", label: "Thứ tự", type: "number", group: "status" }, { name: "featured", label: "Nổi bật", type: "checkbox", group: "status" }, ...commonFields];

const modules: Array<{ key: ModuleKey; label: string; resource?: string; title: string }> = [
  { key: "overview", label: "Tổng quan", title: "Tổng quan" },
  { key: "media", label: "Ảnh & Media", resource: "site_images", title: "Ảnh website" },
  { key: "branches", label: "Cơ sở", resource: "branches", title: "Cơ sở" },
  { key: "promotions", label: "Khuyến mãi", resource: "promotions", title: "Khuyến mãi" },
  { key: "tournaments", label: "Giải đấu", resource: "tournaments", title: "Giải đấu" },
  { key: "honors", label: "Vinh danh", resource: "hall_of_fame_members", title: "Hội viên vinh danh" },
  { key: "pc_tiers", label: "Dàn máy / Cấu hình", resource: "pc_tiers", title: "Dàn máy / Cấu hình" },
  { key: "gallery", label: "Gallery", resource: "gallery_items", title: "Gallery" },
];

const moduleFields: Record<string, AdminField[]> = {
  branches: branchFields,
  promotions: promotionFields,
  tournaments: tournamentFields,
  hall_of_fame_members: memberFields,
  site_images: siteImageFields,
  pc_tiers: pcTierFields,
  gallery_items: galleryFields,
};

const errorMessages: Record<string, string> = {
  "invalid-image": "Ảnh phải là JPEG, PNG hoặc WebP và không vượt quá 5MB.",
  "invalid-video": "Video phải là MP4 hoặc WebM và không vượt quá 25MB.",
  "invalid-media-bucket": "Bucket media không hợp lệ hoặc migration video chưa được kích hoạt.",
  "publish-requires-verified": "Không thể công khai nội dung khi chưa bật Đã xác minh.",
  "invalid-image-url": "URL ảnh phải là đường dẫn /images hoặc URL Supabase Storage hợp lệ.",
  "invalid-poster-url": "URL poster phải là đường dẫn /images hoặc URL Supabase Storage hợp lệ.",
  "invalid-video-url": "URL video phải bắt đầu bằng http:// hoặc https://.",
  "gallery-image-required": "Gallery loại ảnh cần ảnh hoặc file ảnh.",
  "gallery-video-required": "Gallery loại video cần URL hoặc file video.",
  "invalid-registration-url": "URL đăng ký phải bắt đầu bằng http:// hoặc https://.",
  "invalid-facebook-post-url": "URL bài Facebook phải bắt đầu bằng http:// hoặc https://.",
  "registration-url-required": "Giải mở đăng ký bắt buộc có URL đăng ký.",
  "member-consent-required": "Không thể công khai hội viên khi chưa xác nhận đồng ý.",
  "invalid-promotion-tier": "Mốc nạp phải có mức nạp > 0, khách nhận > 0 và khách nhận không nhỏ hơn mức nạp.",
  "invalid-combo-price": "Combo giờ chơi cần nhập Giá combo lớn hơn 0.",
};

function statusOf(record: Row, resource?: string) {
  if (resource === "tournaments" && record.registration_open) return "registration_open";
  if (resource === "tournaments" && record.status === "completed") return "completed";
  if (record.featured) return "featured";
  if (record.published && record.verified) return "published";
  if (record.verified) return "verified";
  return "draft";
}

function normalizeRecords(resource: string, records: Row[], promotionTiers: Row[] = []) {
  if (resource === "promotions") {
    return records.map((record) => {
      const highlights = Array.isArray(record.highlights) ? record.highlights.filter((item): item is string => typeof item === "string") : [];
      const tiers = promotionTiers.filter((tier) => tier.promotion_id === record.id).sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)).slice(0, 8);
      const tierFields = Object.fromEntries(tiers.flatMap((tier, index) => {
        const row = index + 1;
        return [[`tier_${row}_pay_amount`, tier.pay_amount ?? ""], [`tier_${row}_receive_amount`, tier.receive_amount ?? ""], [`tier_${row}_bonus_amount`, tier.bonus_amount ?? ""], [`tier_${row}_note`, tier.note ?? ""], [`tier_${row}_sort_order`, tier.sort_order ?? index]];
      }));
      return { ...record, promotion_type: record.promotion_type ?? "combo", ...tierFields, highlight_1: highlights[0] ?? "", highlight_2: highlights[1] ?? "", highlight_3: highlights[2] ?? "", highlight_4: highlights[3] ?? "", highlight_5: highlights[4] ?? "" };
    });
  }
  if (resource === "tournaments") {
    return records.map((record) => {
      const placements = Array.isArray(record.placements) ? record.placements as Array<Record<string, unknown>> : [];
      const highlights = Array.isArray(record.highlights) ? record.highlights.filter((item): item is string => typeof item === "string") : [];
      return { ...record, top_1: placements.find((placement) => placement.position === 1)?.displayName ?? "", top_2: placements.find((placement) => placement.position === 2)?.displayName ?? "", top_3: placements.find((placement) => placement.position === 3)?.displayName ?? "", highlight_1: highlights[0] ?? "", highlight_2: highlights[1] ?? "", highlight_3: highlights[2] ?? "", highlight_4: highlights[3] ?? "", highlight_5: highlights[4] ?? "" };
    });
  }
  if (resource === "hall_of_fame_members") {
    return records.map((record) => ({ ...record, honor_month: typeof record.honor_month === "string" ? record.honor_month.slice(0, 7) : "" }));
  }
  return records;
}

function filterRecords(records: Row[], resource: string | undefined, q: string, status: string) {
  return records.filter((record) => {
    const haystack = [record.name, record.title, record.display_name, record.slug, record.image_key, record.id].map((item) => String(item ?? "").toLowerCase()).join(" ");
    const matchesSearch = !q || haystack.includes(q.toLowerCase());
    const matchesStatus = status === "all" || statusOf(record, resource) === status;
    return matchesSearch && matchesStatus;
  });
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ module?: string; q?: string; filter?: string; edit?: string; error?: string; status?: string }> }) {
  if (!isSupabaseConfigured()) redirect("/admin/login?error=config");
  const params = await searchParams;
  const activeModule = modules.some((module) => module.key === params.module) ? params.module as ModuleKey : "overview";
  const q = params.q ?? "";
  const filter = params.filter ?? "all";
  const selectedEdit = params.edit;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: membership } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!membership) redirect("/admin/login?error=permission");

  const tables = ["branches", "promotions", "tournaments", "hall_of_fame_members", "site_images", "gallery_items", "pc_tiers"] as const;
  const results = await Promise.all(tables.map((table) => supabase.from(table).select("*").order("created_at", { ascending: false })));
  const data = Object.fromEntries(tables.map((table, index) => [table, (results[index].data ?? []) as Row[]])) as Record<(typeof tables)[number], Row[]>;
  const { data: promotionTiers } = await supabase.from("promotion_tiers").select("*").order("sort_order");
  const loadError = results.find((result) => result.error)?.error?.message;
  const visibleError = params.error ? errorMessages[params.error] ?? params.error : undefined;
  const successMessage = params.status === "saved" ? "Đã lưu thay đổi." : params.status === "deleted" ? "Đã xóa nội dung." : params.status === "uploaded" ? "Đã upload ảnh website." : null;

  const currentModule = modules.find((module) => module.key === activeModule)!;
  const resource = currentModule.resource;
  const moduleHref = `/admin/dashboard?module=${activeModule}${q ? `&q=${encodeURIComponent(q)}` : ""}${filter !== "all" ? `&filter=${filter}` : ""}`;
  const returnTo = moduleHref;

  const records = resource ? filterRecords(normalizeRecords(resource, data[resource as keyof typeof data] ?? [], (promotionTiers ?? []) as Row[]), resource, q, filter) : [];

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-tiger-orange">Tiger Esports CMS</p>
            <h1 className="mt-2 text-3xl font-extrabold">Dashboard nội dung</h1>
            <p className="mt-1 text-sm text-zinc-500">{user.email}</p>
          </div>
          <form action={logout}><button className="min-h-11 rounded-lg border border-white/15 px-4 text-sm font-bold">Đăng xuất</button></form>
        </header>

        {visibleError || loadError ? <p className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{visibleError ?? `Không thể tải dữ liệu: ${loadError}`}</p> : null}
        {successMessage ? <p className="mt-5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">{successMessage}</p> : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-2xl border border-white/10 bg-white/[0.025] p-3 lg:sticky lg:top-4 lg:self-start">
            <nav className="grid gap-1">
              {modules.map((module) => (
                <Link key={module.key} href={`/admin/dashboard?module=${module.key}`} className={`rounded-xl px-3 py-2 text-sm font-bold ${activeModule === module.key ? "bg-tiger-orange text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
                  {module.label}
                </Link>
              ))}
            </nav>
          </aside>

          <section className="space-y-5">
            {activeModule === "overview" ? (
              <div className="grid gap-4 md:grid-cols-3">
                {modules.filter((module) => module.resource).map((module) => {
                  const count = data[module.resource as keyof typeof data]?.length ?? 0;
                  return <Link key={module.key} href={`/admin/dashboard?module=${module.key}`} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 hover:border-tiger-orange/50"><p className="text-sm text-zinc-500">{module.label}</p><p className="mt-3 text-3xl font-extrabold text-white">{count}</p></Link>;
                })}
              </div>
            ) : null}

            {activeModule === "media" ? (
              <section className="rounded-2xl border border-tiger-orange/25 bg-tiger-orange/5 p-5">
                <h2 className="text-2xl font-extrabold">Upload ảnh website</h2>
                <p className="mt-2 text-sm text-zinc-500">Dùng cho hero/community/branch/member. Ảnh mới luôn ở trạng thái chưa xuất bản.</p>
                <form action={uploadImage} className="mt-5 grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="return_to" value={returnTo} />
                  <select name="bucket" required className="min-h-11 rounded-lg border border-white/10 bg-black/50 px-3"><option>hero</option><option>branches</option><option>community</option><option>hall-of-fame</option><option>members</option></select>
                  <input name="image_key" placeholder="Khóa ảnh, ví dụ hero-main" required className="min-h-11 rounded-lg border border-white/10 bg-black/50 px-3" />
                  <input name="alt_text" placeholder="Mô tả ảnh" required className="min-h-11 rounded-lg border border-white/10 bg-black/50 px-3" />
                  <input name="file" type="file" accept="image/jpeg,image/png,image/webp" required className="min-h-11 rounded-lg border border-white/10 bg-black/50 p-2" />
                  <button className="min-h-11 rounded-lg bg-tiger-orange font-bold md:col-span-2">Upload lên Storage</button>
                </form>
              </section>
            ) : null}

            {resource ? (
              <>
                <form className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 md:grid-cols-[1fr_180px_auto]">
                  <input type="hidden" name="module" value={activeModule} />
                  <input name="q" defaultValue={q} placeholder="Tìm theo tên, slug..." className="min-h-11 rounded-lg border border-white/10 bg-black/40 px-3 text-sm outline-none focus:border-tiger-orange" />
                  <select name="filter" defaultValue={filter} className="min-h-11 rounded-lg border border-white/10 bg-black/40 px-3 text-sm outline-none focus:border-tiger-orange">
                    <option value="all">Tất cả trạng thái</option>
                    <option value="draft">Nháp</option>
                    <option value="verified">Đã xác minh</option>
                    <option value="published">Đang hiển thị</option>
                    <option value="featured">Nổi bật</option>
                    <option value="registration_open">Mở đăng ký</option>
                    <option value="completed">Đã kết thúc</option>
                  </select>
                  <button className="min-h-11 rounded-lg border border-white/15 px-4 text-sm font-bold">Lọc</button>
                </form>
                <ResourceManager
                  title={currentModule.title}
                  resource={resource}
                  fields={moduleFields[resource]}
                  records={records}
                  moduleHref={moduleHref}
                  returnTo={returnTo}
                  selectedId={selectedEdit}
                  note={resource === "tournaments" ? "Chi tiết giải đấu nhập tại đây và chỉ hiển thị ở section Giải đấu hoặc trang /giai-dau/[slug]. Community chỉ dùng mô tả game ngắn." : resource === "promotions" ? "Chọn đúng loại chương trình. Combo dùng Giá combo + Quyền lợi. Ưu đãi nạp tiền dùng Bảng mốc nạp, không nhập JSON và không dùng nhãn Giá." : undefined}
                />
              </>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
