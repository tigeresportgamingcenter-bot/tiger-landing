"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const resources = ["branches", "promotions", "tournaments", "hall_of_fame_members", "site_images", "gallery_items", "pc_tiers"] as const;
type Resource = (typeof resources)[number];
const buckets = ["hero", "branches", "community", "hall-of-fame", "members"] as const;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
const allowedVideoTypes = ["video/mp4", "video/webm"] as const;

function imageBucket(resource: Resource, formData: FormData) {
  if (resource === "branches") return "branches";
  if (resource === "tournaments") return "hall-of-fame";
  if (resource === "hall_of_fame_members") return "members";
  if (resource === "promotions") return "community";
  if (resource === "gallery_items") return text(formData, "bucket");
  return null;
}

async function uploadResourceMedia(supabase: Awaited<ReturnType<typeof requireAdmin>>, resource: Resource, formData: FormData) {
  const uploaded: Array<{ bucket: string; objectPath: string }> = [];
  const fields = ["image_url", "poster_url", "video_url"] as const;
  for (const field of fields) {
    const file = formData.get(`${field}_file`);
    if (!(file instanceof File) || file.size === 0) continue;
    const isVideo = field === "video_url";
    const bucket = isVideo ? "videos" : imageBucket(resource, formData);
    if (!bucket || (!isVideo && !buckets.includes(bucket as (typeof buckets)[number]))) throw new Error("invalid-media-bucket");
    if (isVideo && (!allowedVideoTypes.includes(file.type as (typeof allowedVideoTypes)[number]) || file.size > 25 * 1024 * 1024)) throw new Error("invalid-video");
    if (!isVideo && (!allowedImageTypes.includes(file.type as (typeof allowedImageTypes)[number]) || file.size > 5 * 1024 * 1024)) throw new Error("invalid-image");
    const extension = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : file.type === "video/mp4" ? "mp4" : file.type === "video/webm" ? "webm" : "webp";
    const objectPath = `${resource}/${field}/${Date.now()}-${randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from(bucket).upload(objectPath, file, { contentType: file.type, upsert: false });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    formData.set(field, data.publicUrl);
    if (isVideo) formData.set("video_provider", "upload");
    uploaded.push({ bucket, objectPath });
  }
  return uploaded;
}

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function checked(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function repeatedText(formData: FormData, prefix: string, count: number) {
  return Array.from({ length: count }, (_, index) => text(formData, `${prefix}_${index + 1}`)).filter((item): item is string => Boolean(item));
}

function promotionType(formData: FormData) {
  const value = text(formData, "promotion_type");
  return value === "topup_bonus" || value === "gift" || value === "event" || value === "discount" || value === "other" ? value : "combo";
}

function numberOrNull(formData: FormData, name: string) {
  const value = text(formData, name);
  return value ? Number(value) : null;
}

function promotionTierPayload(formData: FormData) {
  return Array.from({ length: 8 }, (_, index) => {
    const row = index + 1;
    const payAmount = numberOrNull(formData, `tier_${row}_pay_amount`);
    const receiveAmount = numberOrNull(formData, `tier_${row}_receive_amount`);
    const enteredBonusAmount = numberOrNull(formData, `tier_${row}_bonus_amount`);
    const note = text(formData, `tier_${row}_note`);
    const sortOrder = Number(text(formData, `tier_${row}_sort_order`) ?? index);
    if (!payAmount && !receiveAmount && !enteredBonusAmount && !note) return null;
    if (!payAmount || payAmount <= 0 || !receiveAmount || receiveAmount <= 0 || receiveAmount < payAmount) throw new Error("invalid-promotion-tier");
    const bonusAmount = enteredBonusAmount !== null ? enteredBonusAmount : receiveAmount - payAmount;
    return { pay_amount: payAmount, receive_amount: receiveAmount, bonus_amount: bonusAmount, note, sort_order: sortOrder };
  }).filter((item): item is { pay_amount: number; receive_amount: number; bonus_amount: number; note: string | null; sort_order: number } => Boolean(item));
}

function dashboardReturn(formData: FormData, status: "saved" | "deleted" | "uploaded", error?: string) {
  const returnTo = text(formData, "return_to") ?? "/admin/dashboard";
  const separator = returnTo.includes("?") ? "&" : "?";
  return `${returnTo}${separator}${error ? `error=${encodeURIComponent(error)}` : `status=${status}`}`;
}

function isValidWebUrl(value: string) {
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}

function isValidImageUrl(value: string) {
  if (value.startsWith("/images/")) return true;
  try { const url = new URL(value); return url.protocol === "https:" && url.hostname.endsWith(".supabase.co") && url.pathname.startsWith("/storage/v1/object/public/"); } catch { return false; }
}

function videoProvider(formData: FormData) {
  const value = text(formData, "video_provider");
  return value === "upload" || value === "youtube" || value === "facebook" || value === "external" ? value : "external";
}

function validateCommon(formData: FormData) {
  if (checked(formData, "published") && !checked(formData, "verified")) throw new Error("publish-requires-verified");
  const imageUrl = text(formData, "image_url");
  if (imageUrl && !isValidImageUrl(imageUrl)) throw new Error("invalid-image-url");
  const posterUrl = text(formData, "poster_url");
  if (posterUrl && !isValidImageUrl(posterUrl)) throw new Error("invalid-poster-url");
  const videoUrl = text(formData, "video_url");
  if (videoUrl && !isValidWebUrl(videoUrl)) throw new Error("invalid-video-url");
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
  validateCommon(formData);
  const common = { published: checked(formData, "published"), verified: checked(formData, "verified") };
  if (resource === "branches") return { ...common, slug: text(formData, "slug"), name: text(formData, "name"), area: text(formData, "area"), address: text(formData, "address"), map_url: text(formData, "map_url"), phone: text(formData, "phone"), opening_hours: text(formData, "opening_hours"), status: text(formData, "status") ?? "unverified", description: text(formData, "description") ?? "", image_url: text(formData, "image_url"), image_alt: text(formData, "image_alt"), sort_order: Number(text(formData, "sort_order") ?? 0) };
  if (resource === "promotions") {
    const type = promotionType(formData);
    const price = Number(text(formData, "price") ?? 0);
    if (type === "combo" && price <= 0) throw new Error("invalid-combo-price");
    return { ...common, slug: text(formData, "slug"), name: text(formData, "name"), promotion_type: type, price: type === "topup_bonus" ? null : price, highlights: repeatedText(formData, "highlight", 5), note: text(formData, "note") ?? "", image_url: text(formData, "image_url"), branch_scope: text(formData, "branch_scope"), valid_from: text(formData, "valid_from"), valid_until: text(formData, "valid_until"), featured: checked(formData, "featured") };
  }
  if (resource === "tournaments") {
    const registrationUrl = text(formData, "registration_url");
    const registrationOpen = checked(formData, "registration_open");
    if (registrationUrl && !isValidWebUrl(registrationUrl)) throw new Error("invalid-registration-url");
    if (registrationOpen && !registrationUrl) throw new Error("registration-url-required");
    const facebookPostUrl = text(formData, "facebook_post_url");
    if (facebookPostUrl && !isValidWebUrl(facebookPostUrl)) throw new Error("invalid-facebook-post-url");
    const placements = [1, 2, 3].flatMap((position) => { const displayName = text(formData, `top_${position}`); return displayName ? [{ position, displayName }] : []; });
    const highlights = repeatedText(formData, "highlight", 5);
    return { ...common, slug: text(formData, "slug"), name: text(formData, "name"), game: text(formData, "game"), description: text(formData, "description") ?? "", held_on: text(formData, "held_on"), starts_at: text(formData, "starts_at"), ends_at: text(formData, "ends_at"), branch_name: text(formData, "branch_name"), placements, image_url: text(formData, "image_url"), image_alt: text(formData, "image_alt"), video_url: text(formData, "video_url"), video_provider: text(formData, "video_url") ? videoProvider(formData) : null, poster_url: text(formData, "poster_url"), status: registrationOpen ? "registration_open" : text(formData, "status") ?? "upcoming", registration_url: registrationUrl, registration_open: registrationOpen, entry_fee: text(formData, "entry_fee") ? Number(text(formData, "entry_fee")) : null, rules: text(formData, "rules"), show_in_hall_of_fame: checked(formData, "show_in_hall_of_fame"), featured: checked(formData, "featured"), sort_order: Number(text(formData, "sort_order") ?? 0), summary_title: text(formData, "summary_title"), summary_content: text(formData, "summary_content"), highlights, facebook_post_url: facebookPostUrl };
  }
  if (resource === "hall_of_fame_members") {
    if (checked(formData, "published") && !checked(formData, "consent_confirmed")) throw new Error("member-consent-required");
    return { ...common, display_name: text(formData, "display_name"), tier: text(formData, "tier"), period_label: text(formData, "period_label"), image_url: text(formData, "image_url"), image_alt: text(formData, "image_alt"), consent_confirmed: checked(formData, "consent_confirmed") };
  }
  if (resource === "site_images") return { ...common, image_key: text(formData, "image_key"), bucket: text(formData, "bucket"), object_path: text(formData, "object_path"), public_url: text(formData, "public_url"), alt_text: text(formData, "alt_text") };
  if (resource === "pc_tiers") return { ...common, slug: text(formData, "slug"), name: text(formData, "name"), subtitle: text(formData, "subtitle"), cpu: text(formData, "cpu"), gpu: text(formData, "gpu"), ram: text(formData, "ram"), monitor: text(formData, "monitor"), mainboard: text(formData, "mainboard"), storage: text(formData, "storage"), peripherals: text(formData, "peripherals"), note: text(formData, "note"), branch_scope: text(formData, "branch_scope"), sort_order: Number(text(formData, "sort_order") ?? 0), featured: checked(formData, "featured") };
  const mediaType = text(formData, "media_type") === "video" ? "video" : "image";
  const imageUrl = text(formData, "image_url");
  const videoUrl = text(formData, "video_url");
  if (mediaType === "image" && !imageUrl) throw new Error("gallery-image-required");
  if (mediaType === "video" && !videoUrl) throw new Error("gallery-video-required");
  return { ...common, title: text(formData, "title"), caption: text(formData, "caption"), media_type: mediaType, image_url: imageUrl, image_alt: text(formData, "image_alt"), video_url: videoUrl, video_provider: videoUrl ? videoProvider(formData) : null, poster_url: text(formData, "poster_url"), bucket: text(formData, "bucket"), sort_order: Number(text(formData, "sort_order") ?? 0) };
}

export async function saveContent(formData: FormData) {
  const resource = text(formData, "resource") as Resource | null;
  if (!resource || !resources.includes(resource)) return;
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  let uploadedMedia: Array<{ bucket: string; objectPath: string }> = [];
  let payload: Record<string, unknown>;
  let promotionTiers: ReturnType<typeof promotionTierPayload> = [];
  try {
    uploadedMedia = await uploadResourceMedia(supabase, resource, formData);
    payload = buildPayload(resource, formData);
    promotionTiers = resource === "promotions" && promotionType(formData) === "topup_bonus" ? promotionTierPayload(formData) : [];
  } catch (error) {
    await Promise.all(uploadedMedia.map((item) => supabase.storage.from(item.bucket).remove([item.objectPath])));
    redirect(dashboardReturn(formData, "saved", error instanceof Error ? error.message : "validation"));
  }
  if (resource === "promotions") {
    const { data, error } = id
      ? await supabase.from(resource).update(payload).eq("id", id).select("id").single()
      : await supabase.from(resource).insert(payload).select("id").single();
    if (error) {
      await Promise.all(uploadedMedia.map((item) => supabase.storage.from(item.bucket).remove([item.objectPath])));
      redirect(dashboardReturn(formData, "saved", error.message));
    }
    const promotionId = data?.id ?? id;
    if (promotionId) {
      const { error: deleteTierError } = await supabase.from("promotion_tiers").delete().eq("promotion_id", promotionId);
      if (deleteTierError) redirect(dashboardReturn(formData, "saved", deleteTierError.message));
      if (promotionTiers.length) {
        const { error: tierError } = await supabase.from("promotion_tiers").insert(promotionTiers.map((tier) => ({ ...tier, promotion_id: promotionId })));
        if (tierError) redirect(dashboardReturn(formData, "saved", tierError.message));
      }
    }
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    redirect(dashboardReturn(formData, "saved"));
  }

  const query = id ? supabase.from(resource).update(payload).eq("id", id) : supabase.from(resource).insert(payload);
  const { error } = await query;
  if (error) {
    await Promise.all(uploadedMedia.map((item) => supabase.storage.from(item.bucket).remove([item.objectPath])));
    redirect(dashboardReturn(formData, "saved", error.message));
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  redirect(dashboardReturn(formData, "saved"));
}

export async function deleteContent(formData: FormData) {
  const resource = text(formData, "resource") as Resource | null;
  const id = text(formData, "id");
  if (!resource || !resources.includes(resource) || !id) return;
  const supabase = await requireAdmin();
  const { error } = await supabase.from(resource).delete().eq("id", id);
  if (error) redirect(dashboardReturn(formData, "deleted", error.message));
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  redirect(dashboardReturn(formData, "deleted"));
}

export async function uploadImage(formData: FormData) {
  const supabase = await requireAdmin();
  const bucket = text(formData, "bucket");
  const imageKey = text(formData, "image_key");
  const altText = text(formData, "alt_text");
  const file = formData.get("file");
  if (!bucket || !buckets.includes(bucket as (typeof buckets)[number]) || !imageKey || !altText || !(file instanceof File)) return;
  if (!allowedImageTypes.includes(file.type as (typeof allowedImageTypes)[number]) || file.size === 0 || file.size > 5 * 1024 * 1024) redirect(dashboardReturn(formData, "uploaded", "invalid-image"));
  const extension = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
  const objectPath = `${Date.now()}-${randomUUID()}.${extension}`;
  const { data: existingImage } = await supabase.from("site_images").select("bucket, object_path").eq("image_key", imageKey).maybeSingle();
  const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, file, { contentType: file.type, upsert: false });
  if (uploadError) redirect(dashboardReturn(formData, "uploaded", uploadError.message));
  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  const { error } = await supabase.from("site_images").upsert({ image_key: imageKey, bucket, object_path: objectPath, public_url: publicUrl.publicUrl, alt_text: altText, published: false, verified: false }, { onConflict: "image_key" });
  if (error) {
    await supabase.storage.from(bucket).remove([objectPath]);
    redirect(dashboardReturn(formData, "uploaded", error.message));
  }
  if (existingImage?.bucket && existingImage.object_path && (existingImage.bucket !== bucket || existingImage.object_path !== objectPath)) {
    await supabase.storage.from(existingImage.bucket).remove([existingImage.object_path]);
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  redirect(dashboardReturn(formData, "uploaded"));
}
