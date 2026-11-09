import Link from "next/link";
import { saveContent } from "@/app/admin/actions";
import { complaintStatusLabel } from "@/lib/complaints";
import { DeleteContentButton } from "./DeleteContentButton";
import { MediaUploadField } from "./MediaUploadField";
import { adminButton, adminGhostButton, adminInput, adminLabel } from "./styles";

export interface AdminField {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "month" | "datetime-local" | "url" | "textarea" | "checkbox" | "select" | "image" | "video" | "promotion-tiers" | "readonly";
  required?: boolean;
  options?: Array<string | { label: string; value: string }>;
  group?: "main" | "media" | "status" | "details";
}

interface ResourceManagerProps {
  title: string;
  resource: string;
  fields: AdminField[];
  records: Array<Record<string, unknown>>;
  moduleHref: string;
  returnTo: string;
  selectedId?: string;
  note?: string;
}

const groupLabels: Record<NonNullable<AdminField["group"]>, string> = {
  main: "Thông tin chính",
  media: "Hình ảnh / Video",
  details: "Nội dung chi tiết",
  status: "Trạng thái hiển thị",
};

function recordLabel(record: Record<string, unknown>) {
  if (typeof record.code === "string" && typeof record.customer_name === "string") return `${record.code} · ${record.customer_name}`;
  if (typeof record.branch_slug === "string" && typeof record.period_type === "string") return `#${String(record.rank ?? "")} ${String(record.display_name ?? "")} · ${record.branch_slug} · ${record.period_type === "week" ? "Tuần" : "Tháng"} ${String(record.period_start ?? "")}`;
  return String(record.name ?? record.display_name ?? record.title ?? record.question ?? record.image_key ?? record.slug ?? record.id);
}

function recordStatus(record: Record<string, unknown>, resource: string) {
  if (resource === "complaints") return complaintStatusLabel(String(record.status ?? "new"));
  const published = Boolean(record.published);
  const verified = Boolean(record.verified);
  const featured = Boolean(record.featured);
  const expired = typeof record.valid_until === "string" && record.valid_until < new Date().toISOString().slice(0, 10);

  if (resource === "tournaments" && record.registration_open) return "Đang mở đăng ký";
  if (resource === "tournaments" && record.status === "completed") return "Đã kết thúc";
  if (expired) return "Hết hạn";
  if (published && verified && featured) return "Nổi bật";
  if (published && verified) return "Đang hiển thị";
  if (verified) return "Đã xác minh";
  return "Nháp";
}

function pillClass(label: string) {
  if (label === "Mới tiếp nhận") return "bg-accent text-ground";
  if (label === "Hết hạn" || label === "Đã từ chối") return "bg-red-500/20 text-red-200";
  if (["Nổi bật", "Đang hiển thị", "Đang mở đăng ký", "Đã giải quyết"].includes(label)) return "bg-accent/20 text-[#e0c2ff]";
  return "bg-white/10 text-zinc-200";
}

function Field({ field, record, resource }: { field: AdminField; record?: Record<string, unknown>; resource: string }) {
  const value = record?.[field.name];

  if (field.type === "readonly") {
    return (
      <div data-admin-field={field.name} className="md:col-span-2">
        <p className={adminLabel}>{field.label}</p>
        <p className="mt-1 whitespace-pre-line rounded-lg bg-ground px-3 py-3 text-base leading-7 text-zinc-100">{String(value ?? "") || "—"}</p>
      </div>
    );
  }

  if (field.type === "image") {
    return <MediaUploadField name={field.name} label={field.label} kind="image" resource={resource} currentUrl={typeof value === "string" ? value : ""} required={field.required} />;
  }

  if (field.type === "video") {
    return <MediaUploadField name={field.name} label={field.label} kind="video" resource={resource} currentUrl={typeof value === "string" ? value : ""} required={field.required} />;
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
    return (
      <label data-admin-field={field.name} className={adminLabel}>
        {field.label}
        <select name={field.name} defaultValue={String(value ?? (typeof field.options?.[0] === "string" ? field.options[0] : field.options?.[0]?.value) ?? "")} className={`${adminInput} mt-1`}>
          {field.options?.map((option) => {
            const value = typeof option === "string" ? option : option.value;
            const label = typeof option === "string" ? option : option.label;
            return <option key={value} value={value}>{label}</option>;
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

function Editor({ resource, fields, record, returnTo }: { resource: string; fields: AdminField[]; record?: Record<string, unknown>; returnTo: string }) {
  const groupedFields = fields.reduce<Record<string, AdminField[]>>((acc, field) => {
    const group = field.group ?? "main";
    acc[group] = [...(acc[group] ?? []), field];
    return acc;
  }, {});

  const orderedGroups: Array<NonNullable<AdminField["group"]>> = ["main", "media", "details", "status"];

  return (
    <form action={saveContent} className="space-y-3">
      <input type="hidden" name="resource" value={resource} />
      <input type="hidden" name="return_to" value={returnTo} />
      {record?.id ? <input type="hidden" name="id" value={String(record.id)} /> : null}
      {orderedGroups.map((group, index) => {
        const groupFields = groupedFields[group];
        if (!groupFields?.length) return null;
        return (
          <details key={group} open={index === 0} className="rounded-xl bg-panel p-4 sm:p-5">
            <summary className="cursor-pointer py-1 text-lg font-extrabold text-white">{groupLabels[group]}</summary>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {groupFields.map((field) => <Field key={field.name} field={field} record={record} resource={resource} />)}
            </div>
          </details>
        );
      })}
      {resource === "promotions" ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
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
            })();`,
          }}
        />
      ) : null}
      <div className="flex flex-wrap gap-3 pt-1">
        <button className={adminButton}>{record ? "Lưu thay đổi" : "Tạo mới"}</button>
        <Link href={returnTo} className={adminGhostButton}>Hủy</Link>
      </div>
    </form>
  );
}

export function ResourceManager({ title, resource, fields, records, moduleHref, returnTo, selectedId, note }: ResourceManagerProps) {
  const selectedRecord = selectedId ? records.find((record) => String(record.id) === selectedId) : undefined;
  const formRecord = selectedId === "new" ? undefined : selectedRecord;

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl uppercase leading-none text-white">{title}</h2>
          {note ? <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-300">{note}</p> : null}
        </div>
        {resource === "complaints" ? null : <Link href={`${moduleHref}&edit=new`} className={adminButton}>Tạo mới</Link>}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.25fr]">
        <div className="overflow-hidden rounded-xl bg-panel self-start">
          <div className="grid grid-cols-[1fr_auto] gap-3 px-5 py-4 text-[13px] font-bold uppercase tracking-wider text-zinc-400">
            <span>Danh sách ({records.length})</span>
            <span>Trạng thái</span>
          </div>
          <div className="max-h-[640px] space-y-1 overflow-y-auto px-2 pb-2">
            {records.map((record) => {
              const isSelected = selectedRecord?.id === record.id;
              const href = `${moduleHref}&edit=${String(record.id)}`;
              const status = recordStatus(record, resource);
              return (
                <div key={String(record.id)} className={`grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-3 py-3 transition-colors ${isSelected ? "bg-accent/15" : "hover:bg-white/5"}`}>
                  <div className="min-w-0">
                    <Link href={href} className="block break-words text-base font-semibold text-zinc-100 hover:text-accent">{recordLabel(record)}</Link>
                    <p className="mt-1 truncate text-[13px] text-zinc-400">{String(record.slug ?? record.image_key ?? record.id)}</p>
                  </div>
                  <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-bold ${pillClass(status)}`}>{status}</span>
                </div>
              );
            })}
            {!records.length ? <p className="p-4 text-base text-zinc-300">Chưa có bản ghi phù hợp.</p> : null}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-zinc-300">{formRecord ? `Sửa: ${recordLabel(formRecord)}` : "Tạo bản ghi mới"}</h3>
          <Editor resource={resource} fields={fields} record={formRecord} returnTo={returnTo} />
          {formRecord?.id ? <DeleteContentButton resource={resource} id={String(formRecord.id)} returnTo={returnTo} /> : null}
        </div>
      </div>
    </section>
  );
}
