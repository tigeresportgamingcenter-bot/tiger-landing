import Link from "next/link";
import { saveContent } from "@/app/admin/actions";
import { DeleteContentButton } from "./DeleteContentButton";
import { MediaUploadField } from "./MediaUploadField";

export interface AdminField {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "datetime-local" | "url" | "textarea" | "checkbox" | "select" | "image" | "video";
  required?: boolean;
  options?: string[];
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
  return String(record.name ?? record.display_name ?? record.title ?? record.image_key ?? record.slug ?? record.id);
}

function recordStatus(record: Record<string, unknown>, resource: string) {
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

function Field({ field, record, resource }: { field: AdminField; record?: Record<string, unknown>; resource: string }) {
  const value = record?.[field.name];
  const className = "min-h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-tiger-orange";

  if (field.type === "image") {
    return <MediaUploadField name={field.name} label={field.label} kind="image" resource={resource} currentUrl={typeof value === "string" ? value : ""} required={field.required} />;
  }

  if (field.type === "video") {
    return <MediaUploadField name={field.name} label={field.label} kind="video" resource={resource} currentUrl={typeof value === "string" ? value : ""} required={field.required} />;
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex min-h-11 items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" name={field.name} defaultChecked={Boolean(value)} className="size-4 accent-orange-500" />
        {field.label}
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="text-xs text-zinc-500 md:col-span-2">
        {field.label}
        <textarea name={field.name} defaultValue={typeof value === "string" ? value : ""} required={field.required} rows={3} className={`${className} mt-1 py-2`} />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="text-xs text-zinc-500">
        {field.label}
        <select name={field.name} defaultValue={String(value ?? field.options?.[0] ?? "")} className={`${className} mt-1`}>
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
    );
  }

  const inputValue = field.type === "datetime-local" && typeof value === "string" ? value.slice(0, 16) : String(value ?? "");
  return (
    <label className="text-xs text-zinc-500">
      {field.label}
      <input name={field.name} type={field.type ?? "text"} defaultValue={inputValue} required={field.required} className={`${className} mt-1`} />
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
    <form action={saveContent} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <input type="hidden" name="resource" value={resource} />
      <input type="hidden" name="return_to" value={returnTo} />
      {record?.id ? <input type="hidden" name="id" value={String(record.id)} /> : null}
      {orderedGroups.map((group, index) => {
        const groupFields = groupedFields[group];
        if (!groupFields?.length) return null;
        return (
          <details key={group} open={index === 0} className="rounded-xl border border-white/10 bg-black/25 p-4">
            <summary className="cursor-pointer text-sm font-extrabold text-white">{groupLabels[group]}</summary>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {groupFields.map((field) => <Field key={field.name} field={field} record={record} resource={resource} />)}
            </div>
          </details>
        );
      })}
      <div className="flex flex-wrap gap-2">
        <button className="min-h-11 rounded-lg bg-gradient-to-r from-tiger-red to-tiger-orange px-5 text-sm font-bold text-white">{record ? "Lưu thay đổi" : "Tạo mới"}</button>
        <Link href={returnTo} className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-5 text-sm font-bold text-white">Hủy</Link>
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
          <h2 className="text-2xl font-extrabold text-white">{title}</h2>
          {note ? <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">{note}</p> : null}
        </div>
        <Link href={`${moduleHref}&edit=new`} className="inline-flex min-h-11 items-center rounded-lg bg-tiger-orange px-4 text-sm font-bold text-white">Tạo mới</Link>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.25fr]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
          <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <span>Danh sách ({records.length})</span>
            <span>Trạng thái</span>
          </div>
          <div className="max-h-[640px] overflow-y-auto">
            {records.map((record) => {
              const isSelected = selectedRecord?.id === record.id;
              const href = `${moduleHref}&edit=${String(record.id)}`;
              return (
                <div key={String(record.id)} className={`grid grid-cols-[1fr_auto] items-center gap-3 border-b border-white/5 px-4 py-3 ${isSelected ? "bg-tiger-orange/10" : ""}`}>
                  <div>
                    <Link href={href} className="font-semibold text-zinc-100 hover:text-tiger-orange">{recordLabel(record)}</Link>
                    <p className="mt-1 text-xs text-zinc-600">{String(record.slug ?? record.image_key ?? record.id)}</p>
                  </div>
                  <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-bold text-zinc-400">{recordStatus(record, resource)}</span>
                </div>
              );
            })}
            {!records.length ? <p className="p-5 text-sm text-zinc-500">Chưa có bản ghi phù hợp.</p> : null}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-zinc-400">{formRecord ? `Sửa: ${recordLabel(formRecord)}` : "Tạo bản ghi mới"}</h3>
          <Editor resource={resource} fields={fields} record={formRecord} returnTo={returnTo} />
          {formRecord?.id ? <DeleteContentButton resource={resource} id={String(formRecord.id)} returnTo={returnTo} /> : null}
        </div>
      </div>
    </section>
  );
}
