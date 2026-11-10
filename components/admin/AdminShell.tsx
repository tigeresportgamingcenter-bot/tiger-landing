import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { TigerMark } from "@/components/ui/TigerMark";
import type { ListFilter } from "@/lib/admin/data";
import { adminGhostButton, adminInputBare } from "./styles";

type NoticeTone = "error" | "warning" | "success";

const toneClass: Record<NoticeTone, string> = {
  error: "bg-red-500/15 text-red-200",
  warning: "bg-amber-500/15 text-amber-200",
  success: "bg-emerald-500/15 text-emerald-200",
};

export interface NavItem { key: string; label: string }
export interface NavGroup { label: string; items: NavItem[] }

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

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={`/admin/dashboard?module=${item.key}`}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-11 items-center justify-between gap-3 whitespace-nowrap rounded-lg px-4 text-base font-bold transition-colors ${active ? "neon-glow bg-accent text-ground" : "bg-panel text-zinc-200 hover:bg-white/10 lg:bg-transparent"}`}
    >
      {item.label}
    </Link>
  );
}

/** Phone: one scrolling row of chips. Desktop: a sidebar with the sections grouped under headings. */
export function AdminNav({ groups, active }: { groups: NavGroup[]; active: string }) {
  return (
    <nav aria-label="Các mục quản trị" className="sticky top-0 z-20 -mx-4 bg-ground px-4 py-2 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:rounded-xl lg:bg-panel lg:p-3">
      <div className="flex gap-2 overflow-x-auto lg:block">
        <NavLink item={{ key: "overview", label: "Tổng quan" }} active={active === "overview"} />
        {groups.map((group) => (
          <div key={group.label} className="flex gap-2 lg:mt-4 lg:block">
            <p className="hidden px-4 pb-1 text-[13px] font-bold uppercase tracking-wider text-zinc-400 lg:block">{group.label}</p>
            <ul className="flex gap-2 lg:grid lg:gap-1">
              {group.items.map((item) => <li key={item.key} className="shrink-0"><NavLink item={item} active={active === item.key} /></li>)}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

export function AdminNotice({ tone, children }: { tone: NoticeTone; children: React.ReactNode }) {
  return <p role={tone === "error" ? "alert" : "status"} className={`mt-5 rounded-lg px-4 py-3 text-base leading-7 ${toneClass[tone]}`}>{children}</p>;
}

export interface OverviewData {
  quickActions: Array<{ href: string; label: string }>;
  groups: Array<{ label: string; items: Array<{ key: string; label: string; count: number | null }> }>;
}

export function Overview({ quickActions, groups }: OverviewData) {
  return (
    <div className="space-y-8">
      <section aria-labelledby="quick">
        <h2 id="quick" className="font-display text-3xl uppercase text-white">Việc hay làm</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {quickActions.map((action) => <Link key={action.href} href={action.href} className={adminGhostButton}>{action.label}</Link>)}
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.label} aria-label={group.label}>
          <h2 className="font-display text-3xl uppercase text-white">{group.label}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((item) => (
              <Link key={item.key} href={`/admin/dashboard?module=${item.key}`} className="press group flex items-center justify-between gap-4 rounded-xl bg-panel p-5 transition-colors hover:bg-white/10">
                <span className="text-lg font-semibold text-zinc-100 group-hover:text-accent">{item.label}</span>
                <span className="font-display text-4xl leading-none text-white">{item.count ?? "–"}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function ListToolbar({ module, q, filter, filters }: { module: string; q: string; filter: string; filters: ListFilter[] }) {
  const href = (value: string) => `/admin/dashboard?module=${module}${q ? `&q=${encodeURIComponent(q)}` : ""}${value !== "all" ? `&filter=${value}` : ""}`;
  return (
    <div className="space-y-3">
      <form className="flex gap-2">
        <input type="hidden" name="module" value={module} />
        {filter !== "all" ? <input type="hidden" name="filter" value={filter} /> : null}
        <input name="q" defaultValue={q} placeholder="Tìm theo tên..." aria-label="Tìm kiếm" className={adminInputBare} />
        <button className={adminGhostButton}>Tìm</button>
      </form>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo trạng thái">
        {filters.map((item) => (
          <Link key={item.value} href={href(item.value)} aria-current={filter === item.value ? "true" : undefined} className={`press inline-flex min-h-11 items-center rounded-full px-4 text-base font-semibold transition-colors ${filter === item.value ? "bg-accent text-ground" : "bg-panel text-zinc-200 hover:bg-white/10"}`}>{item.label}</Link>
        ))}
      </div>
    </div>
  );
}
