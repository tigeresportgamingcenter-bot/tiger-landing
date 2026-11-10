import Link from "next/link";
import { saveContent } from "@/app/admin/actions";
import type { AdminField, AdminRecord } from "@/lib/admin/types";
import { DeleteContentButton } from "./DeleteContentButton";
import { MediaUploadField } from "./MediaUploadField";
import { adminButton, adminGhostButton, adminInput, adminLabel } from "./styles";

export type { AdminField } from "@/lib/admin/types";

interface ResourceManagerProps {
  title: string;
  hint?: string;
  resource: string;
  fields: AdminField[];
  records: AdminRecord[];
  /** Full record being edited. Undefined while creating, or when the id was not found. */
  selected?: AdminRecord;
  /** True when the URL asks for the editor (a record id or "new"). */
  editing: boolean;
  /** True when the editor is for a new record. */
  creating: boolean;
  moduleHref: string;
  addLabel?: string;
  truncated?: boolean;
}

const groupLabels: Record<Exclude<NonNullable<AdminField["group"]>, "visibility">, string> = {
  main: "Thông tin chính",
  media: "Hình ảnh và video",
  details: "Nội dung chi tiết",
  status: "Tùy chọn nâng cao",
};

function recordLabel(record: AdminRecord) {
  if (typeof record.branch_slug === "string" && typeof record.period_type === "string") return `#${String(record.rank ?? "")} ${String(record.display_name ?? "")} · ${record.branch_slug} · ${record.period_type === "week" ? "Tuần" : "Tháng"} ${String(record.period_start ?? "")}`;
  return String(record.name ?? record.display_name ?? record.title ?? record.question ?? record.image_key ?? record.slug ?? record.id);
}

function recordStatus(record: AdminRecord, resource: string) {
  const live = Boolean(record.published && record.verified);
  const expired = typeof record.valid_until === "string" && record.valid_until < new Date().toISOString().slice(0, 10);

  if (resource === "tournaments" && record.registration_open) return "Đang mở đăng ký";
  if (resource === "tournaments" && record.status === "completed") return "Đã kết thúc";
  if (expired) return "Hết hạn";
  if (resource === "gear_items" && live && record.out_of_stock) return "Tạm hết";
  if (live && record.featured) return "Nổi bật";
  if (live) return "Đang hiển thị";
  if (record.verified) return "Đã kiểm tra";
  return "Nháp";
}

function pillClass(label: string) {
  if (label === "Hết hạn") return "bg-red-500/20 text-red-200";
  if (["Nổi bật", "Đang hiển thị", "Đang mở đăng ký"].includes(label)) return "bg-accent/20 text-[#e0c2ff]";
  return "bg-white/10 text-zinc-200";
}

function Field({ field, record, resource }: { field: AdminField; record?: AdminRecord; resource: string }) {
  const value = record?.[field.name];

  if (field.type === "image" || field.type === "video") {
    return <MediaUploadField name={field.name} label={field.label} kind={field.type} resource={resource} currentUrl={typeof value === "string" ? value : ""} required={field.required} />;
  }

  if (field.type === "promotion-tiers") {
    return (
      <div data-admin-field={field.name} className="md:col-span-2">
        <p className={adminLabel}>{field.label}</p>
        <p className="mt-1 text-[13px] text-zinc-400">Dùng cho loại “Ưu đãi nạp tiền”. Bỏ trống toàn bộ dòng nếu chưa dùng.</p>
        <div className="mt-3 space-y-3">
          {Array.from({ length: 8 }, (_, index) => {
            const row = index + 1;
            return (
              <div key={row} className="grid gap-3 rounded-lg bg-ground/60 p-3 md:grid-cols-[1fr_1fr_1fr_1.4fr_0.7fr]">
                <label className={adminLabel}>Mức nạp
                  <input name={`tier_${row}_pay_amount`} type="number" min="0" defaultValue={String(record?.[`tier_${row}_pay_amount`] ?? "")} className={`${adminInput} mt-1`} />
                </label>
                <label className={adminLabel}>Khách nhận
                  <input name={`tier_${row}_receive_amount`} type="number" min="0" defaultValue={String(record?.[`tier_${row}_receive_amount`] ?? "")} className={`${adminInput} mt-1`} />
                </label>
                <label className={adminLabel}>Tặng thêm
                  <input name={`tier_${row}_bonus_amount`} type="number" min="0" defaultValue={String(record?.[`tier_${row}_bonus_amount`] ?? "")} className={`${adminInput} mt-1`} />
                </label>
                <label className={adminLabel}>Ghi chú
                  <input name={`tier_${row}_note`} defaultValue={String(record?.[`tier_${row}_note`] ?? "")} className={`${adminInput} mt-1`} />
                </label>
                <label className={adminLabel}>Thứ tự
                  <input name={`tier_${row}_sort_order`} type="number" defaultValue={String(record?.[`tier_${row}_sort_order`] ?? index)} className={`${adminInput} mt-1`} />
                </label>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label data-admin-field={field.name} className="flex min-h-11 items-center gap-3 text-base text-zinc-200">
        <input type="checkbox" name={field.name} defaultChecked={Boolean(value)} className="size-5 accent-violet-500" />
        {field.label}
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label data-admin-field={field.name} className={`${adminLabel} md:col-span-2`}>
        {field.label}
        <textarea name={field.name} defaultValue={typeof value === "string" ? value : ""} required={field.required} rows={4} className={`${adminInput} mt-1 py-3`} />
      </label>
    );
  }

  if (field.type === "select") {
    const first = field.options?.[0];
    return (
      <label data-admin-field={field.name} className={adminLabel}>
        {field.label}
        <select name={field.name} defaultValue={String(value ?? (typeof first === "string" ? first : first?.value) ?? "")} className={`${adminInput} mt-1`}>
          {field.options?.map((option) => {
            const optionValue = typeof option === "string" ? option : option.value;
            const label = typeof option === "string" ? option : option.label;
            return <option key={optionValue} value={optionValue}>{label}</option>;
          })}
        </select>
      </label>
    );
  }

  const inputValue = field.type === "datetime-local" && typeof value === "string" ? value.slice(0, 16) : String(value ?? "");
  return (
    <label data-admin-field={field.name} className={adminLabel}>
      {field.label}
      <input name={field.name} type={field.type ?? "text"} defaultValue={inputValue} required={field.required} className={`${adminInput} mt-1`} />
    </label>
  );
}

const promotionScript = `(() => {
  const form = document.currentScript?.closest("form");
  if (!form) return;
  const type = form.querySelector('[name="promotion_type"]');
  const price = form.querySelector('[data-admin-field="price"]');
  const tiers = form.querySelector('[data-admin-field="promotion_tiers"]');
  const sync = () => {
    const isTopup = type?.value === "topup_bonus";
    if (price) price.style.display = isTopup ? "none" : "";
    if (tiers) tiers.style.display = isTopup ? "" : "none";
  };
  type?.addEventListener("change", sync);
  sync();
})();`;

/** Turning on "show on website" also ticks "checked", which the server requires. Staff can still untick it. */
const visibilityScript = `(() => {
  const form = document.currentScript?.closest("form");
  const published = form?.querySelector('input[name="published"]');
  const verified = form?.querySelector('input[name="verified"]');
  if (published && verified) published.addEventListener("change", () => { if (published.checked) verified.checked = true; });
})();`;

function Editor({ resource, fields, record, backHref }: { resource: string; fields: AdminField[]; record?: AdminRecord; backHref: string }) {
  const grouped = fields.reduce<Record<string, AdminField[]>>((acc, field) => {
    const group = field.group ?? "main";
    acc[group] = [...(acc[group] ?? []), field];
    return acc;
  }, {});
  const orderedGroups = ["main", "media", "details", "status"] as const;
  const visibilityFields = grouped.visibility ?? [];

  return (
    <form action={saveContent} className="space-y-3">
      <input type="hidden" name="resource" value={resource} />
      <input type="hidden" name="return_to" value={backHref} />
      {record?.id ? <input type="hidden" name="id" value={String(record.id)} /> : null}

      {visibilityFields.length ? (
        <div className="rounded-xl bg-panel p-4 sm:p-5">
          <p className="text-lg font-extrabold text-white">Hiển thị trên website</p>
          <p className="mt-1 text-[13px] text-zinc-400">Bật Hiển thị để nội dung xuất hiện ngoài website. Bản nháp chỉ bạn thấy trong trang quản trị.</p>
          <div className="mt-2 grid gap-x-6 md:grid-cols-2">
            {visibilityFields.map((field) => <Field key={field.name} field={field} record={record} resource={resource} />)}
          </div>
        </div>
      ) : null}

      {orderedGroups.map((group) => {
        const groupFields = grouped[group];
        if (!groupFields?.length) return null;
        return (
          <details key={group} open={group === "main" || group === "media"} className="rounded-xl bg-panel p-4 sm:p-5">
            <summary className="cursor-pointer py-1 text-lg font-extrabold text-white">{groupLabels[group]}</summary>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {groupFields.map((field) => <Field key={field.name} field={field} record={record} resource={resource} />)}
            </div>
          </details>
        );
      })}

      {resource === "promotions" ? <script dangerouslySetInnerHTML={{ __html: promotionScript }} /> : null}
      {visibilityFields.length ? <script dangerouslySetInnerHTML={{ __html: visibilityScript }} /> : null}

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap gap-3 bg-ground px-4 py-3 sm:mx-0 sm:px-0">
        <button className={adminButton}>{record ? "Lưu thay đổi" : "Tạo mới"}</button>
        <Link href={backHref} className={adminGhostButton}>Hủy</Link>
      </div>
    </form>
  );
}

export function ResourceManager({ title, hint, resource, fields, records, selected, editing, creating, moduleHref, addLabel, truncated }: ResourceManagerProps) {
  const missing = editing && !creating && !selected;

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl uppercase leading-none text-white">{title}</h2>
          {hint ? <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-300">{hint}</p> : null}
        </div>
        {editing ? null : <Link href={`${moduleHref}&edit=new`} className={adminButton}>{addLabel ?? "Thêm mới"}</Link>}
      </div>

      <div className={editing ? "grid gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]" : ""}>
        <div className={`self-start overflow-hidden rounded-xl bg-panel ${editing ? "hidden xl:block" : ""}`}>
          <div className="grid grid-cols-[1fr_auto] gap-3 px-5 py-4 text-[13px] font-bold uppercase tracking-wider text-zinc-400">
            <span>Danh sách ({records.length}{truncated ? "+" : ""})</span>
            <span>Trạng thái</span>
          </div>
          <div className="max-h-[70vh] space-y-1 overflow-y-auto px-2 pb-2">
            {records.map((record) => {
              const isSelected = selected?.id === record.id;
              const status = recordStatus(record, resource);
              return (
                <Link key={String(record.id)} href={`${moduleHref}&edit=${String(record.id)}`} className={`press grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-3 py-3 transition-colors ${isSelected ? "bg-accent/15" : "hover:bg-white/5"}`}>
                  <span className="min-w-0">
                    <span className="block break-words text-base font-semibold text-zinc-100">{recordLabel(record)}</span>
                    {record.slug ? <span className="mt-1 block truncate text-[13px] text-zinc-400">{String(record.slug)}</span> : null}
                  </span>
                  <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-bold ${pillClass(status)}`}>{status}</span>
                </Link>
              );
            })}
            {!records.length ? <p className="p-4 text-base text-zinc-300">Chưa có mục nào phù hợp.</p> : null}
            {truncated ? <p className="p-4 text-[13px] text-zinc-400">Chỉ hiện 200 mục gần nhất. Dùng ô tìm kiếm để tìm mục cũ hơn.</p> : null}
          </div>
        </div>

        {editing ? (
          <div className="min-w-0">
            <Link href={moduleHref} className="mb-3 inline-flex min-h-11 items-center text-base font-semibold text-zinc-300 underline hover:text-white">← Quay lại danh sách</Link>
            {missing ? (
              <p className="rounded-xl bg-panel p-5 text-base text-zinc-200">Không tìm thấy mục này. Có thể nó đã bị xóa. Hãy chọn lại trong danh sách.</p>
            ) : (
              <>
                <h3 className="mb-3 font-display text-3xl uppercase text-white">{selected ? `Sửa: ${recordLabel(selected)}` : "Thêm mới"}</h3>
                <Editor resource={resource} fields={fields} record={selected} backHref={moduleHref} />
                {selected?.id ? <DeleteContentButton resource={resource} id={String(selected.id)} returnTo={moduleHref} /> : null}
              </>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
