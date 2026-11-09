import { complaintCategoryLabel } from "@/lib/complaints";
import type { createClient } from "@/lib/supabase/server";
import { modules } from "./config";
import type { AdminModuleConfig, AdminRecord } from "./types";

type Supabase = Awaited<ReturnType<typeof createClient>>;

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const listLimit = 200;

/** Number of complaints nobody has looked at yet. One tiny query, safe when the table does not exist. */
export async function loadNewComplaintCount(supabase: Supabase) {
  const { count, error } = await supabase.from("complaints").select("id", { count: "exact", head: true }).eq("status", "new");
  return error ? 0 : count ?? 0;
}

/** Row counts for the overview only. Head requests return no rows, so this stays fast. */
export async function loadCounts(supabase: Supabase) {
  const tracked = modules.filter((module) => module.resource);
  const results = await Promise.all(tracked.map((module) => supabase.from(module.resource as string).select("id", { count: "exact", head: true })));
  return Object.fromEntries(tracked.map((module, index) => [module.key, results[index].error ? null : results[index].count ?? 0])) as Record<string, number | null>;
}

export interface ModuleData {
  records: AdminRecord[];
  selected?: AdminRecord;
  branches: Array<{ slug: string; name: string }>;
  error?: string;
  truncated: boolean;
}

export async function loadModule(supabase: Supabase, module: AdminModuleConfig, edit?: string): Promise<ModuleData> {
  const resource = module.resource as string;
  const editId = edit && uuidPattern.test(edit) ? edit : undefined;
  const isLeaderboard = resource === "leaderboard_entries";

  const base = supabase.from(resource).select(module.listColumns ?? "*");
  const listQuery = (isLeaderboard ? base.order("period_start", { ascending: false }).order("rank") : base.order("created_at", { ascending: false })).limit(listLimit);

  const [list, detail, tiers, branches] = await Promise.all([
    listQuery,
    editId ? supabase.from(resource).select("*").eq("id", editId).maybeSingle() : Promise.resolve(null),
    editId && resource === "promotions" ? supabase.from("promotion_tiers").select("*").eq("promotion_id", editId).order("sort_order") : Promise.resolve(null),
    isLeaderboard ? supabase.from("branches").select("slug, name").order("sort_order") : Promise.resolve(null),
  ]);

  const records = (list.data ?? []) as unknown as AdminRecord[];
  const detailRecord = (detail?.data ?? undefined) as AdminRecord | undefined;
  return {
    records,
    selected: detailRecord ? normalizeRecord(resource, detailRecord, (tiers?.data ?? []) as AdminRecord[]) : undefined,
    branches: ((branches?.data ?? []) as unknown as Array<{ slug: string; name: string }>),
    error: list.error?.message,
    truncated: records.length >= listLimit,
  };
}

function strings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

/** Turns a stored row into the flat shape the edit form expects. */
function normalizeRecord(resource: string, record: AdminRecord, promotionTiers: AdminRecord[]): AdminRecord {
  if (resource === "promotions") {
    const highlights = strings(record.highlights);
    const tierFields = Object.fromEntries(promotionTiers.slice(0, 8).flatMap((tier, index) => {
      const row = index + 1;
      return [[`tier_${row}_pay_amount`, tier.pay_amount ?? ""], [`tier_${row}_receive_amount`, tier.receive_amount ?? ""], [`tier_${row}_bonus_amount`, tier.bonus_amount ?? ""], [`tier_${row}_note`, tier.note ?? ""], [`tier_${row}_sort_order`, tier.sort_order ?? index]];
    }));
    return { ...record, promotion_type: record.promotion_type ?? "combo", ...tierFields, ...Object.fromEntries([0, 1, 2, 3, 4].map((index) => [`highlight_${index + 1}`, highlights[index] ?? ""])) };
  }
  if (resource === "tournaments") {
    const placements = Array.isArray(record.placements) ? record.placements as Array<Record<string, unknown>> : [];
    const highlights = strings(record.highlights);
    return {
      ...record,
      ...Object.fromEntries([1, 2, 3].map((position) => [`top_${position}`, placements.find((placement) => placement.position === position)?.displayName ?? ""])),
      ...Object.fromEntries([0, 1, 2, 3, 4].map((index) => [`highlight_${index + 1}`, highlights[index] ?? ""])),
    };
  }
  if (resource === "complaints") {
    return {
      ...record,
      category: complaintCategoryLabel(String(record.category ?? "")),
      created_at: typeof record.created_at === "string" ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(record.created_at)) : "",
    };
  }
  if (resource === "hall_of_fame_members") {
    return { ...record, honor_month: typeof record.honor_month === "string" ? record.honor_month.slice(0, 7) : "" };
  }
  return record;
}

export interface ListFilter { value: string; label: string }

export function filtersFor(resource: string): ListFilter[] {
  if (resource === "complaints") return [{ value: "all", label: "Tất cả" }, { value: "new", label: "Mới" }, { value: "in_progress", label: "Đang xử lý" }, { value: "resolved", label: "Đã giải quyết" }];
  if (resource === "tournaments") return [{ value: "all", label: "Tất cả" }, { value: "registration_open", label: "Mở đăng ký" }, { value: "completed", label: "Đã kết thúc" }, { value: "draft", label: "Nháp" }];
  return [{ value: "all", label: "Tất cả" }, { value: "published", label: "Đang hiển thị" }, { value: "draft", label: "Nháp" }];
}

function matchesFilter(record: AdminRecord, resource: string, filter: string) {
  if (filter === "all") return true;
  const live = Boolean(record.published && record.verified);
  if (filter === "published") return live;
  if (filter === "draft") return !live;
  if (filter === "registration_open") return Boolean(record.registration_open);
  if (resource === "complaints") return String(record.status ?? "new") === filter;
  return record.status === filter;
}

export function filterRecords(records: AdminRecord[], resource: string, q: string, filter: string) {
  const needle = q.trim().toLowerCase();
  return records.filter((record) => {
    const haystack = [record.name, record.title, record.display_name, record.question, record.code, record.customer_name, record.slug, record.image_key, record.branch_slug]
      .map((item) => String(item ?? "").toLowerCase()).join(" ");
    return (!needle || haystack.includes(needle)) && matchesFilter(record, resource, filter);
  });
}
