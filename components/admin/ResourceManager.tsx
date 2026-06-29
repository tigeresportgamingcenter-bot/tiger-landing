import { saveContent } from "@/app/admin/actions";
import { DeleteContentButton } from "./DeleteContentButton";
import { MediaUploadField } from "./MediaUploadField";

export interface AdminField {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "datetime-local" | "url" | "textarea" | "checkbox" | "select" | "image" | "video";
  required?: boolean;
  options?: string[];
}

interface ResourceManagerProps {
  title: string;
  resource: string;
  fields: AdminField[];
  records: Array<Record<string, unknown>>;
  note?: string;
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
      <label className="text-xs text-zinc-500">
        {field.label}
        <textarea
          name={field.name}
          defaultValue={Array.isArray(value) ? value.join("\n") : typeof value === "object" && value ? JSON.stringify(value) : String(value ?? "")}
          required={field.required}
          rows={3}
          className={`${className} mt-1 py-2`}
        />
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

function Editor({ resource, fields, record }: { resource: string; fields: AdminField[]; record?: Record<string, unknown> }) {
  return (
    <form action={saveContent} className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 md:grid-cols-2">
      <input type="hidden" name="resource" value={resource} />
      {record?.id ? <input type="hidden" name="id" value={String(record.id)} /> : null}
      {fields.map((field) => <Field key={field.name} field={field} record={record} resource={resource} />)}
      <button className="min-h-11 rounded-lg bg-gradient-to-r from-tiger-red to-tiger-orange px-4 text-sm font-bold text-white">
        {record ? "Lưu thay đổi" : "Thêm mới"}
      </button>
    </form>
  );
}

export function ResourceManager({ title, resource, fields, records, note }: ResourceManagerProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">{title}</h2>
          {note ? <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{note}</p> : null}
        </div>
        <span className="text-xs text-zinc-600">{records.length} mục</span>
      </div>
      <details className="rounded-xl border border-tiger-orange/25 bg-tiger-orange/5 p-4">
        <summary className="cursor-pointer font-bold text-orange-300">+ Thêm nội dung</summary>
        <div className="mt-4"><Editor resource={resource} fields={fields} /></div>
      </details>
      {records.map((record) => {
        const label = String(record.name ?? record.display_name ?? record.title ?? record.image_key ?? record.slug ?? record.id);
        const isVisible = Boolean(record.published && record.verified && (resource !== "hall_of_fame_members" || record.consent_confirmed));
        const badge = !record.verified ? "Nháp" : !record.published ? "Đã xác minh" : resource === "tournaments" && record.registration_open ? "Mở đăng ký" : resource === "tournaments" && record.status === "completed" ? "Đã kết thúc" : "Đang hiển thị";
        return (
          <details key={String(record.id)} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <summary className="flex cursor-pointer items-center justify-between gap-4">
              <span className="font-semibold text-zinc-200">{label}</span>
              <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${isVisible ? "bg-emerald-500/10 text-emerald-400" : record.verified ? "bg-blue-500/10 text-blue-400" : "bg-zinc-800 text-zinc-500"}`}>{badge}</span>
            </summary>
            <div className="mt-4 space-y-2">
              <Editor resource={resource} fields={fields} record={record} />
              <DeleteContentButton resource={resource} id={String(record.id)} />
            </div>
          </details>
        );
      })}
    </section>
  );
}
