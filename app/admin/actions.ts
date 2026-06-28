"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const resources = ["branches", "promotions", "tournaments", "hall_of_fame_members", "site_images", "gallery_items"] as const;
type Resource = (typeof resources)[number];
const buckets = ["hero", "branches", "community", "hall-of-fame", "members"] as const;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function checked(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect("/admin/login?error=config");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: membership } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!membership) redirect("/admin/login?error=permission");
  return supabase;
}

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/admin/login?error=config");
  const email = text(formData, "email");
  const password = text(formData, "password");
  if (!email || !password) redirect("/admin/login?error=credentials");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?error=credentials");
  const { data: { user } } = await supabase.auth.getUser();
  const { data: membership } = await supabase.from("admin_users").select("user_id").eq("user_id", user?.id ?? "").maybeSingle();
  if (!membership) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=permission");
  }
  revalidatePath("/admin", "layout");
  redirect("/admin/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function buildPayload(resource: Resource, formData: FormData): Record<string, unknown> {
  const common = { published: checked(formData, "published"), verified: checked(formData, "verified") };
  if (resource === "branches") return { ...common, slug: text(formData, "slug"), name: text(formData, "name"), area: text(formData, "area"), address: text(formData, "address"), map_url: text(formData, "map_url"), phone: text(formData, "phone"), opening_hours: text(formData, "opening_hours"), status: text(formData, "status") ?? "unverified", description: text(formData, "description") ?? "", image_url: text(formData, "image_url"), image_alt: text(formData, "image_alt"), sort_order: Number(text(formData, "sort_order") ?? 0) };
  if (resource === "promotions") return { ...common, slug: text(formData, "slug"), name: text(formData, "name"), price: Number(text(formData, "price") ?? 0), highlights: (text(formData, "highlights") ?? "").split("\n").map((item) => item.trim()).filter(Boolean), note: text(formData, "note") ?? "", image_url: text(formData, "image_url"), valid_from: text(formData, "valid_from"), valid_until: text(formData, "valid_until"), featured: checked(formData, "featured") };
  if (resource === "tournaments") {
    let placements: unknown[] = [];
    try { placements = JSON.parse(text(formData, "placements") ?? "[]") as unknown[]; } catch { throw new Error("placements-json"); }
    return { ...common, slug: text(formData, "slug"), name: text(formData, "name"), game: text(formData, "game"), description: text(formData, "description") ?? "", held_on: text(formData, "held_on"), branch_name: text(formData, "branch_name"), placements, image_url: text(formData, "image_url"), image_alt: text(formData, "image_alt") };
  }
  if (resource === "hall_of_fame_members") return { ...common, display_name: text(formData, "display_name"), tier: text(formData, "tier"), period_label: text(formData, "period_label"), image_url: text(formData, "image_url"), image_alt: text(formData, "image_alt"), consent_confirmed: checked(formData, "consent_confirmed") };
  if (resource === "site_images") return { ...common, image_key: text(formData, "image_key"), bucket: text(formData, "bucket"), object_path: text(formData, "object_path"), public_url: text(formData, "public_url"), alt_text: text(formData, "alt_text") };
  return { ...common, title: text(formData, "title"), image_url: text(formData, "image_url"), image_alt: text(formData, "image_alt"), bucket: text(formData, "bucket"), sort_order: Number(text(formData, "sort_order") ?? 0) };
}

export async function saveContent(formData: FormData) {
  const resource = text(formData, "resource") as Resource | null;
  if (!resource || !resources.includes(resource)) return;
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  let payload: Record<string, unknown>;
  try { payload = buildPayload(resource, formData); } catch { redirect("/admin/dashboard?error=placements-json"); }
  const query = id ? supabase.from(resource).update(payload).eq("id", id) : supabase.from(resource).insert(payload);
  const { error } = await query;
  if (error) redirect(`/admin/dashboard?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function deleteContent(formData: FormData) {
  const resource = text(formData, "resource") as Resource | null;
  const id = text(formData, "id");
  if (!resource || !resources.includes(resource) || !id) return;
  const supabase = await requireAdmin();
  const { error } = await supabase.from(resource).delete().eq("id", id);
  if (error) redirect(`/admin/dashboard?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function uploadImage(formData: FormData) {
  const supabase = await requireAdmin();
  const bucket = text(formData, "bucket");
  const imageKey = text(formData, "image_key");
  const altText = text(formData, "alt_text");
  const file = formData.get("file");
  if (!bucket || !buckets.includes(bucket as (typeof buckets)[number]) || !imageKey || !altText || !(file instanceof File)) return;
  if (!allowedImageTypes.includes(file.type as (typeof allowedImageTypes)[number]) || file.size === 0 || file.size > 5 * 1024 * 1024) redirect("/admin/dashboard?error=invalid-image");
  const extension = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
  const objectPath = `${Date.now()}-${randomUUID()}.${extension}`;
  const { data: existingImage } = await supabase.from("site_images").select("bucket, object_path").eq("image_key", imageKey).maybeSingle();
  const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, file, { contentType: file.type, upsert: false });
  if (uploadError) redirect(`/admin/dashboard?error=${encodeURIComponent(uploadError.message)}`);
  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  const { error } = await supabase.from("site_images").upsert({ image_key: imageKey, bucket, object_path: objectPath, public_url: publicUrl.publicUrl, alt_text: altText, published: false, verified: false }, { onConflict: "image_key" });
  if (error) {
    await supabase.storage.from(bucket).remove([objectPath]);
    redirect(`/admin/dashboard?error=${encodeURIComponent(error.message)}`);
  }
  if (existingImage?.bucket && existingImage.object_path && (existingImage.bucket !== bucket || existingImage.object_path !== objectPath)) {
    await supabase.storage.from(existingImage.bucket).remove([existingImage.object_path]);
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}
