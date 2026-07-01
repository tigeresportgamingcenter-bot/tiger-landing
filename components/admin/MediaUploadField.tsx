"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const imageBuckets = ["hero", "branches", "community", "hall-of-fame", "members"] as const;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
const allowedVideoTypes = ["video/mp4", "video/webm"] as const;

type MediaKind = "image" | "video";

interface MediaUploadFieldProps {
  name: string;
  label: string;
  kind: MediaKind;
  resource: string;
  currentUrl?: string;
  required?: boolean;
}

function extensionFor(file: File) {
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "video/mp4") return "mp4";
  if (file.type === "video/webm") return "webm";
  return "bin";
}

function defaultImageBucket(resource: string) {
  if (resource === "branches") return "branches";
  if (resource === "tournaments") return "hall-of-fame";
  if (resource === "hall_of_fame_members") return "members";
  if (resource === "promotions") return "community";
  if (resource === "site_images") return "hero";
  return "community";
}

function imageBucketFromForm(resource: string, form: HTMLFormElement | null) {
  if (resource !== "gallery_items") return defaultImageBucket(resource);
  const bucket = new FormData(form ?? undefined).get("bucket");
  return typeof bucket === "string" && imageBuckets.includes(bucket as (typeof imageBuckets)[number]) ? bucket : "community";
}

export function MediaUploadField({ name, label, kind, resource, currentUrl = "", required }: MediaUploadFieldProps) {
  const inputId = useId();
  const [url, setUrl] = useState(currentUrl);
  const [status, setStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const className = "min-h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-tiger-orange";
  const isImage = kind === "image";

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    const acceptedTypes = isImage ? allowedImageTypes : allowedVideoTypes;
    const maxSize = isImage ? 5 * 1024 * 1024 : resource === "site_images" ? 12 * 1024 * 1024 : 25 * 1024 * 1024;
    if (!acceptedTypes.includes(file.type as never) || file.size > maxSize) {
      setStatus(isImage ? "Ảnh phải là JPEG/PNG/WebP và tối đa 5MB." : `Video phải là MP4/WebM và tối đa ${resource === "site_images" ? 12 : 25}MB.`);
      event.currentTarget.value = "";
      return;
    }

    setIsUploading(true);
    setStatus("Đang upload lên Supabase Storage...");
    try {
      const form = event.currentTarget.closest("form");
      const bucket = isImage ? imageBucketFromForm(resource, form) : "videos";
      const objectPath = `${resource}/${name}/${Date.now()}-${crypto.randomUUID()}.${extensionFor(file)}`;
      const supabase = createClient();
      const { error } = await supabase.storage.from(bucket).upload(objectPath, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
      setUrl(data.publicUrl);
      setStatus("Upload xong. Bấm Lưu thay đổi để công khai metadata.");

      if (!isImage) {
        const providerSelect = form?.querySelector<HTMLSelectElement>('select[name="video_provider"]');
        if (providerSelect) providerSelect.value = "upload";
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
      event.currentTarget.value = "";
    }
  }

  return (
    <label className="text-xs text-zinc-500 md:col-span-2" htmlFor={inputId}>
      {label}
      {isImage && url ? (
        <span className="relative mt-2 block aspect-[16/7] max-w-md overflow-hidden rounded-lg border border-white/10">
          <Image src={url} alt="Ảnh hiện tại" fill sizes="448px" className="object-cover" />
        </span>
      ) : null}
      <input
        id={inputId}
        name={name}
        type={isImage ? "text" : "url"}
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        required={required && !url}
        placeholder={isImage ? "Dán URL ảnh hoặc upload file bên dưới" : "YouTube, Facebook hoặc URL video ngoài"}
        className={`${className} mt-2`}
      />
      <input
        type="file"
        accept={isImage ? "image/jpeg,image/png,image/webp" : "video/mp4,video/webm"}
        disabled={isUploading}
        onChange={handleFileChange}
        className={`${className} mt-2 h-auto py-2 file:mr-3 file:rounded-md file:border-0 file:bg-tiger-orange file:px-3 file:py-2 file:text-xs file:font-bold file:text-white disabled:cursor-not-allowed disabled:opacity-60`}
      />
      <span className="mt-1 block text-[11px] text-zinc-600">
        {isImage ? "JPEG, PNG hoặc WebP, tối đa 5MB." : `MP4 hoặc WebM, tối đa ${resource === "site_images" ? 12 : 25}MB. File được upload trực tiếp lên Supabase, không đi qua Vercel.`}
      </span>
      {status ? <span className="mt-1 block text-[11px] text-orange-300">{status}</span> : null}
    </label>
  );
}
