import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { TigerMark } from "@/components/ui/TigerMark";
import { adminGhostButton, adminInputBare } from "./styles";

export interface AdminModule {
  key: string;
  label: string;
  resource?: string;
  title: string;
}

type NoticeTone = "error" | "warning" | "success";

const toneClass: Record<NoticeTone, string> = {
  error: "bg-red-500/15 text-red-200",
  warning: "bg-amber-500/15 text-amber-200",
  success: "bg-emerald-500/15 text-emerald-200",
};

export function AdminHeader({ email }: { email?: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <TigerMark />
        <div>
          <p className="text-[13px] font-bold uppercase tracking-widest text-accent">Tiger Esports CMS</p>
          <h1 className="font-display text-4xl uppercase leading-none text-white sm:text-5xl">Quản trị nội dung</h1>
          {email ? <p className="mt-1 text-base text-zinc-400">{email}</p> : null}
        </div>
      </div>
      <div className="flex gap-2">
        <Link href="/" target="_blank" className={adminGhostButton}>Xem website</Link>
        <form action={logout}><button className={adminGhostButton}>Đăng xuất</button></form>
      </div>
    </header>
  );
}

export function AdminNav({ modules, active, badges = {} }: { modules: AdminModule[]; active: string; badges?: Record<string, number> }) {
  return (
    <nav aria-label="Các mục quản trị" className="sticky top-0 z-20 -mx-4 bg-ground px-4 py-2 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:rounded-xl lg:bg-panel lg:p-3">
      <ul className="flex gap-2 overflow-x-auto lg:grid lg:gap-1 lg:overflow-visible">
        {modules.map((module) => {
          const isActive = active === module.key;
          const badge = badges[module.key] ?? 0;
          return (
            <li key={module.key} className="shrink-0">
              <Link
                href={`/admin/dashboard?module=${module.key}`}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 items-center justify-between gap-3 whitespace-nowrap rounded-lg px-4 text-base font-bold transition-colors ${isActive ? "neon-glow bg-accent text-ground" : "bg-panel text-zinc-200 hover:bg-white/10 lg:bg-transparent"}`}
              >
                {module.label}
                {badge > 0 ? <span className={`rounded-full px-2 text-[13px] font-bold ${isActive ? "bg-ground text-white" : "bg-accent text-ground"}`}>{badge}</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function AdminNotice({ tone, children }: { tone: NoticeTone; children: React.ReactNode }) {
  return <p role={tone === "error" ? "alert" : "status"} className={`mt-5 rounded-lg px-4 py-3 text-base leading-7 ${toneClass[tone]}`}>{children}</p>;
}

export function OverviewGrid({ items }: { items: Array<{ key: string; label: string; count: number; pending?: number }> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Link key={item.key} href={`/admin/dashboard?module=${item.key}`} className="press group rounded-xl bg-panel p-5 transition-colors hover:bg-white/10">
          <p className="text-base text-zinc-300">{item.label}</p>
          <p className="mt-2 font-display text-6xl leading-none text-white group-hover:text-accent">{item.count}</p>
          {item.pending ? <p className="mt-3 inline-block rounded-full bg-accent px-3 py-1 text-[13px] font-bold text-ground">{item.pending} mới cần xử lý</p> : null}
        </Link>
      ))}
    </div>
  );
}

export function FilterBar({ module, q, filter }: { module: string; q: string; filter: string }) {
  return (
    <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
      <input type="hidden" name="module" value={module} />
      <input name="q" defaultValue={q} placeholder="Tìm theo tên, slug..." aria-label="Tìm kiếm" className={adminInputBare} />
      <select name="filter" defaultValue={filter} aria-label="Lọc theo trạng thái" className={adminInputBare}>
        <option value="all">Tất cả trạng thái</option>
        <option value="draft">Nháp</option>
        <option value="verified">Đã xác minh</option>
        <option value="published">Đang hiển thị</option>
        <option value="featured">Nổi bật</option>
        <option value="registration_open">Mở đăng ký</option>
        <option value="completed">Đã kết thúc</option>
        <option value="new">Khiếu nại mới</option>
        <option value="in_progress">Khiếu nại đang xử lý</option>
        <option value="resolved">Khiếu nại đã giải quyết</option>
      </select>
      <button className={adminGhostButton}>Lọc</button>
    </form>
  );
}
