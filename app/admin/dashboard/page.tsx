import { redirect } from "next/navigation";
import { uploadImage } from "@/app/admin/actions";
import { AdminHeader, AdminNav, AdminNotice, ListToolbar, Overview } from "@/components/admin/AdminShell";
import { LeaderboardQuickEntry } from "@/components/admin/LeaderboardQuickEntry";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { adminButton, adminInput } from "@/components/admin/styles";
import { errorMessages, leaderboardFields, migrationNotices, moduleByKey, moduleFields, moduleGroups, modules } from "@/lib/admin/config";
import { filterRecords, filtersFor, loadCounts, loadModule, loadNewComplaintCount } from "@/lib/admin/data";
import type { ModuleKey } from "@/lib/admin/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const savedMessages: Record<string, string> = { saved: "Đã lưu thay đổi.", deleted: "Đã xóa.", uploaded: "Đã tải ảnh lên." };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ module?: string; q?: string; filter?: string; edit?: string; error?: string; status?: string }> }) {
  if (!isSupabaseConfigured()) redirect("/admin/login?error=config");
  const params = await searchParams;
  const activeModule = modules.some((module) => module.key === params.module) ? params.module as ModuleKey : "overview";
  const q = params.q ?? "";
  const filter = params.filter ?? "all";

  const supabase = await createClient();

  // One round trip: who is signed in, are they an admin, and the data for the active section.
  // Row level security still applies to every query, and anyone who is not an admin is redirected below.
  // Only the active section is loaded. The overview uses count-only requests, so it stays fast as content grows.
  const current = moduleByKey[activeModule];
  const resource = current.resource;
  const [{ data: { user } }, adminCheck, newComplaints, counts, data] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc("is_admin"),
    loadNewComplaintCount(supabase),
    activeModule === "overview" ? loadCounts(supabase) : Promise.resolve(null),
    resource ? loadModule(supabase, current, params.edit) : Promise.resolve(null),
  ]);
  if (!user) redirect("/admin/login");
  if (adminCheck.data !== true) redirect("/admin/login?error=permission");

  const notice = resource ? migrationNotices[resource] : undefined;
  const needsMigration = Boolean(notice && data?.error);
  const loadError = data?.error && !needsMigration ? data.error : undefined;
  const visibleError = params.error ? errorMessages[params.error] ?? params.error : undefined;
  const successMessage = params.status ? savedMessages[params.status] : undefined;

  const moduleHref = `/admin/dashboard?module=${activeModule}${q ? `&q=${encodeURIComponent(q)}` : ""}${filter !== "all" ? `&filter=${filter}` : ""}`;
  const records = resource && data ? filterRecords(data.records, resource, q, filter) : [];
  const navGroups = moduleGroups.map((group) => ({ label: group.label, items: group.keys.map((key) => ({ key, label: moduleByKey[key].label })) }));

  return (
    <main className="min-h-screen bg-ground px-4 pb-16 pt-6 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <AdminHeader email={user.email} />

        {visibleError ? <AdminNotice tone="error">{visibleError}</AdminNotice> : null}
        {loadError ? <AdminNotice tone="error">{`Không thể tải dữ liệu: ${loadError}`}</AdminNotice> : null}
        {needsMigration && notice ? <AdminNotice tone="warning">Mục {notice.name} chưa được kích hoạt trên Supabase. Chạy migration <code>{notice.file}</code> trong SQL Editor, sau đó tải lại trang.</AdminNotice> : null}
        {successMessage && !visibleError ? <AdminNotice tone="success">{successMessage}</AdminNotice> : null}

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="min-w-0 lg:sticky lg:top-4 lg:self-start">
            <AdminNav groups={navGroups} active={activeModule} badges={{ complaints: newComplaints }} />
          </aside>

          <section className="min-w-0 space-y-5">
            {activeModule === "overview" ? (
              <Overview
                newComplaints={newComplaints}
                quickActions={[
                  { href: "/admin/dashboard?module=leaderboard", label: "Nhập xếp hạng tuần này" },
                  { href: "/admin/dashboard?module=tournaments&edit=new", label: "Thêm giải đấu" },
                  { href: "/admin/dashboard?module=promotions&edit=new", label: "Thêm khuyến mãi" },
                  { href: "/admin/dashboard?module=media", label: "Đổi ảnh hoặc video đầu trang" },
                ]}
                groups={moduleGroups.map((group) => ({ label: group.label, items: group.keys.map((key) => ({ key, label: moduleByKey[key].label, count: counts?.[key] ?? null })) }))}
              />
            ) : null}

            {activeModule === "leaderboard" && !params.edit && !needsMigration ? <LeaderboardQuickEntry branches={data?.branches ?? []} returnTo={moduleHref} /> : null}

            {activeModule === "media" && !params.edit ? (
              <details className="rounded-xl bg-panel p-5 sm:p-6">
                <summary className="cursor-pointer py-1 text-lg font-extrabold text-white">Tải ảnh mới lên nhanh</summary>
                <p className="mt-2 max-w-3xl text-base leading-7 text-zinc-300">Ảnh tải lên ở đây chưa hiển thị. Hãy mở dòng ảnh trong danh sách bên dưới rồi bật Hiển thị.</p>
                <form action={uploadImage} className="mt-5 grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="return_to" value={moduleHref} />
                  <select name="bucket" required aria-label="Nhóm ảnh" className={adminInput}><option value="hero">Ảnh đầu trang</option><option value="branches">Cơ sở</option><option value="community">Cộng đồng</option><option value="hall-of-fame">Vinh danh</option><option value="members">Hội viên</option></select>
                  <input name="image_key" placeholder="Vị trí, ví dụ hero-main" aria-label="Vị trí ảnh" required className={adminInput} />
                  <input name="alt_text" placeholder="Mô tả ảnh" aria-label="Mô tả ảnh" required className={adminInput} />
                  <input name="file" type="file" accept="image/jpeg,image/png,image/webp" aria-label="File ảnh" required className={`${adminInput} py-2.5`} />
                  <button className={`${adminButton} md:col-span-2`}>Tải lên</button>
                </form>
              </details>
            ) : null}

            {resource && data && !needsMigration ? (
              <>
                {!params.edit ? <ListToolbar module={activeModule} q={q} filter={filter} filters={filtersFor(resource)} /> : null}
                <ResourceManager
                  title={current.title}
                  hint={current.hint}
                  resource={resource}
                  fields={resource === "leaderboard_entries" ? leaderboardFields(data.branches) : moduleFields[resource]}
                  records={records}
                  selected={data.selected}
                  editing={Boolean(params.edit)}
                  creating={params.edit === "new"}
                  moduleHref={moduleHref}
                  addLabel={current.addLabel}
                  truncated={data.truncated}
                />
              </>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
